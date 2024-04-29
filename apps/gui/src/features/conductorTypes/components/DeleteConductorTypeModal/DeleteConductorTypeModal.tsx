import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertDialogPortal,
    AlertDialogTitle,
    buttonVariants,
} from "@repo/ui";
import { ConductorTypeID } from "@repo/validators/Ids";
import { useTranslation } from "react-i18next";

import BaseDeleteModal from "~/components/BaseDeleteModal";
import toast from "~/utils/toast";
import trpc from "~/utils/trpc";

export interface DeleteConductorTypeModalProps {
    typeId: ConductorTypeID;
    onClose: () => void;
}

export default function DeleteConductorTypeModal({
    typeId,
    onClose,
}: DeleteConductorTypeModalProps) {
    const utils = trpc.useUtils();
    const deleteMutation = trpc.conductorType.delete.useMutation({
        onError: (error) => {
            toast.error("Failed to delete conductor Type");
            console.log(error);
        },
        onSuccess: async (data) => {
            await utils.conductorType.getAll.invalidate();
            toast.success(`${data.name} has been deleted`);
        },
    });

    async function handleConfirm() {
        await deleteMutation.mutateAsync({ id: typeId });
    }

    return <BaseDeleteModal onClose={onClose} onConfirm={handleConfirm} />;
}
