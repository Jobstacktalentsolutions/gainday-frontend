import { SearchX } from "lucide-react";

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
                <button
                    type="button"
                    onClick={onClearFilters}
                    className="flex h-13 items-center justify-center rounded-lg border border-primary-500 px-10 py-2 text-[16px] text-primary-500"
                >
                    Clear filters
                </button>
            </div>
        </div>
    );
}