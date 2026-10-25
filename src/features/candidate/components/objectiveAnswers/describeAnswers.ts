// Renders each objective-component type's candidate response as plain text for
// CandidateAnswer.responseBody (the flattened copy the grader reads; review pages use the
// structured response instead). Split out from the answer components themselves (rather than
// co-exported) because this project's react-refresh/only-export-components lint rule requires
// component files to export only components — see registry.tsx, which pairs each of these with
// its matching Component.
import type {
    ClassificationCandidateComponent,
    JournalEntryCandidateComponent,
    JournalEntryResponse,
    MultiSelectUnderConstraintCandidateComponent,
    NumericInputCandidateComponent,
    NumericTableCandidateComponent,
    NumericTableResponse,
    PriorityRankingCandidateComponent,
    ProceduralSequencingCandidateComponent,
    ReconciliationCandidateComponent,
    ReconciliationResponse,
    SingleBestActionCandidateComponent,
} from "../../types/simulation";

export function describeSingleBestAction(
    component: SingleBestActionCandidateComponent,
    response: number | null,
): string {
    if (response === null) return "";
    const letter = String.fromCharCode(65 + response);
    return `Selected option ${letter}: ${component.options[response]}`;
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
    // No response yet == the candidate never touched the ordering — reporting the
    // as-presented order as their "answer" would credit/penalize a choice they never made.
    if (!response) return "";
    return response.map((stepIndex, position) => `${position + 1}. ${component.steps[stepIndex]}`).join("\n");
}

export function describePriorityRanking(
    component: PriorityRankingCandidateComponent,
    response: number[] | null,
): string {
    // Same rule as sequencing: an untouched list is not an answer the candidate gave.
    if (!response) return "";
    return response
        .map((itemIndex, position) => {
            const { label, description } = component.items[itemIndex];
            return `${position + 1}. ${label} — ${description}`;
        })
        .join("\n");
}

export function describeReconciliation(
    component: ReconciliationCandidateComponent,
    response: ReconciliationResponse | null,
): string {
    if (!response) return "";
    const sideLabel = (value: string | null) =>
        component.sideOptions.find((option) => option.value === value)?.label ?? "Not answered";
    const lines = component.items.map((item, index) => `${item} → ${sideLabel(response.sides[index] ?? null)}`);
    if (response.adjustedBalance !== null) {
        lines.push(`Adjusted cash balance: ${response.adjustedBalance}${component.unit ? ` ${component.unit}` : ""}`);
    }
    return lines.join("\n");
}

export function describeJournalEntry(
    component: JournalEntryCandidateComponent,
    response: JournalEntryResponse | null,
): string {
    if (!response || response.lines.length === 0) return "";
    return component.references
        .map((reference) => {
            const lines = response.lines
                .filter((line) => line.reference === reference)
                .map((line) => `${line.side ?? "?"} ${line.account ?? "?"} ${line.amount ?? "?"}`);
            return lines.length > 0 ? `${reference}: ${lines.join("; ")}` : "";
        })
        .filter((text) => text !== "")
        .join("\n");
}

export function describeNumericTable(
    component: NumericTableCandidateComponent,
    response: NumericTableResponse | null,
): string {
    if (!response) return "";
    return component.rowLabels
        .map((rowLabel, row) => {
            const cells = component.columnLabels.map((label, column) => `${label} ${response.values[row][column] ?? "not answered"}`);
            return `${rowLabel}: ${cells.join("; ")}`;
        })
        .join("\n");
}
