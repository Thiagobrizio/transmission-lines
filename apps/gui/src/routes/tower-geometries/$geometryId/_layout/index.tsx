import {
    Card,
    CardContent,
    CardHeader,
    CardHeaderText,
    CardTitle,
} from "@repo/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { UpdateTowerGeometryForm } from "~/features/towerGeometries";
import trpc from "~/utils/trpc";

export const Route = createFileRoute("/tower-geometries/$geometryId/_layout/")({
    component: TowerGeometryGeneral,
    beforeLoad: () => ({
        text: "View Tower Geometry",
    }),
});

export default function TowerGeometryGeneral() {
    const { t } = useTranslation("towerGeometry");
    const { geometryId } = Route.useParams();

    return (
        <Card>
            <CardHeader>
                <CardHeaderText>
                    <CardTitle>{t("edit.title")}</CardTitle>
                </CardHeaderText>
            </CardHeader>
            <CardContent>
                <UpdateTowerGeometryForm geometryId={geometryId} />
            </CardContent>
        </Card>
    );
}
