import { cn } from "@/lib/utils";

// Bars are scaled between these heights so small differences stay readable — scores sit in a
// narrow band (e.g. 668–739), so a zero-based scale would make every bar look identical.
const MIN_BAR_HEIGHT_PX = 40;
const BAR_HEIGHT_RANGE_PX = 30;
const MAX_ATTEMPTS_SHOWN = 6;

const ScoreHistoryBars = ({ history }: { history: number[] }) => {
    if (history.length === 0) return null;

    const firstShownIndex = Math.max(0, history.length - MAX_ATTEMPTS_SHOWN);
    const shown = history.slice(firstShownIndex);
    const min = Math.min(...shown);
    const max = Math.max(...shown);

    const heightFor = (score: number) =>
        max === min
            ? MIN_BAR_HEIGHT_PX + BAR_HEIGHT_RANGE_PX / 2
            : MIN_BAR_HEIGHT_PX + ((score - min) / (max - min)) * BAR_HEIGHT_RANGE_PX;

    return (
        <div className="flex w-full items-end justify-center gap-1">
            {shown.map((score, index) => {
                const isLatest = index === shown.length - 1;
                const attemptNumber = firstShownIndex + index + 1;
                return (
                    <div key={attemptNumber} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-0.5">
                        <p className="text-xs leading-tight text-neutral-950">{score}</p>
                        <div
                            className={cn("w-full rounded-t-sm", isLatest ? "bg-primary-500" : "bg-neutral-300")}
                            style={{ height: `${heightFor(score)}px` }}
                        />
                        <p className="text-xs leading-tight text-neutral-300">#{attemptNumber}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default ScoreHistoryBars;