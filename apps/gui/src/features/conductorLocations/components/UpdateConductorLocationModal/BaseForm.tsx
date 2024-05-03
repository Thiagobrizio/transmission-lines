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
import type { ConductorLocationFormInput } from "@repo/validators/forms";
import type { FieldErrors } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyledForm } from "~/components/StyledForm";
import { useUpdateConductorLocationForm } from "~/utils/forms";

interface UpdateConductorLocationFormProps {
    data: ConductorLocationFormInput;
    onValid: (values: ConductorLocationFormInput) => void;
    onInvalid: (errors: FieldErrors<ConductorLocationFormInput>) => void;
}

export default function BaseForm({
    data,
    onValid,
    onInvalid,
}: UpdateConductorLocationFormProps) {
    const form = useUpdateConductorLocationForm(data);
    const { t } = useTranslation("updateConductorLocationModal");

    const handleSubmit = form.handleSubmit(
        (values) => {
            onValid(values);
        },
        (errors) => {
            onInvalid(errors);
        }
    );

    return (
        <Form {...form}>
            <StyledForm
                aria-label="updateConductorLocation"
                onSubmit={handleSubmit}
            >
                <FormField
                    control={form.control}
                    name="x"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>{t("x.label")}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormDescription>
                                    {t("x.description")}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />
                <FormField
                    control={form.control}
                    name="y"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>{t("y.label")}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormDescription>
                                    {t("y.description")}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />

                <Button type="submit">{t("form:submit")}</Button>
            </StyledForm>
        </Form>
    );
}
