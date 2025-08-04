import fs from "fs";
import path from "path";

import { isBinaryFileSync } from "isbinaryfile";

/**
 * Recursively walks a directory and returns a list of all files.
 * @param {string} dir - The directory to walk.
 * @param {string} base - The base path for relative file paths.
 * @returns {string[]} - A list of all file paths.
 */
function walk(dir, base = "") {
    return fs.readdirSync(dir).flatMap((entry) => {
        const full = path.join(dir, entry);
        const rel = path.join(base, entry);
        return fs.statSync(full).isDirectory()
            ? walk(full, rel)
            : [
                  rel.replace(/\\/g, "/") +
                      (isBinaryFileSync(full) ? ".bin" : ".txt"),
              ]; // normalize Windows paths
    });
}

fs.writeFileSync("core-index.json", JSON.stringify(walk("core")));
fs.writeFileSync("patches-index.json", JSON.stringify(walk("patches")));
