import { CATEGORY_ORDER } from "../utils/submissionCategories";

/** Always-visible key for the abbreviations shown under each capability score bar. */
const CapabilityLegend = () => (
    <dl aria-label="Capability area key" className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-neutral-600">
        {CATEGORY_ORDER.map(({ key, label, short }) => (
            <div key={key} className="flex items-center gap-1.5">
                <dt className="font-semibold text-neutral-950">{short}</dt>
                <dd>{label}</dd>
            </div>
        ))}
    </dl>
);

export default CapabilityLegend;
