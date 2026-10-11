import Skeleton from "@/components/ui/skeleton";
import { ActionButton } from "@/components/ui/ActionButton";
import ScoreHistoryBars from "@/features/capability-passport/components/ScoreHistoryBars";

interface CapabilityHistoryCardProps {
    history: number[];
    onViewDetails: () => void;
}

const CapabilityHistoryCard = ({ history, onViewDetails }: CapabilityHistoryCardProps) => {
    return (
        <section className="flex w-full flex-col gap-3 rounded-xl bg-white p-6">
            <h2 className="text-sm uppercase text-neutral-700">Capability Score history</h2>
            <ScoreHistoryBars history={history} />
            <ActionButton size="lg" onClick={onViewDetails}>
                View Details
            </ActionButton>
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