import type { DBContext } from "@repo/db";

import { createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from "cors";

import type { Electron } from "./context";
import type { Store } from "./store";

import { appRouter } from "./routers";

const createServer = (
    dataSource: DBContext,
    electron: Electron,
    store: Store
) => {
    const server = createHTTPServer({
        middleware: cors(),
        createContext() {
            return { db: dataSource.db, electron, store };
        },
        router: appRouter,
    });
    return server;
};

export default createServer;
