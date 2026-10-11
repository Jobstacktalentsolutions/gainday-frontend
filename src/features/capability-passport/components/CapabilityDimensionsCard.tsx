import ScoreBar from "@/components/ui/ScoreBar";
import { CATEGORY_ORDER } from "../utils/passport";
import type { CategoryScores } from "../types/passport";

const CapabilityDimensionsCard = ({ dimensions }: { dimensions: CategoryScores }) => {
    return (
        <section className="flex w-full flex-col gap-6 rounded-xl bg-white px-6 py-8">
            <h2 className="text-sm uppercase text-primary-500">Capability dimensions</h2>
            <div className="flex flex-col gap-6">
                {CATEGORY_ORDER.map(({ key, label }) => (
                    <div key={key} className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-4 text-neutral-900">
                            <p className="min-w-0 text-2xl leading-8">{label}</p>
                            <p className="shrink-0">
                                <span className="text-2xl font-bold">{dimensions[key]}</span>
                                <span className="text-lg">/100</span>
                            </p>
                        </div>
                        <ScoreBar score={dimensions[key]} label={`${label} score`} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CapabilityDimensionsCard;