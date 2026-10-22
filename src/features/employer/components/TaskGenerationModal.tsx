import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import "../styles/TaskGenerationModal.css";
import type { GenerationProgress } from "../types/generationProgress";
import { describeStage, formatTimeRemaining } from "../utils/generationProgress";

interface TaskGenerationModalProps {
  open: boolean;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
  cancelLabel?: string;
  /** Null while queued and not yet started, which shows the indeterminate ring. */
  progress?: GenerationProgress | null;
  secondsRemaining?: number | null;
  failed?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  retryLabel?: string;
}

export const TaskGenerationModal: React.FC<TaskGenerationModalProps> = ({
  open,
  onCancel,
  title = "Generating tasks",
  subtitle = "This may take a while, please hold on...",
  cancelLabel = "Cancel",
  progress = null,
  secondsRemaining = null,
  failed = false,
  errorMessage = null,
  onRetry,
  retryLabel = "Try again",
}) => {
  const ringSweep = progress ? `${Math.max(progress.percent, 4) * 3.6}deg` : undefined;
  const headline = failed ? "Generation failed" : title;
  const description = failed
    ? (errorMessage ?? "Something went wrong while generating your tasks.")
    : progress
      ? describeStage(progress)
      : subtitle;

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onCancel?.()}>
      <Dialog.Portal>
        {/* Blurred Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-neutral-900/30 backdrop-blur-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 transition-all duration-300" />

        {/* Modal Content */}
        <Dialog.Content
          aria-describedby="task-generation-description"
          className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-97.5 -translate-x-1/2 -translate-y-1/2 rounded-[32px] bg-white p-8 shadow-2xl shadow-indigo-950/15 border border-neutral-100 outline-none data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0 flex flex-col items-center text-center"
        >
          {/* Animated Glowing Badge */}
          <div className="relative mt-2 mb-2 flex items-center justify-center">
            {/* Outer diffused pulsating glow halo */}
            <div className="modal-halo-glow" />

            {/* Rotating Gradient Ring Badge */}
            <div
              role={progress ? "progressbar" : undefined}
              aria-valuemin={progress ? 0 : undefined}
              aria-valuemax={progress ? 100 : undefined}
              aria-valuenow={progress?.percent}
              aria-label="Task generation progress"
              className="relative flex size-32 items-center justify-center rounded-full p-[4.5px] overflow-hidden shadow-[0_4px_24px_rgba(99,102,241,0.25)]"
            >
              {/* Rotating Gradient Ring, whose lit arc length tracks progress */}
              <div
                className="modal-ring-border"
                style={ringSweep ? ({ "--ring-sweep": ringSweep } as React.CSSProperties) : undefined}
              />

              {/* Clean White Center */}
              <div className="relative z-10 flex size-full items-center justify-center rounded-full bg-white">
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
            {headline}
          </Dialog.Title>

          {/* Status comment */}
          <Dialog.Description
            id="task-generation-description"
            className="mt-2 text-sm text-neutral-500 font-normal"
          >
            {description}
          </Dialog.Description>

          {!failed && secondsRemaining !== null && (
            <p className="mt-1 text-xs font-medium text-[#4338ca]">
              {formatTimeRemaining(secondsRemaining)}
            </p>
          )}

          {failed && onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-8 w-full cursor-pointer rounded-2xl bg-[#4338ca] py-3 px-4 text-base font-medium text-white transition-all hover:bg-[#3730a3] active:scale-[0.99]"
            >
              {retryLabel}
            </button>
          )}

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={`${failed && onRetry ? "mt-3" : "mt-8"} w-full cursor-pointer rounded-2xl border-[1.5px] border-[#4338ca] bg-white py-3 px-4 text-base font-medium text-[#4338ca] transition-all hover:bg-[#eef2ff] active:scale-[0.99]`}
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

