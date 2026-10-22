import type {
  GenerationProgress,
  GenerationStage,
} from "../types/generationProgress";

// Estimates are noisy on the first few steps, so stay quiet until the run is well under way.
const MIN_PERCENT_FOR_ESTIMATE = 15;

const STAGE_COPY: Record<
  GenerationStage,
  (slot: number, totalSlots: number) => string
> = {
  extraction: () => "Reading the job description",
  overgenerate: () => "Brainstorming task ideas",
  rankSelect: () => "Picking the best fit",
  taskGeneration: (slot, totalSlots) => `Writing task ${slot} of ${totalSlots}`,
  critic: (slot, totalSlots) =>
    `Quality-checking task ${slot} of ${totalSlots}`,
  persist: (slot, totalSlots) => `Saving task ${slot} of ${totalSlots}`,
  finalising: () => "Finishing up",
};

export const describeStage = ({
  stage,
  slot,
  totalSlots,
}: GenerationProgress): string => STAGE_COPY[stage](slot, totalSlots);

/** Linear extrapolation from elapsed time and percent complete. Null until the estimate is useful. */
export const estimateSecondsRemaining = (
  percent: number,
  elapsedMs: number,
): number | null => {
  if (percent < MIN_PERCENT_FOR_ESTIMATE || percent >= 100) return null;
  return Math.round(((elapsedMs / 1000) * (100 - percent)) / percent);
};

export const formatTimeRemaining = (seconds: number): string => {
  if (seconds < 60) return "Under a minute left";
  return `About ${Math.ceil(seconds / 60)} min left`;
};
