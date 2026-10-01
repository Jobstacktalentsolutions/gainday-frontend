// Renders each objective-component type's candidate response as plain text for
// CandidateAnswer.responseBody. Split out from the answer components themselves (rather than
// co-exported) because this project's react-refresh/only-export-components lint rule requires
// component files to export only components — see registry.tsx, which pairs each of these with
// its matching Component.
import type {
    ClassificationCandidateComponent,
    MultiSelectUnderConstraintCandidateComponent,
    NumericInputCandidateComponent,
    ProceduralSequencingCandidateComponent,
    SingleBestActionCandidateComponent,
} from "../../types/simulation";

export function describeSingleBestAction(
    component: SingleBestActionCandidateComponent,
    response: number | null,
): string {
    if (response === null) return "";
    const letter = String.fromCharCode(65 + response);
    return `Selected option ${letter}: ${component.options[response].label}`;
}

export function describeMultiSelectUnderConstraint(
    component: MultiSelectUnderConstraintCandidateComponent,
    response: number[] | null,
): string {
    if (!response || response.length === 0) return "";
    const labels = response
        .slice()
        .sort((a, b) => a - b)
        .map((index) => `${String.fromCharCode(65 + index)}. ${component.options[index]}`);
    return `Selected options: ${labels.join("; ")}`;
}

export function describeNumericInput(component: NumericInputCandidateComponent, response: number | null): string {
    if (response === null || Number.isNaN(response)) return "";
    return `Answer: ${response}${component.unit ? ` ${component.unit}` : ""}`;
}

export function describeClassification(
    _component: ClassificationCandidateComponent,
    response: Record<string, string> | null,
): string {
    if (!response || Object.keys(response).length === 0) return "";
    return Object.entries(response)
        .map(([item, bucket]) => `${item} → ${bucket}`)
        .join("; ");
}

export function describeProceduralSequencing(
    component: ProceduralSequencingCandidateComponent,
    response: number[] | null,
): string {
    if (!response) return "";
    return response.map((stepIndex, position) => `${position + 1}. ${component.steps[stepIndex].label}`).join("\n");
}
