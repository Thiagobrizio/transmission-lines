import { join } from "path";
import { builtinModules } from "module";

const PACKAGE_ROOT = __dirname;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
    mode: process.env.MODE,
    root: PACKAGE_ROOT,
    envDir: process.cwd(),
    resolve: {
        alias: {
            "/@/": join(PACKAGE_ROOT, "src") + "/",
        },
    },
    build: {
        sourcemap: "inline",
        target: `node20`,
        outDir: "dist",
        assetsDir: ".",
        minify: process.env.MODE !== "development",
        lib: {
            entry: "src/index.ts",
            formats: ["es"],
        },
        rollupOptions: {
            external: [
                "electron",
                "electron-devtools-installer",
                ...builtinModules.flatMap((p) => [p, `node:${p}`]),
            ],
            output: {
                entryFileNames: "[name].js",
            },
        },
        emptyOutDir: true,
        brotliSize: false,
    },
};

export default config;
