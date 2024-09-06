import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@repo/ui/dialog";
import type { LineID } from "@repo/validators/Ids";
import { useTranslation } from "react-i18next";
import FormWrapper from "./FormWrapper";

export interface GenerateTowersModalProps {
    lineId: LineID;
    onClose: () => void;
}

export default function GenerateTowersModal({
    onClose,
    lineId,
}: GenerateTowersModalProps) {
    const { t } = useTranslation("generateTowers");

    return (
        <Dialog open defaultOpen onOpenChange={onClose}>
            <DialogHeader>
                <DialogTitle>{t("modalTitle")}</DialogTitle>
                <DialogDescription>{t("modalDescription")}</DialogDescription>
            </DialogHeader>
            <DialogContent>
                <FormWrapper lineId={lineId} onFinish={onClose} />
            </DialogContent>
        </Dialog>
    );
}
