import * as Dialog from "@radix-ui/react-dialog"
import { AlertTriangle } from "lucide-react"

interface ConfirmOverwriteModalProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;

}


const ConfirmOverwriteModal = ({ open, onConfirm, onCancel }: ConfirmOverwriteModalProps) => {
    return (
        <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-900/30 backdrop-blur-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <Dialog.Content
                    aria-describedby="confirm-overwrite-description"
                    className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-95 -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-white p-8 shadow-2xl shadow-neutral-950/15 border border-neutral-100/80 outline-none data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0 flex flex-col items-center text-center"
                >
                    <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-secondary-50">
                        <AlertTriangle className="size-8 text-secondary-500" aria-hidden="true" />
                    </div>

                    <Dialog.Title className="text-xl font-bold tracking-tight text-neutral-900">
                        Replace current entries?
                    </Dialog.Title>
                    <Dialog.Description id="confirm-overwrite-description" className="mt-1.5 text-sm text-neutral-500">
                        Parsing this job description will overwrite the fields below with what we extract from
                        the pasted text. This can't be undone.
                    </Dialog.Description>

                    <div className="mt-8 flex w-full gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex h-11 flex-1 items-center justify-center rounded-xl border cursor-pointer border-neutral-200 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 active:scale-[0.98]"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="flex h-11 flex-1 items-center justify-center rounded-xl cursor-pointer bg-primary-500 hover:bg-primary-400 text-sm font-medium text-white transition-all hover:shadow-md active:scale-[0.98]"
                        >
                            Overwrite
                        </button>
                    </div>

                </Dialog.Content>
            </Dialog.Portal>

        </Dialog.Root>
    )
}

export default ConfirmOverwriteModal;