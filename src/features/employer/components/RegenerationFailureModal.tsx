import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";


interface RegenerateFailureModalProps {
    open: boolean;
    taskLabel?: string;
    onRetry: () => void;
    onDismiss: () => void;
    isRetrying?: boolean;
}

const RegenerationFailureModal = ({
    open, taskLabel = "this task", onRetry, onDismiss, isRetrying,
}: RegenerateFailureModalProps) => {
    return (
        <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onDismiss()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-900/30 backdrop-blur-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <Dialog.Content
                    aria-describedby="regenerate-failure-description"
                    className={`fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-95 -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-white p-8 shadow-2xl shadow-neutral-950/15 border border-neutral-100/80 outline-none data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 
                    data-[state=closed]:fade-out-0 flex flex-col items-center text-center`}
                >
                    <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-error-50">
                        <AlertTriangle className="size-8 text-error-500" aria-hidden="true" />
                    </div>
                    <Dialog.Title className="text-xl font-bold tracking-tight text-neutral-900">
                        Regeneration failed
                    </Dialog.Title>
                    <Dialog.Description id="regenerate-failure-description" className="mt-1.5 text-sm text-neutral-500">
                        We couldn't regenerate {taskLabel}. Your previous content is still here — retry or dismiss.
                    </Dialog.Description>

                    <div className="mt-8 flex w-full gap-3">
                        <button
                            type="button"
                            onClick={onDismiss}
                            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-neutral-200 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 active:scale-[0.98]"
                        >
                            Dismiss
                        </button>
                        <button
                            type="button"
                            onClick={onRetry}
                            disabled={isRetrying}
                            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary-500 to-primary-700 text-sm font-medium text-white transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-60"
                        >
                            <RefreshCw className={cn("size-4", isRetrying && "animate-spin")} aria-hidden="true" />
                            {isRetrying ? "Retrying..." : "Try again"}
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default RegenerationFailureModal;