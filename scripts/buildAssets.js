import fs from "fs";
import path from "path";
import { zipSync } from "fflate";

const cwd = process.cwd();
const distPath = path.join(cwd, "./dist/pmlx.zip");
const filesToZip = [
    {
        src: path.join(cwd, "./dist/pmlx/release/pmlx.bundle.js"),
        dest: "release-pmlx.bundle.js",
    },
    {
        src: path.join(cwd, "./dist/pmlx/debug/pmlx.bundle.js"),
        dest: "debug-pmlx.bundle.js",
    },
    { src: path.join(cwd, "./patches/"), dest: "patches/" },
    { src: path.join(cwd, "./patches-index.json"), dest: "patches-index.json" },
    { src: path.join(cwd, "./launcher.html"), dest: "launcher.html" },
];

/**
 * Builds the assets into a zip file.
 */
function buildAssets() {
    const zipEntries = {};

    for (const { src, dest } of filesToZip) {
        const stat = fs.statSync(src);
        if (stat.isDirectory()) {
            const files = fs.readdirSync(src);
            for (const file of files) {
                const filePath = path.join(src, file);
                const fileStat = fs.statSync(filePath);
                if (fileStat.isFile()) {
                    const content = fs.readFileSync(filePath);
                    zipEntries[`${dest}${file}`] = new Uint8Array(content);
                }
            }
        } else {
            const content = fs.readFileSync(src);
            zipEntries[dest] = new Uint8Array(content);
        }
    }

    const zipData = zipSync(zipEntries);
    fs.writeFileSync(distPath, zipData);

    console.log("Assets built successfully!");
}

buildAssets();
