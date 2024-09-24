import NiceModal from "@ebay/nice-modal-react";
import type { SourceID } from "@repo/validators/Ids";
import BaseDeleteModal from "~/components/BaseDeleteModal";
import toast from "~/utils/toast";
import trpc from "~/utils/trpc";

export interface DeleteSourceModalProps {
    onClose: () => void;
    sourceId: SourceID;
}

export default NiceModal.create(
    ({ onClose, sourceId }: DeleteSourceModalProps) => {
        const utils = trpc.useUtils();
        const deleteMutation = trpc.source.delete.useMutation({
            async onSuccess(values) {
                toast.success(`Source ${values.name} deleted`);
                await utils.source.getAllByProjectId.invalidate({
                    projectId: values.projectId,
                });
            },
            onError(error) {
                toast.error("Failed to delete source");
                console.error("Failed to delete source", error);
            },
        });

        function handleConfirm() {
            deleteMutation.mutate({
                id: sourceId,
            });
        }

        return <BaseDeleteModal onClose={onClose} onConfirm={handleConfirm} />;
    }
);
