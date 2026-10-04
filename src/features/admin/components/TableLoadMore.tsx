import React from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { AdminButton } from "@/components/ui/AdminButton";

interface TableLoadMoreProps {
  currentCount: number;
  totalCount: number;
  hasNextPage?: boolean;
  isLoading?: boolean;
  onLoadMore: () => void;
  className?: string;
  pageSize?: number;
}

export const TableLoadMore: React.FC<TableLoadMoreProps> = ({
  currentCount,
  totalCount,
  hasNextPage = false,
  isLoading = false,
  onLoadMore,
  className = "",
  pageSize = 10,
}) => {
  if (totalCount === 0) return null;

  const remaining = Math.max(0, totalCount - currentCount);
  const nextBatchCount = Math.min(pageSize, remaining);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 pb-1 px-1 text-xs text-neutral-500 ${className}`}
    >
      <div className="font-medium text-neutral-600">
        Showing <span className="font-bold text-neutral-900">{currentCount}</span> of{" "}
        <span className="font-bold text-neutral-900">{totalCount}</span> items
      </div>

      {hasNextPage ? (
        <AdminButton
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={onLoadMore}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 font-medium shadow-xs transition-all hover:border-neutral-300"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-3.5 animate-spin text-primary-600" />
              <span>Loading next {nextBatchCount}...</span>
            </>
          ) : (
            <>
              <span>Load More (Next {nextBatchCount})</span>
              <ChevronDown className="size-3.5 text-neutral-400 group-hover:text-neutral-700" />
            </>
          )}
        </AdminButton>
      ) : (
        <span className="text-[11px] text-neutral-400 italic">
          All {totalCount} items loaded
        </span>
      )}
    </div>
  );
};

export default TableLoadMore;
