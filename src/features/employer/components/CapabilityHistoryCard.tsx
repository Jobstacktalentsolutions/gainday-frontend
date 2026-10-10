import { cn } from "@/lib/utils";
import Skeleton from "@/components/ui/skeleton";
import { ActionButton } from "@/components/ui/ActionButton";

// Bars are scaled between these heights so small differences stay readable — the scores
// themselves sit around 600–800, so a zero-based scale would make every bar look identical.
const MIN_BAR_HEIGHT_PX = 40;
const BAR_HEIGHT_RANGE_PX = 30;
const MAX_ATTEMPTS_SHOWN = 6;

const CapabilityHistoryCard = ({ history }: { history: number[] }) => {
    const firstShownIndex = Math.max(0, history.length - MAX_ATTEMPTS_SHOWN);
    const shown = history.slice(firstShownIndex);
    const min = Math.min(...shown);
    const max = Math.max(...shown);

    const heightFor = (score: number) =>
        max === min
            ? MIN_BAR_HEIGHT_PX + BAR_HEIGHT_RANGE_PX / 2
            : MIN_BAR_HEIGHT_PX + ((score - min) / (max - min)) * BAR_HEIGHT_RANGE_PX;

    return (
        <section className="flex w-full flex-col gap-3 rounded-xl bg-white p-6">
            <h2 className="text-sm uppercase text-neutral-700">Capability Score history</h2>
            <div className="flex items-end justify-center gap-1">
                {shown.map((score, index) => {
                    const isLatest = index === shown.length - 1;
                    return (
                        <div key={firstShownIndex + index} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-0.5">
                            <p className="text-xs leading-tight text-neutral-950">{score}</p>
                            <div
                                className={cn("w-full rounded-t-sm", isLatest ? "bg-primary-500" : "bg-neutral-300")}
                                style={{ height: `${heightFor(score)}px` }}
                            />
                            <p className="text-xs leading-tight text-neutral-300">#{firstShownIndex + index + 1}</p>
                        </div>
                    );
                })}
            </div>
            {/* TODO: not functional yet — wire up once the capability history view is designed. */}
            <ActionButton size="lg">View Details</ActionButton>
        </section>
    );
};

export const CapabilityHistoryCardSkeleton = () => {
    return (
        <div className="flex w-full flex-col gap-3 rounded-xl bg-white p-6">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
    );
};

export default CapabilityHistoryCard;