import { eq } from "@repo/db/drizzle";
import { transmissionLines } from "@repo/db/schemas/transmissionLines";
import {
    createTransmissionLineSchema,
    deleteTransmissionLineSchema,
    getAllTransmissionLinesByProjectIdSchema,
    getAllTransmissionLinesSchema,
    getTransmissionLineByIdSchema,
    updateTransmissionLineSchema,
} from "@repo/validators/schemas/TransmissionLine.schema";
import { publicProcedure, router } from "../trpc";

export default router({
    getAll: publicProcedure
        .input(getAllTransmissionLinesSchema)
        .query(async ({ ctx: { db }, input }) => {
            const allTransmissionLines =
                await db.query.transmissionLines.findMany({
                    where: eq(transmissionLines.projectId, input.projectId),
                });

            return allTransmissionLines;
        }),
    getAllByProjectId: publicProcedure
        .input(getAllTransmissionLinesByProjectIdSchema)
        .query(async ({ ctx: { db }, input }) => {
            const allTransmissionLines =
                await db.query.transmissionLines.findMany({
                    where: eq(transmissionLines.projectId, input.projectId),
                    with: {
                        fromSource: true,
                        toSource: true,
                    },
                });

            return allTransmissionLines;
        }),
    getById: publicProcedure
        .input(getTransmissionLineByIdSchema)
        .query(async ({ input, ctx: { db } }) => {
            const transmissionLine = await db.query.transmissionLines.findFirst(
                {
                    where: eq(transmissionLines.id, input.id),
                }
            );

            if (!transmissionLine) {
                throw new Error("Can't find transmission line");
            }

            return transmissionLine;
        }),
    create: publicProcedure
        .input(createTransmissionLineSchema)
        .mutation(async ({ input, ctx: { db } }) => {
            const [newTransmissionLine] = await db
                .insert(transmissionLines)
                .values(input)
                .returning();

            if (!newTransmissionLine) {
                throw new Error("Can't create source");
            }

            return newTransmissionLine;
        }),
    update: publicProcedure
        .input(updateTransmissionLineSchema)
        .mutation(async ({ input, ctx: { db } }) => {
            const [updatedTranmissionLine] = await db
                .update(transmissionLines)
                .set(input)
                .where(eq(transmissionLines.id, input.id))
                .returning();

            if (!updatedTranmissionLine) {
                throw new Error("Can't update transmission line");
            }

            return updatedTranmissionLine;
        }),
    delete: publicProcedure
        .input(deleteTransmissionLineSchema)
        .mutation(async ({ input, ctx: { db } }) => {
            const [deletedTranmissionLine] = await db
                .delete(transmissionLines)
                .where(eq(transmissionLines.id, input.id))
                .returning();

            if (!deletedTranmissionLine) {
                throw new Error("Can't delete transmission line");
            }

            return deletedTranmissionLine;
        }),
});
