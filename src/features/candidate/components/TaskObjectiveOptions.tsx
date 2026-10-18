import { OBJECTIVE_ANSWER_RENDERERS } from "./objectiveAnswers/registry";
import type { CandidateSimulationTask } from "../types/simulation";

interface TaskObjectiveOptionsProps {
    task: Pick<CandidateSimulationTask, "objectiveComponent">;
    response: unknown;
    onChange: (response: unknown) => void;
    /** Show the submitted answer, not an editable one. Ordering widgets hide their controls; the
     *  rest (options, numbers) are locked by the disabled fieldset around them. */
    readOnly?: boolean;
}

// objectiveComponent is genuinely optional — the backend sends an explicit `null` for task
// types with no objective/structured-answer part (open-ended-only tasks), which is a normal
// task shape, not an unsupported one, so this renders nothing in that case.
//
// Which widget renders for a *present* objectiveComponent is resolved entirely through
// OBJECTIVE_ANSWER_RENDERERS, keyed by the componentType the backend already tagged it with
// (see candidate-task.util.ts) — this component doesn't special-case any one component type,
// so a new ObjectiveComponentType only needs an entry in that registry, not a change here.
export function TaskObjectiveOptions({ task, response, onChange, readOnly }: TaskObjectiveOptionsProps) {
    if (task.objectiveComponent == null) return null;

    const Renderer = OBJECTIVE_ANSWER_RENDERERS[task.objectiveComponent.componentType];
    if (!Renderer) {
        return (
            <div className="w-full rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-[16px] text-neutral-400">
                This task type ("{task.objectiveComponent.componentType}") isn't supported yet.
            </div>
        );
    }

    const widget = (
        <Renderer component={task.objectiveComponent} response={response} onChange={onChange} readOnly={readOnly} />
    );
    return readOnly ? (
        <fieldset disabled className="m-0 min-w-0 border-0 p-0">
            {widget}
        </fieldset>
    ) : (
        widget
    );
}
