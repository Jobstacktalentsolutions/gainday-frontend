import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Sparkles } from "lucide-react";
import "../styles/TaskGenerationModal.css";

interface TaskGenerationModalProps {
  open: boolean;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
  cancelLabel?: string;
}

export const TaskGenerationModal: React.FC<TaskGenerationModalProps> = ({
  open,
  onCancel,
  title = "Generating tasks",
  subtitle = "This may take a while, please hold on...",
  cancelLabel = "Cancel",
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onCancel?.()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-900/30 backdrop-blur-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 transition-all duration-300" />

        <Dialog.Content
          aria-describedby="task-generation-description"
          className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-95 -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-white p-8 shadow-2xl shadow-neutral-950/15 border border-neutral-100/80 outline-none data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0 flex flex-col items-center text-center"
        >
          {/* Icon badge: rotating gradient ring, nothing else animated */}
          <div className="relative mb-6 flex size-28 items-center justify-center">
            <div className="modal-icon-ring absolute inset-0 rounded-full" />
            <div className="relative flex size-[calc(100%-8px)] items-center justify-center rounded-full bg-white">
              <Sparkles className="size-12 text-primary-600" strokeWidth={1.75} />
            </div>
          </div>

          <Dialog.Title className="text-2xl font-bold tracking-tight text-neutral-900">
            {title}
          </Dialog.Title>

          <Dialog.Description
            id="task-generation-description"
            className="mt-1.5 text-xs text-neutral-400 font-normal"
          >
            {subtitle}
          </Dialog.Description>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="mt-8 w-full cursor-pointer rounded-xl border border-primary-400/80 bg-white py-2.5 px-4 text-sm font-medium text-primary-600 transition-all hover:bg-primary-50/60 active:scale-[0.99]"
            >
              {cancelLabel}
            </button>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TaskGenerationModal;