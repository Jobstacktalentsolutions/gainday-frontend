import type { ReactNode } from "react";
import type { ClassificationCandidateComponent } from "../../types/simulation";

/** A task's classification answer, handed to an interface that can take the bucket choice
 *  inline (a table, on each row) instead of showing a separate list. */
export interface ClassificationAnswerState {
    component: ClassificationCandidateComponent;
    response: Record<string, string> | null;
    onChange: (response: Record<string, string>) => void;
}

export interface InterfaceAnswerProps {
    payload: Record<string, unknown>;
    value: string;
    onChange: (value: string) => void;
    /** The task's structured answer widget (options, buckets, ordering...). Each interface
     *  places it after its own reference content and before the written response, so the
     *  candidate never has to answer before they have seen the material. */
    objectiveSlot?: ReactNode;
    /** Present when the structured answer is a classification. */
    classification?: ClassificationAnswerState;
}
