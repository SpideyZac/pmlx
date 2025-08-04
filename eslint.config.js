import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js },
        extends: ["js/recommended"],
    },

    // patched-temp maybe?
    {
        files: [
            "{core,patched}/!(simulation_worker.bundle).{js,mjs,cjs,ts,mts,cts}",
        ],
        languageOptions: { globals: globals.browser },
    },
    {
        files: [
            "{core,patched}/simulation_worker.bundle.{js,mjs,cjs,ts,mts,cts}",
        ],
        languageOptions: { globals: globals.worker },
    },
    {
        files: ["{core,patched}/electron/*.{js,mjs,cjs,ts,mts,cts}"],
        languageOptions: { globals: globals.node },
    },

    { files: ["sw.js"], languageOptions: { globals: globals.serviceworker } },

    {
        files: ["scripts/*.{js,mjs,cjs,ts,mts,cts}"],
        languageOptions: { globals: globals.node },
    },

    {
        files: ["src/**/*.ts"],
        plugins: { tseslint },
        languageOptions: {
            parserOptions: tseslint.parserOptions,
            globals: globals.browser,
        },
    },

    tseslint.configs.recommended,
]);
