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

export function ItemReasons({ component, reasons, onChange, readOnly }: {
    component: CandidateObjectiveComponent;
    reasons?: Record<string, string>;
    onChange: (reasons: Record<string, string>) => void;
    readOnly?: boolean;
}) {
    const items = itemsFor(component);
    if (!items.length || (readOnly && !reasons)) return null;
    return <details className="rounded-lg border border-neutral-200 p-3">
        <summary className="cursor-pointer text-sm font-medium text-neutral-700">Reasons for individual items (optional)</summary>
        <div className="mt-3 flex flex-col gap-3">{items.map((item) => <label key={item} className="flex flex-col gap-1 text-sm text-neutral-700">
            <span>{item}</span>
            {readOnly ? <span>{reasons?.[item] || "-"}</span> : <textarea value={reasons?.[item] ?? ""} onChange={(event) => onChange({ ...reasons, [item]: event.target.value })} className="w-full rounded-lg border border-neutral-200 p-2" />}
        </label>)}</div>
    </details>;
}
