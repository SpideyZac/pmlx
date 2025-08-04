import fs from "fs";
import path from "path";

import { applyPatch } from "diff";
import { isBinaryFileSync } from "isbinaryfile";

const patch = process.argv[2];
if (!patch) {
    throw new Error(
        "No patch file specified. Usage: node ./scripts/applyPatch.js <patch-file>"
    );
}

/**
 * @typedef {Object} FilePatch
 * @property {string} filePath - The path of the file being patched.
 * @property {'create' | 'delete' | 'modify'} action - The action taken on the file: 'create', 'delete', or 'modify'.
 * @property {string} patchText - The text representation of the patch.
 * @property {'bin' | 'text'} fileType - The type of the file: 'bin' for binary files, 'text' for text files.
 */

/**
 * Applies a series of patches to a file map.
 * @param {{ [filePath: string]: string }} fileMapA - The original file map.
 * @param {FilePatch[][]} filePatches - The patches to apply.
 * @returns {{ files: { [filePath: string]: string }, fileTypes: { [filePath: string]: 'bin' | 'text' }}} The updated file map and file types.
 */
function applyFilePatches(fileMapA, filePatches) {
    const files = { ...fileMapA };
    const fileTypes = {};

    filePatches.forEach((patchGroup) =>
        patchGroup.forEach(({ filePath, action, patchText, fileType }) => {
            if (action === "delete") {
                delete files[filePath];
            } else {
                // For 'create' and 'modify', we apply the patch to the existing content
                // or an empty string if the file is being created.

                const oldText = files[filePath] ?? "";
                const ps = JSON.parse(patchText);
                const res = applyPatch(oldText, ps);

                files[filePath] = res;
                fileTypes[filePath] = fileType;
            }
        })
    );

    return { files, fileTypes };
}

/**
 * Walks through a directory and its subdirectories, populating a file map with the contents of all files.
 * @param {string} dir The directory to walk through.
 * @param {string} relPath The relative path of the current directory (used for maintaining file structure).
 * @param {{ [filePath: string]: string }} fileMap The file map to populate with file contents.
 * @param {{ [filePath: string]: 'bin' | 'text' }} fileTypes The file types map to populate with file types.
 */
function walkDirectory(dir, relPath, fileMap, fileTypes) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const newRelPath = path.join(relPath, file).replace(/\\/g, "/");
        if (fs.statSync(fullPath).isDirectory()) {
            walkDirectory(fullPath, newRelPath, fileMap, fileTypes);
        } else {
            if (isBinaryFileSync(fullPath)) {
                fileMap[newRelPath] = fs
                    .readFileSync(fullPath)
                    .toString("base64");
                fileTypes[newRelPath] = "bin";
            } else {
                fileMap[newRelPath] = fs.readFileSync(fullPath, "utf8");
                fileTypes[newRelPath] = "text";
            }
        }
    });
}

const PATCHES_DIR = path.join(process.cwd(), "patches");
if (!fs.existsSync(PATCHES_DIR)) {
    throw new Error(`Patches directory does not exist: ${PATCHES_DIR}`);
}

const CORE_DIR = path.join(process.cwd(), "core");
if (!fs.existsSync(CORE_DIR)) {
    throw new Error(`Core directory does not exist: ${CORE_DIR}`);
}

const PATCHED_DIR = path.join(process.cwd(), "patched");
if (fs.existsSync(PATCHED_DIR)) {
    fs.rmSync(PATCHED_DIR, { recursive: true, force: true });
}
fs.mkdirSync(PATCHED_DIR, { recursive: true });

const PATCHED_TEMP_DIR = path.join(process.cwd(), "patched-temp");
if (fs.existsSync(PATCHED_TEMP_DIR)) {
    fs.rmSync(PATCHED_TEMP_DIR, { recursive: true, force: true });
}
fs.mkdirSync(PATCHED_TEMP_DIR, { recursive: true });

const coreFiles = {};
const coreFileTypes = {};
walkDirectory(CORE_DIR, "", coreFiles, coreFileTypes);

// Get the patches sorted by timestamp
let patchFiles = fs
    .readdirSync(PATCHES_DIR)
    .filter((file) => file.endsWith(".patch"))
    .sort((a, b) => {
        const timeA = parseInt(a.split("-")[0], 10);
        const timeB = parseInt(b.split("-")[0], 10);
        return timeA - timeB;
    });

// Delete any patch files (from the patchFiles to process) that come after the specified patch
const patchIndex = patchFiles.indexOf(patch);
if (patchIndex === -1) {
    throw new Error(`Patch file not found: ${patch}`);
}

patchFiles = patchFiles.slice(0, patchIndex + 1);

// Read and parse the patches
const filePatches = patchFiles.map((file) => {
    const filePath = path.join(PATCHES_DIR, file);
    const patchText = fs.readFileSync(filePath, "utf8");
    const patchData = JSON.parse(patchText);

    return patchData;
});

const { files: patchedFiles, fileTypes: patchedFileTypes } = applyFilePatches(
    coreFiles,
    filePatches
);

/**
 * Writes the patched files to the specified base directory.
 * @param {string} base_dir The base directory to write the patched files to.
 */
function writePatchedFiles(base_dir) {
    // Write the patched files to the specified base directory
    Object.entries(patchedFiles).forEach(([filePath, content]) => {
        const fullPath = path.join(base_dir, filePath);
        const dir = path.dirname(fullPath);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        if (patchedFileTypes[filePath] === "bin") {
            const buffer = Buffer.from(content, "base64");
            fs.writeFileSync(fullPath, buffer);
        } else {
            fs.writeFileSync(fullPath, content, "utf8");
        }
    });
}

writePatchedFiles(PATCHED_TEMP_DIR);
writePatchedFiles(PATCHED_DIR);
