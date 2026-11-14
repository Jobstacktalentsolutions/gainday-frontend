import { ChevronLeft, ChevronRight } from "lucide-react";

interface JobPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

const getPaginationRange = (current: number, total: number): (number | "ellipsis")[] => {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
        return [1, 2, 3, 4, 5, "ellipsis", total];
    }
    if (current >= total - 3) {
        return [1, "ellipsis", total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", total];
};

export const JobPagination = ({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    isLoading = false,
}: JobPaginationProps) => {
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    const pages = getPaginationRange(currentPage, totalPages);

    return (
        <nav
            aria-label="Jobs pagination"
            className="flex flex-col items-center justify-between gap-4 pt-6 sm:flex-row"
        >
            <p className="text-sm text-neutral-500">
                Showing <span className="font-medium text-neutral-900">{startItem}</span> to{" "}
                <span className="font-medium text-neutral-900">{endItem}</span> of{" "}
                <span className="font-medium text-neutral-900">{totalItems}</span> jobs
            </p>

            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
                    aria-label="Previous page"
                    className="button-gradient-outline inline-flex h-9 items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-1">
                    {pages.map((item, index) => {
                        if (item === "ellipsis") {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="px-2 text-sm text-neutral-400 select-none"
                                >
                                    …
                                </span>
                            );
                        }

                        const isActive = item === currentPage;
                        return (
                            <button
                                key={item}
                                type="button"
                                onClick={() => onPageChange(item)}
                                disabled={isLoading}
                                aria-current={isActive ? "page" : undefined}
                                aria-label={`Page ${item}`}
                                className={`flex h-9 min-w-9 items-center justify-center rounded-xl border text-sm font-medium transition ${
                                    isActive
                                        ? "border-neutral-900 bg-neutral-900 text-white shadow-xs"
                                        : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                                } disabled:opacity-50`}
                            >
                                {item}
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoading}
                    aria-label="Next page"
                    className="button-gradient-outline inline-flex h-9 items-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </nav>
    );
};

export default JobPagination;
