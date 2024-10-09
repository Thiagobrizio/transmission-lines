#!/usr/bin/env node

import { spawn } from "child_process";
import electronPath from "electron";
import { build, createLogger, createServer } from "vite";

/** @type 'production' | 'development'' */
const mode = (process.env.MODE = process.env.MODE || "development");

/** @type {import('vite').LogLevel} */
const LOG_LEVEL = "info";

/** @type {import('vite').InlineConfig} */
const sharedConfig = {
    mode,
    build: {
        watch: {},
    },
    logLevel: LOG_LEVEL,
};

/**
 * @param {{name: string; configFile: string; writeBundle: import('rollup').OutputPlugin['writeBundle'] }} param0
 */
const getWatcher = ({ name, configFile, writeBundle }) => {
    return build({
        ...sharedConfig,
        configFile,
        plugins: [{ name, writeBundle }],
    });
};

/**
 * Start or restart App when source files are changed
 * @param {{config: {server: import('vite').ResolvedServerOptions}}} ResolvedServerOptions
 */
const setupMainPackageWatcher = ({ config: { server } }) => {
    // Create VITE_DEV_SERVER_URL environment variable to pass it to the main process.
    {
        const protocol = server.https ? "https:" : "http:";
        const host = server.host || "localhost";
        const port = server.port; // Vite searches for and occupies the first free port: 3000, 3001, 3002 and so on
        const path = "/";
        process.env.VITE_DEV_SERVER_URL = `${protocol}//${host}:${port}${path}`;
    }

    const logger = createLogger(LOG_LEVEL, {
        prefix: "[main]",
    });

    /** @type {ChildProcessWithoutNullStreams | null} */
    let spawnProcess = null;

    return getWatcher({
        name: "reload-app-on-main-package-change",
        configFile: "vite.config.js",
        writeBundle() {
            if (spawnProcess !== null) {
                spawnProcess.off("exit", process.exit);
                spawnProcess.kill("SIGINT");
                spawnProcess = null;
            }

            spawnProcess = spawn(String(electronPath), ["."]);

            spawnProcess.stdout.on(
                "data",
                (d) =>
                    d.toString().trim() &&
                    logger.warn(d.toString(), { timestamp: true })
            );
            spawnProcess.stderr.on("data", (d) => {
                const data = d.toString().trim();
                if (!data) return;
                logger.error(data, { timestamp: true });
            });

            // Stops the watch script when the application has been quit
            spawnProcess.on("exit", process.exit);
        },
    });
};

// /**
//  * Start or restart App when source files are changed
//  * @param {{ws: import('vite').WebSocketServer}} WebSocketServer
//  */
// const setupPreloadPackageWatcher = ({ ws }) =>
//     getWatcher({
//         name: "reload-page-on-preload-package-change",
//         configFile: "layers/preload/vite.config.js",
//         writeBundle() {
//             // Generating exposedInMainWorld.d.ts when preload package is changed.

//             ws.send({
//                 type: "full-reload",
//             });
//         },
//     });

(async () => {
    try {
        const viteDevServer = await createServer({
            ...sharedConfig,
        });

        await viteDevServer.listen();

        // await setupPreloadPackageWatcher(viteDevServer);
        await setupMainPackageWatcher(viteDevServer);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
