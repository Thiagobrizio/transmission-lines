import { useTranslation } from "react-i18next";
import columns from "./columns";
import DataTable from "~/components/DataTable";
import trpc from "~/utils/trpc";

export default function GeometriesTable() {
    const { t } = useTranslation("towerGeometry");
    const {
        data = [],
        error,
        isLoading,
    } = trpc.towerGeometry.getAll.useQuery();

    if (error) {
        return <div>{t("general:errorMessage")}</div>;
    }
    if (isLoading) {
        return <div>{t("general:loading")}</div>;
    }

    return <DataTable data={data} columns={columns} />;
}
