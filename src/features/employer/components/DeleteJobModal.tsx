import * as Dialog from "@radix-ui/react-dialog";
import { Trash2, Loader2 } from "lucide-react";
import type { Job } from "../types/job";

interface DeleteJobModalProps {
    open: boolean;
    job: Job | null;
    onConfirm: () => void;
    onDismiss: () => void;
    isDeleting?: boolean;
}

const DeleteJobModal = ({
    open,
    job,
    onConfirm,
    onDismiss,
    isDeleting = false,
}: DeleteJobModalProps) => {
    if (!job) return null;

    const isDraft = job.status === "DRAFT";
    const jobTitle = job.title || "Untitled job";

    return (
        <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onDismiss()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-900/30 backdrop-blur-xs data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 transition-all duration-200" />
                <Dialog.Content
                    aria-describedby="delete-job-description"
                    className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-white p-7 shadow-2xl shadow-neutral-950/15 border border-neutral-100/80 outline-none data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0 flex flex-col items-center text-center"
                >
                    <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <Trash2 className="size-7" aria-hidden="true" />
                    </div>

                    <Dialog.Title className="text-xl font-bold tracking-tight text-neutral-900">
                        {isDraft ? "Delete draft job" : "Delete job"}
                    </Dialog.Title>

                    <Dialog.Description id="delete-job-description" className="mt-2 text-sm text-neutral-500 leading-relaxed">
                        Are you sure you want to delete <span className="font-semibold text-neutral-900">"{jobTitle}"</span>? This action cannot be undone and will permanently remove this job and its configuration.
                    </Dialog.Description>

                    <div className="mt-7 flex w-full gap-3">
                        <button
                            type="button"
                            onClick={onDismiss}
                            disabled={isDeleting}
                            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-neutral-200 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-medium text-white transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-60 cursor-pointer shadow-sm"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                                    <span>Deleting...</span>
                                </>
                            ) : (
                                <span>Delete Job</span>
                            )}
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default DeleteJobModal;
