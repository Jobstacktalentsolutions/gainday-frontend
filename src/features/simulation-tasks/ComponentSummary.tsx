const formatLabel = (key: string) =>
    key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (c) => c.toUpperCase())
        .trim();

const formatValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined || value === "") return "—";
    if (Array.isArray(value)) {
        if (value.length === 0) return "—";
        if (typeof value[0] === "object" && value[0] !== null) {
            return (
                <ul className="flex flex-col gap-0.5">
                    {value.map((item, i) => (
                        <li key={i}>
                            {Object.entries(item as Record<string, unknown>)
                                .map(([k, v]) => `${formatLabel(k)}: ${v}`)
                                .join(" → ")}
                        </li>
                    ))}
                </ul>
            );
        }
        return value.join(", ");
    }
    if (typeof value === "object") {
        return JSON.stringify(value);
    }
    return String(value);
};

interface ComponentSummaryProps {
    label: string;
    data: Record<string, unknown> | undefined;
}

// Generic, type-agnostic read-only view of objectiveComponent/openEndedComponent — doesn't need
// to know the specific component-type schema (that mapping is admin-only, see
// useTaskPatternTypes), so it just renders whatever fields are actually present.
const ComponentSummary = ({ label, data }: ComponentSummaryProps) => {
    if (!data || Object.keys(data).length === 0) return null;

    return (
        <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {label}
            </p>
            <dl className="flex flex-col gap-2">
                {Object.entries(data).map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                        <dt className="shrink-0 text-sm font-medium text-neutral-600 sm:w-40">
                            {formatLabel(key)}
                        </dt>
                        <dd className="text-sm text-neutral-900">{formatValue(value)}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
};

export default ComponentSummary;
