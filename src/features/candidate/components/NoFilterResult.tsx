import { ActionButton } from "@/components/ui/ActionButton";

interface NoResultsStateProps {
    onClearFilters: () => void;
}

export function NoResultsState({ onClearFilters }: NoResultsStateProps) {
    return (
        <div className="flex w-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-neutral-300 bg-white py-28">
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-[20px] font-semibold text-neutral-900">
                    No roles match your filters
                </h2>
                <p className="text-[14px] text-neutral-500">
                    Try widening your search or clearing a filter.
                </p>
            </div>
            <ActionButton
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="hover:bg-neutral-500 hover:text-neutral-50 hover:border-neutral-400"
            >
                Clear filters
            </ActionButton>
        </div>
    );
}