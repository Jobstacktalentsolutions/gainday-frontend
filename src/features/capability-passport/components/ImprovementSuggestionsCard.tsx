import { TrendingUp } from "lucide-react";
import { CATEGORY_ORDER } from "../utils/passport";
import type { ImprovementSuggestion } from "../types/passport";

const areaLabel = (area: ImprovementSuggestion["area"]): string =>
    area === "OVERALL" ? "Overall" : (CATEGORY_ORDER.find((category) => category.key === area)?.label ?? area);

const ImprovementSuggestionsCard = ({ suggestions }: { suggestions: ImprovementSuggestion[] }) => {
    if (suggestions.length === 0) return null;

    return (
        <section className="flex w-full flex-col gap-6 rounded-xl bg-white px-6 py-8">
            <div className="flex items-center gap-1 text-primary-500">
                <TrendingUp className="size-4" aria-hidden="true" />
                <h2 className="text-sm uppercase">Improvement suggestions</h2>
            </div>
            {suggestions.map((suggestion) => (
                <div
                    key={suggestion.id}
                    className="flex flex-col gap-2.5 rounded-xl border-l-3 border-warning-500 bg-secondary-50 p-4 text-base leading-6"
                >
                    <p className="uppercase text-secondary-500">{areaLabel(suggestion.area)}</p>
                    <p className="text-neutral-700">{suggestion.text}</p>
                </div>
            ))}
        </section>
    );
};

export default ImprovementSuggestionsCard;