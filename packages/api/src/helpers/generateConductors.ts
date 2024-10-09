import type {
    CreateConductorInput,
    GenerateConductorsInput,
} from "@repo/validators/schemas/Conductor.schema";

import { randomUUID } from "crypto";

export default function generateConductors(
    values: GenerateConductorsInput
): CreateConductorInput[] {
    const newConductors: CreateConductorInput[] = [];

    for (let i = 0; i < values.circuits; i = i + 1) {
        for (let j = 0; j < values.phases; j = j + 1) {
            newConductors.push({
                id: randomUUID(),
                name: `${String.fromCharCode(65 + j)}${i + 1}`,
                fromPhase: j + 1,
                toPhase: j + 1,
                bundleNumber: 1,
                isNeutral: false,
                bundleSpacing: 0,
                typeId: values.phaseTypeId,
                lineId: values.lineId,
            });
        }
    }
    for (let i = 0; i < values.neutrals; i = i + 1) {
        newConductors.push({
            id: randomUUID(),
            name: `N${i + 1}`,
            fromPhase: 99,
            toPhase: 99,
            isNeutral: true,
            bundleNumber: 1,
            bundleSpacing: 0,
            typeId: values.neutralTypeId,
            lineId: values.lineId,
        });
    }

    return newConductors;
}
