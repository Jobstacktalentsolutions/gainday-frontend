import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { FormInput } from "@/components/form/FormInput";
import TaskPromptEditor from "@/features/employer/components/TaskPromptEditor";
import { InterfaceRendererView } from "@/features/simulation-tasks/interfaceRenderers/registry";
import {
    OBJECTIVE_COMPONENT_EDITORS,
    OPEN_ENDED_COMPONENT_EDITORS,
} from "@/features/simulation-tasks/componentEditors/registry";
import { useTaskPatternTypes } from "@/features/simulation-tasks/useTaskPatternTypes";
import {
    useApproveGenerationReview,
    useRejectGenerationReview,
} from "../hooks/useGenerationReviews";
import type {
    GenerationReviewItem,
    QuestionBankTaskContent,
} from "../types/generationReview";

interface GenerationReviewDetailProps {
    review: GenerationReviewItem;
    onClose: () => void;
}

const GenerationReviewDetail = ({ review, onClose }: GenerationReviewDetailProps) => {
    const { data: patternTypes } = useTaskPatternTypes();
    const approve = useApproveGenerationReview();
    const reject = useRejectGenerationReview();

    const latestAttempt = review.attempts[review.attempts.length - 1];
    const [content, setContent] = useState<QuestionBankTaskContent>(
        review.resolvedTaskContent ?? latestAttempt?.taskDraft,
    );

    if (!content) {
        return (
            <div className="rounded-xl border border-error-200 bg-error-50 p-5 text-sm text-error-600">
                This review item has no draft content to edit.
            </div>
        );
    }

    const patternType = patternTypes?.find((p) => p.key === content.taskType);
    const ObjectiveEditor = patternType?.objectiveComponentType
        ? OBJECTIVE_COMPONENT_EDITORS[patternType.objectiveComponentType]
        : null;
    const OpenEndedEditor = patternType?.openEndedComponentType
        ? OPEN_ENDED_COMPONENT_EDITORS[patternType.openEndedComponentType]
        : null;

    const handleApprove = () => {
        approve.mutate(
            { id: review.id, taskContent: content },
            { onSuccess: onClose },
        );
    };

    const handleReject = () => {
        reject.mutate(review.id, { onSuccess: onClose });
    };

    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between">
                <p className="text-sm font-bold uppercase tracking-wide text-neutral-900">
                    Slot {review.slotIndex + 1} — {review.category}
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-sm text-neutral-500 hover:text-neutral-900"
                >
                    Close
                </button>
            </div>

            {/* Why the pipeline gave up on this slot */}
            {review.attempts.length > 0 && (
                <div className="flex flex-col gap-2 rounded-xl bg-amber-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-amber-700">
                        <AlertTriangle className="size-4" aria-hidden="true" />
                        {review.attempts.length} failed attempt(s)
                    </div>
                    <ul className="flex flex-col gap-1 text-sm text-amber-700">
                        {review.attempts.map((attempt) => (
                            <li key={attempt.attemptNumber}>
                                Attempt {attempt.attemptNumber}:{" "}
                                {attempt.criticFailureReasons.join("; ") || "No reason recorded"}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <FormInput
                label="Title"
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
            />

            <div className="flex flex-col gap-1.5">
                <label className="text-base font-medium text-neutral-800">Scenario</label>
                <TaskPromptEditor
                    value={content.scenarioDescription}
                    onChange={(v) => setContent({ ...content, scenarioDescription: v })}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-base font-medium text-neutral-800">Question prompt</label>
                <TaskPromptEditor
                    value={content.questionPrompt}
                    onChange={(v) => setContent({ ...content, questionPrompt: v })}
                />
            </div>

            {ObjectiveEditor && (
                <div className="flex flex-col gap-1.5">
                    <label className="text-base font-medium text-neutral-800">
                        Grading data ({patternType?.objectiveComponentType})
                    </label>
                    <ObjectiveEditor
                        value={content.objectiveComponent ?? {}}
                        onChange={(v) => setContent({ ...content, objectiveComponent: v })}
                    />
                </div>
            )}

            {OpenEndedEditor && (
                <div className="flex flex-col gap-1.5">
                    <label className="text-base font-medium text-neutral-800">
                        Prompt framing ({patternType?.openEndedComponentType})
                    </label>
                    <OpenEndedEditor
                        value={content.openEndedComponent ?? {}}
                        onChange={(v) => setContent({ ...content, openEndedComponent: v })}
                    />
                </div>
            )}

            <div className="flex flex-col gap-1.5">
                <label className="text-base font-medium text-neutral-800">
                    Candidate response interface
                </label>
                <InterfaceRendererView
                    interfaceType={content.interfaceType}
                    payload={content.interfacePayload}
                    mode="edit"
                    onChange={(payload) =>
                        setContent({
                            ...content,
                            interfacePayload: payload as unknown as Record<string, unknown>,
                        })
                    }
                />
            </div>

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={handleReject}
                    disabled={reject.isPending}
                    className="flex h-11 flex-1 items-center justify-center rounded-xl border border-neutral-200 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50 disabled:opacity-60"
                >
                    {reject.isPending ? "Rejecting..." : "Reject"}
                </button>
                <button
                    type="button"
                    onClick={handleApprove}
                    disabled={approve.isPending}
                    className="flex h-11 flex-1 items-center justify-center rounded-xl bg-primary-500 text-sm font-medium text-white transition-all hover:bg-primary-600 disabled:opacity-60"
                >
                    {approve.isPending ? "Approving..." : "Approve with edits"}
                </button>
            </div>
        </div>
    );
};

export default GenerationReviewDetail;
