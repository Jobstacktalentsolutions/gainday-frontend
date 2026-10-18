import type { Application, ApplicationStatus } from "../types/application";

export type TimelineStepState = "complete" | "current" | "upcoming";

export interface TimelineStep {
    key: "submitted" | "graded" | "outcome";
    label: string;
    description: string;
    /** ISO 8601, when the backend knows when the step happened. */
    date: string | null;
    state: TimelineStepState;
}

// A decision, disqualification or withdrawal ends the process. While none of these applies,
// the final step is "waiting for the employer".
const FINAL_STEP_COPY: Partial<Record<ApplicationStatus, { label: string; description: string }>> = {
    SELECTED: { label: "Selected", description: "You were selected for this role." },
    NOT_SELECTED: { label: "Not selected", description: "You were not selected for this role." },
    DISQUALIFIED: { label: "Disqualified", description: "Your submission was disqualified." },
    WITHDRAWN: { label: "Withdrawn", description: "You withdrew this application." },
};

export const buildApplicationTimeline = (application: Application): TimelineStep[] => {
    const { status, rating, submittedAt, decidedAt } = application;
    const isGraded = rating !== null;
    const finalCopy = FINAL_STEP_COPY[status];

    const submitted: TimelineStep = {
        key: "submitted",
        label: "Submitted",
        description: "Your answers were submitted.",
        date: submittedAt,
        state: "complete",
    };

    // Withdrawing or being disqualified before grading ends the process, so grading stays
    // greyed rather than showing as the step currently in progress.
    const graded: TimelineStep = {
        key: "graded",
        label: "Graded",
        description: isGraded
            ? "Your submission has been graded."
            : finalCopy
              ? "Your submission was not graded."
              : status === "GRADING_FAILED"
                ? "We couldn't grade your submission. Please contact support."
                : "Your submission is being graded.",
        date: null,
        state: isGraded ? "complete" : finalCopy ? "upcoming" : "current",
    };

    const outcome: TimelineStep = finalCopy
        ? { key: "outcome", ...finalCopy, date: decidedAt, state: "complete" }
        : {
              key: "outcome",
              label: "Decision",
              description: "Waiting for the employer's decision.",
              date: null,
              state: isGraded ? "current" : "upcoming",
          };

    return [submitted, graded, outcome];
};
