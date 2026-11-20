import { cn } from "@/lib/utils";
import { CATEGORY_ORDER } from "../utils/submissionCategories";
import type { CategoryScores } from "../types/submission";

// Height of a 100% bar.
const MAX_BAR_HEIGHT_PX = 44;

interface CategoryBreakdownBarsProps {
    scores: CategoryScores;
    /** Print each area's abbreviation under its bar. The desktop table names them once in its column
     *  header instead; the mobile cards have no header, so they turn this on. */
    showCodes?: boolean;
}

const CategoryBreakdownBars = ({ scores, showCodes = false }: CategoryBreakdownBarsProps) => {
    const summary = CATEGORY_ORDER.map(({ key, label }) => `${label} ${scores[key]}%`).join(", ");

    return (
        <div
            role="img"
            aria-label={`Score breakdown: ${summary}`}
            className={cn("flex w-41 items-end justify-center gap-1", showCodes ? "h-19" : "h-14.25")}
        >
            {CATEGORY_ORDER.map(({ key, label, short }) => {
                const score = scores[key];
                return (
                    <div key={key} title={`${label}: ${score}%`} className="flex w-7.75 flex-col items-center justify-end gap-0.5">
                        <div
                            className="w-full rounded-t-sm bg-primary-500"
                            style={{ height: `${Math.max(2, (score / 100) * MAX_BAR_HEIGHT_PX)}px` }}
                        />
                        <span className="text-xs leading-tight text-neutral-950">{score}%</span>
                        {showCodes && (
                            <span className="text-[10px] font-semibold leading-tight tracking-wide text-neutral-500">{short}</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default CategoryBreakdownBars;
