import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { RefreshCw } from "lucide-react";
import { FormTextarea } from "@/components/form/FormTextarea";

interface RegenerateGuidanceModalProps {
    open: boolean;
    onCancel: () => void;
    onSubmit: (guidance?: string) => void;
}

// Optional direction for a single-task regenerate. With a direction, the backend EDITS the
// existing task to match it (keeps everything else); left blank, it writes a brand-new task
// instead — two different backend paths in GenerationService.regenerateTask, not one with a hint.
const RegenerateGuidanceModal = ({
    open,
    onCancel,
    onSubmit,
}: RegenerateGuidanceModalProps) => {
    const [guidance, setGuidance] = useState("");

    const handleSubmit = () => {
        onSubmit(guidance.trim() || undefined);
        setGuidance("");
    };

    return (
        <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-900/30 backdrop-blur-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <Dialog.Content
                    aria-describedby="regenerate-guidance-description"
                    className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-110 -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-white p-8 shadow-2xl shadow-neutral-950/15 border border-neutral-100/80 outline-none data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0"
                >
                    <Dialog.Title className="text-xl font-bold tracking-tight text-neutral-900">
                        Regenerate this task
                    </Dialog.Title>
                    <Dialog.Description
                        id="regenerate-guidance-description"
                        className="mt-1.5 text-sm text-neutral-500"
                    >
                        Tell us what to change and we'll edit this exact task — everything else stays
                        as-is. Leave it blank instead for a completely fresh, unrelated task.
                    </Dialog.Description>

                    <div className="mt-6">
                        <FormTextarea
                            label="What should change"
                            hideLabel
                            optional
                            rows={4}
                            placeholder="e.g. make the numbers larger, or change the recipient to legal..."
                            value={guidance}
                            onChange={(e) => setGuidance(e.target.value)}
                        />
                    </div>

                    <div className="mt-8 flex w-full gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-neutral-200 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 active:scale-[0.98]"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary-500 to-primary-700 text-sm font-medium text-white transition-all hover:shadow-md active:scale-[0.98]"
                        >
                            <RefreshCw className="size-4" aria-hidden="true" />
                            Regenerate
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default RegenerateGuidanceModal;
