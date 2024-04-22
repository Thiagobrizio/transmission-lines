/* eslint-disable import/no-cycle */

import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuidv4 } from "uuid";

import { projects } from "./projects";
import { transmissionLines } from "./transmissionLines";

export const sources = sqliteTable("sources", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => uuidv4()),
    name: text("name").notNull(),
    phases: integer("phases").notNull(),
    voltage: integer("voltage").notNull(),
    x1r1: integer("x1r1").notNull(),
    x0r0: integer("x0r0").notNull(),
    isc3: integer("isc3").notNull(),
    isc1: integer("isc1").notNull(),
    resistance: integer("resistance").notNull(),
    frequency: integer("frequency").notNull(),
    enabled: integer("id", { mode: "boolean" }).notNull(),
    projectId: text("project_id")
        .references(() => projects.id)
        .notNull(),
});

export type Source = typeof sources.$inferSelect;
export type NewSource = typeof sources.$inferInsert;

export const sourcesRelations = relations(sources, ({ one, many }) => ({
    project: one(projects, {
        fields: [sources.projectId],
        references: [projects.id],
    }),
    startingLines: many(transmissionLines, { relationName: "fromSource" }),
    finishingLines: many(transmissionLines, { relationName: "toSource" }),
}));
