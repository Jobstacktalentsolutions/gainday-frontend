import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
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
        {/* Blurred Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-900/30 backdrop-blur-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 transition-all duration-300" />

        {/* Modal Content */}
        <Dialog.Content
          aria-describedby="task-generation-description"
          className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-95 -translate-x-1/2 -translate-y-1/2 rounded-[28px] bg-white p-8 shadow-2xl shadow-neutral-950/15 border border-neutral-100/80 outline-none data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0 flex flex-col items-center text-center"
        >
          {/* Animated Glowing Badge */}
          <div className="relative mb-6 flex items-center justify-center">
            {/* Outer diffused pulsating glow halo */}
            <div className="modal-halo-glow absolute -inset-3 rounded-full bg-linear-to-tr from-blue-500/50 via-blue-600/60 to-indigo-600/50" />

            {/* Inner Ring Badge */}
            <div className="relative flex size-28 items-center justify-center rounded-full bg-white/95 border-[3.5px] border-blue-500/80 shadow-[0_0_24px_rgba(59,130,246,0.35)]">
              {/* Dynamic Pulsing Sparkles in blue gradient */}
              <svg
                viewBox="0 0 64 64"
                className="modal-sparkle-icon size-14 drop-shadow-sm"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="taskSparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>

                {/* Primary 4-point Sparkle */}
                <path
                  d="M32 8 C32 20 20 32 8 32 C20 32 32 44 32 56 C32 44 44 32 56 32 C44 32 32 20 32 8 Z"
                  fill="url(#taskSparkleGrad)"
                  stroke="url(#taskSparkleGrad)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />

                {/* Secondary small 4-point Sparkle top-right */}
                <path
                  d="M48 10 C48 15 44 19 39 19 C44 19 48 23 48 28 C48 23 52 19 57 19 C52 19 48 15 48 10 Z"
                  fill="url(#taskSparkleGrad)"
                  stroke="url(#taskSparkleGrad)"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <Dialog.Title className="text-2xl font-bold tracking-tight text-neutral-900">
            {title}
          </Dialog.Title>

          {/* Subtitle */}
          <Dialog.Description
            id="task-generation-description"
            className="mt-1.5 text-xs text-neutral-400 font-normal"
          >
            {subtitle}
          </Dialog.Description>

          {/* Cancel Button */}
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
