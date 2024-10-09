import { forwardRef } from "react";
import { useTranslation } from "react-i18next";

import BaseSelect, { type BaseSelectProps } from "~/components/BaseSelect";
import trpc from "~/utils/trpc";

interface TowerGeometrySelectProps extends Omit<BaseSelectProps, "data"> {}

const TowerGeometrySelect = forwardRef<
    HTMLButtonElement,
    TowerGeometrySelectProps
>((props, ref) => {
    const { t } = useTranslation("towerGeometrySelect");
    const { data, error, isLoading } = trpc.towerGeometry.getAll.useQuery();

    if (isLoading) {
        return <div>{t("general:loading")}</div>;
    }
    if (error || !data) {
        return <div>{t("general:errorMessage")}</div>;
    }

    return <BaseSelect data={data} ref={ref} {...props} />;
});

TowerGeometrySelect.displayName = "TowerGeometrySelect";

export default TowerGeometrySelect;
