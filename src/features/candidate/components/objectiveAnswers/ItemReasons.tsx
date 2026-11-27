import type { CandidateObjectiveComponent } from "../../types/simulation";

function itemsFor(component: CandidateObjectiveComponent): string[] {
    switch (component.componentType) {
        case "CLASSIFICATION":
        case "KEYED_CLASSIFICATION": return component.items;
        case "PRIORITY_RANKING": return component.items.map((item) => item.label);
        case "PROCEDURAL_SEQUENCING": return component.steps;
        case "NUMERIC_TABLE": return component.rowLabels;
        default: return [];
    }
}

/** Read-only view of per-item reasons on answers submitted before the candidate editor was removed. */
export function ItemReasons({ component, reasons }: {
    component: CandidateObjectiveComponent;
    reasons?: Record<string, string>;
}) {
    const items = itemsFor(component);
    if (!items.length || !reasons) return null;
    return <details className="rounded-lg border border-neutral-200 p-3">
        <summary className="cursor-pointer text-sm font-medium text-neutral-700">Reasons for individual items</summary>
        <div className="mt-3 flex flex-col gap-3">{items.map((item) => <div key={item} className="flex flex-col gap-1 text-sm text-neutral-700">
            <span>{item}</span>
            <span>{reasons[item] || "-"}</span>
        </div>)}</div>
    </details>;
}
