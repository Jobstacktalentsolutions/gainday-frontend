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
          className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-[32px] bg-white p-8 shadow-2xl shadow-indigo-950/15 border border-neutral-100 outline-none data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0 flex flex-col items-center text-center"
        >
          {/* Animated Glowing Badge */}
          <div className="relative mt-2 mb-2 flex items-center justify-center">
            {/* Outer diffused pulsating glow halo */}
            <div className="modal-halo-glow" />

            {/* Gradient Ring Badge */}
            <div className="relative flex size-32 items-center justify-center rounded-full p-[4.5px] bg-gradient-to-b from-[#3b82f6] via-[#4338ca] to-[#93c5fd] shadow-[0_4px_24px_rgba(99,102,241,0.25)]">
              {/* Clean White Center */}
              <div className="flex size-full items-center justify-center rounded-full bg-white">
                {/* Outlined Sparkles with Copper-to-Indigo Gradient */}
                <svg
                  viewBox="0 0 72 72"
                  className="modal-sparkle-icon size-18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="taskSparkleGrad" x1="20%" y1="0%" x2="75%" y2="100%">
                      <stop offset="0%" stopColor="#78350f" />
                      <stop offset="35%" stopColor="#581c87" />
                      <stop offset="70%" stopColor="#312e81" />
                      <stop offset="100%" stopColor="#1e1b4b" />
                    </linearGradient>
                  </defs>

                  {/* Primary Large 4-point Sparkle */}
                  <path
                    d="M 33 16 Q 33 34 51 34 Q 33 34 33 52 Q 33 34 15 34 Q 33 34 33 16 Z"
                    stroke="url(#taskSparkleGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />

                  {/* Secondary Small 4-point Sparkle */}
                  <path
                    d="M 55 14 Q 55 22 63 22 Q 55 22 55 30 Q 55 22 47 22 Q 55 22 55 14 Z"
                    stroke="url(#taskSparkleGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <Dialog.Title className="mt-8 text-[28px] font-semibold tracking-tight text-[#0B0F2A] leading-tight">
            {title}
          </Dialog.Title>

          {/* Subtitle */}
          <Dialog.Description
            id="task-generation-description"
            className="mt-2 text-sm text-neutral-500 font-normal"
          >
            {subtitle}
          </Dialog.Description>

          {/* Cancel Button */}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="mt-8 w-full cursor-pointer rounded-2xl border-[1.5px] border-[#4338ca] bg-white py-3 px-4 text-base font-medium text-[#4338ca] transition-all hover:bg-[#eef2ff] active:scale-[0.99]"
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

