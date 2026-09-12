import { SearchX } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";

interface NoResultsStateProps {
    onClearFilters: () => void;
}

export function NoResultsState({ onClearFilters }: NoResultsStateProps) {
    return (
        <div className="flex h-103.5 w-full flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-primary-300 bg-white py-7.25">
            <span className="flex size-15 items-center justify-center rounded-lg bg-primary-50">
                <SearchX className="size-6 text-primary-500" />
            </span>
            <div className="flex flex-col items-center gap-6">
                <p className="w-86 text-center text-[16px] text-neutral-700">
                    No roles match these filters. Try widening your search.
                </p>
                <ActionButton
                    variant="outline"
                    onClick={onClearFilters}
                    className="px-10 text-[16px]"
                >
                    Clear filters
                </ActionButton>
            </div>
        </div>
    );
}