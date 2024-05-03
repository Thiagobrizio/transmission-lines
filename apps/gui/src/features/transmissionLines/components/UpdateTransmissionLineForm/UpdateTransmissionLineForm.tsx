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
import type { UpdateTransmissionLineInput } from "@repo/validators";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ButtonsWrapper, StyledForm } from "~/components/StyledForm";
import { SourceSelect } from "~/features/sources";
import { useUpdateTransmissionLineForm } from "~/utils/forms";
import toast from "~/utils/toast";
import trpc from "~/utils/trpc";

interface UpdateTransmissionLineFormProps {
    data: UpdateTransmissionLineInput;
}

export default function UpdateTransmissionLineForm({
    data,
}: UpdateTransmissionLineFormProps) {
    const navigate = useNavigate();
    const { t } = useTranslation("transmissionLine");

    const updateTransmissionLineMutation =
        trpc.transmissionLine.update.useMutation({
            async onSuccess(values) {
                toast.success(`${values.name} has been updated.`);
                await navigate({
                    to: "/projects/$projectId",
                    params: { projectId: values.projectId },
                });
            },
        });
    const form = useUpdateTransmissionLineForm(data);

    function onSubmit(values: UpdateTransmissionLineInput) {
        updateTransmissionLineMutation.mutate(values);
    }

    return (
        <Form {...form}>
            <StyledForm
                onSubmit={form.handleSubmit(onSubmit)}
                onReset={() => {
                    form.reset();
                }}
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>{t("name.label")}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder={t("name.placeholder")}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    {t("name.description")}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={form.control}
                    name="fromSourceId"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>{t("fromSource.label")}</FormLabel>
                                <FormControl>
                                    <SourceSelect
                                        projectId={data.projectId}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    {t("fromSource.description")}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={form.control}
                    name="toSourceId"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>{t("toSource.label")}</FormLabel>
                                <FormControl>
                                    <SourceSelect
                                        projectId={data.projectId}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    {t("toSource.description")}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
                <ButtonsWrapper>
                    <Button type="submit">Save</Button>
                </ButtonsWrapper>
            </StyledForm>
        </Form>
    );
}
