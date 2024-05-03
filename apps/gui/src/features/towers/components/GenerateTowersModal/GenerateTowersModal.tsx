import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    NumberInput,
} from "@repo/ui";
import type { LineID } from "@repo/validators/Ids";
import { useTranslation } from "react-i18next";
import { StyledForm } from "~/components/StyledForm";
import { TowerGeometrySelect } from "~/features/towerGeometries";
import { useGenerateTowersForm } from "~/utils/forms";
import trpc from "~/utils/trpc";

export interface GenerateTowersModalProps {
    lineId: LineID;
    onClose: () => void;
}

export default function GenerateTowersModal({
    onClose,
    lineId,
}: GenerateTowersModalProps) {
    const { t } = useTranslation("generateTowers");
    const utils = trpc.useUtils();
    const generateMutation = trpc.tower.generate.useMutation({
        async onSuccess(values) {
            await utils.tower.getAllByLineId.invalidate({
                lineId,
            });
            onClose();
        },
    });
    const form = useGenerateTowersForm();

    const handleSubmit = form.handleSubmit(async (values) => {
        generateMutation.mutate({ ...values, lineId });
    });

    return (
        <Dialog open defaultOpen onOpenChange={onClose}>
            <DialogContent>
                <Form {...form}>
                    <StyledForm
                        onSubmit={handleSubmit}
                        onReset={() => {
                            form.reset();
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>{t("modalTitle")}</DialogTitle>
                            <DialogDescription>
                                {t("modalDescription")}
                            </DialogDescription>
                        </DialogHeader>

                        <FormField
                            control={form.control}
                            name="namePrefix"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            {t("namePrefix.label")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            {t("namePrefix.description")}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="geometryId"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            {t("geometryId.label")}
                                        </FormLabel>
                                        <FormControl>
                                            <TowerGeometrySelect {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            {t("geometryId.description")}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="numTowers"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            {t("numTowers.label")}
                                        </FormLabel>
                                        <FormControl>
                                            <NumberInput
                                                type="number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            {t("numTowers.description")}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="resistance"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            {t("resistance.label")}
                                        </FormLabel>
                                        <FormControl>
                                            <NumberInput
                                                type="number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            {t("resistance.description")}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="distance"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            {t("distance.label")}
                                        </FormLabel>
                                        <FormControl>
                                            <NumberInput
                                                type="number"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            {t("distance.description")}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />

                        <DialogFooter>
                            <Button type="submit">{t("form:generate")}</Button>
                        </DialogFooter>
                    </StyledForm>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
