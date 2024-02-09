import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ROUTES from "@/router/routes";
import { styled } from "@linaria/react";
import { toast } from "sonner";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
} from "@repo/ui";
import {
    updateTowerGeometrySchema,
    UpdateTowerGeometryInput,
} from "@repo/validators/schemas/TowerGeometry.schema";

import trpc from "@/utils/trpc";
import ConductorLocationTable from "../ConductorLocationTable";
// import TowerGeometryDiagram from "../TowerGeometryDiagram";

interface Props {
    id: number;
}

const EditTowerGeometryForm: React.FC<Props> = ({ id }) => {
    const { data, error, isLoading } = trpc.towerGeometry.getById.useQuery({
        id,
    });
    console.log("data: ", data);

    const navigate = useNavigate();
    const { t } = useTranslation("towerGeometry");
    const updateTowerGeometryMutation = trpc.towerGeometry.update.useMutation();
    const form = useForm<UpdateTowerGeometryInput>({
        resolver: zodResolver(updateTowerGeometrySchema),
        values: data,
    });

    if (isLoading) {
        return <div>{t("general:loading")}</div>;
    }
    if (error || !data) {
        return <div>{t("general:errorMessage")}</div>;
    }

    async function onSubmit(values: UpdateTowerGeometryInput) {
        console.log(values);
        await updateTowerGeometryMutation.mutateAsync(values);
        if (updateTowerGeometryMutation.error) {
            console.log(updateTowerGeometryMutation.error);
            return;
        }
        toast.success(`${values.name} has been updated.`, {
            description: format(new Date(), "PPPPpp"),
        });
        navigate(ROUTES.ALL_TOWER_GEOMETRIES.path);
    }

    return (
        <Form {...form}>
            <StyledForm
                onSubmit={form.handleSubmit(onSubmit)}
                onReset={() => form.reset()}
            >
                <LeftSide>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("name.label")}</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    {t("name.description")}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <ConductorLocationTable />
                    <ButtonsContainer>
                        <Button type="submit">{t("form:submit")}</Button>
                    </ButtonsContainer>
                </LeftSide>
                <RightSide>{/* <TowerGeometryDiagram /> */}</RightSide>
            </StyledForm>
        </Form>
    );
};

export default EditTowerGeometryForm;

const StyledForm = styled.form`
    display: flex;
    gap: 2rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
`;
const LeftSide = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 600px;
    gap: 2rem;
`;
const RightSide = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
`;

const ButtonsContainer = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
`;
