import { z } from "zod";
import { baseElementSchema } from "./base";
import { allUnitsSchema, unitsSchema } from "@/enums";

export const wireDataSchema = baseElementSchema.extend({
    rdc: z.number().optional(),
    rac: z.number().optional(),
    rUnits: unitsSchema.optional(),
    gmrac: z.number().optional(),
    gmrUnits: allUnitsSchema.optional(),
    radius: z.number().optional(),
    radUnits: allUnitsSchema.optional(),
    normAmps: z.number().optional(),
    emergAmps: z.number().optional(),
    diam: z.number().optional(),
    seasons: z.number().optional(),
    ratings: z.number().array().optional(),
    capRadius: z.number().optional(),
});

export type WireDataInput = z.infer<typeof wireDataSchema>;

export const opendssWireDataSchema = baseElementSchema.extend({
    rdc: z.string().optional(),
    rac: z.string().optional(),
    rUnits: unitsSchema.optional(),
    gmrac: z.string().optional(),
    gmrUnits: allUnitsSchema.optional(),
    radius: z.string().optional(),
    radUnits: allUnitsSchema.optional(),
    normAmps: z.string().optional(),
    emergAmps: z.string().optional(),
    diam: z.string().optional(),
    seasons: z.string().optional(),
    ratings: z.string().optional(),
    capRadius: z.string().optional(),
});

export type OpenDSSWireData = z.infer<typeof opendssWireDataSchema>;
