import { eq } from "@repo/db/drizzle";
import {
    NewConductorLocation,
    conductorLocations,
} from "@repo/db/schemas/conductorLocations";
import { towerGeometries } from "@repo/db/schemas/towerGeometries";
import {
    createTowerGeometrySchema,
    deleteTowerGeometrySchema,
    getAllTowerGeometriesSchema,
    getTowerGeometryByIdSchema,
    updateTowerGeometrySchema,
} from "@repo/validators";

import { publicProcedure, router } from "../trpc";

export default router({
    getAll: publicProcedure
        .input(getAllTowerGeometriesSchema)
        .query(async ({ ctx: { db } }) => {
            const allTowerGeometries =
                await db.query.towerGeometries.findMany();
            return allTowerGeometries;
        }),
    getById: publicProcedure
        .input(getTowerGeometryByIdSchema)
        .query(async ({ input, ctx: { db } }) => {
            const towerGeometry = await db.query.towerGeometries.findFirst({
                where: eq(towerGeometries.id, input.id),
            });
            if (!towerGeometry) throw Error("Can't find tower geometry");
            return towerGeometry;
        }),
    create: publicProcedure
        .input(createTowerGeometrySchema)
        .mutation(async ({ input, ctx: { db } }) => {
            const [newTowerGeometry] = await db
                .insert(towerGeometries)
                .values(input)
                .returning();
            if (!newTowerGeometry) {
                throw Error("Failed to create a new Tower Geometry");
            }

            return newTowerGeometry;
        }),
    update: publicProcedure
        .input(updateTowerGeometrySchema)
        .mutation(async ({ input, ctx: { db } }) => {
            const [updatedTowerGeometry] = await db
                .update(towerGeometries)
                .set(input)
                .where(eq(towerGeometries.id, input.id))
                .returning();
            if (!updatedTowerGeometry)
                throw Error("Can't update tower geometry");

            return updatedTowerGeometry;
        }),
    delete: publicProcedure
        .input(deleteTowerGeometrySchema)
        .mutation(async ({ input, ctx: { db } }) =>
            db.transaction((tx) => {
                tx.delete(conductorLocations)
                    .where(eq(conductorLocations.geometryId, input.id))
                    .run();
                const deletedTowerGeometry = tx
                    .delete(towerGeometries)
                    .where(eq(towerGeometries.id, input.id))
                    .returning()
                    .get();
                if (!deletedTowerGeometry) {
                    tx.rollback();
                    throw Error("Can't delete tower geometry");
                }
                return deletedTowerGeometry;

                // return deletedTowerGeometry;
            })
        ),
});
