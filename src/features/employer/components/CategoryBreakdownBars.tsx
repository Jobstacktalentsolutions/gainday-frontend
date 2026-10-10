import { CATEGORY_ORDER } from "../utils/submissionCategories";
import type { CategoryScores } from "../types/submission";

// Height of a 100% bar. 
const MAX_BAR_HEIGHT_PX = 44;

interface CategoryBreakdownBarsProps {
    scores: CategoryScores;
}

const CategoryBreakdownBars = ({ scores }: CategoryBreakdownBarsProps) => {
    const summary = CATEGORY_ORDER.map(({ key, label }) => `${label} ${scores[key]}%`).join(", ");

    return (
        <div role="img" aria-label={`Score breakdown: ${summary}`} className="flex h-14.25 w-41 items-end justify-center gap-1">
            {CATEGORY_ORDER.map(({ key, label }) => {
                const score = scores[key];
                return (
                    <div key={key} title={`${label}: ${score}%`} className="flex w-7.75 flex-col items-center justify-end gap-0.5">
                        <div
                            className="w-full rounded-t-sm bg-primary-500"
                            style={{ height: `${Math.max(2, (score / 100) * MAX_BAR_HEIGHT_PX)}px` }}
                        />
                        <span className="text-xs leading-tight text-neutral-950">{score}%</span>
                    </div>
                );
            })}
        </div>
    );
};

export default CategoryBreakdownBars;