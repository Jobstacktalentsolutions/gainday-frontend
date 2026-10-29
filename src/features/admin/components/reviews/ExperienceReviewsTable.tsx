import { useMemo } from "react";
import { Star } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useExperienceReviewList } from "../../hooks/useExperienceReviews";
import { TableLoadMore } from "../TableLoadMore";
import { TableSkeleton } from "../skeletons";
import type { ExperienceReviewItem } from "../../types/reviews";

const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });

const ROLE_LABELS: Record<ExperienceReviewItem["role"], string> = {
  JOB_SEEKER: "Candidate",
  EMPLOYER: "Employer",
};

const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((value) => (
      <Star
        key={value}
        className={cn("size-3.5", value <= rating ? "fill-amber-400 text-amber-400" : "text-neutral-300")}
      />
    ))}
  </div>
);

const ExperienceReviewsTable = () => {
  const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useExperienceReviewList();

  const reviews = useMemo<ExperienceReviewItem[]>(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);
  const totalCount = data?.pages[0]?.pagination.total ?? 0;

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
      <div>
        <h2 className="text-sm font-semibold text-neutral-900">All reviews</h2>
        <p className="text-xs text-neutral-500">Newest first</p>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} columns={4} />
      ) : isError ? (
        <p className="py-8 text-center text-sm text-error-600">Couldn't load reviews.</p>
      ) : reviews.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-500">No reviews yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="whitespace-nowrap text-neutral-600">{formatDate(review.createdAt)}</TableCell>
                    <TableCell>
                      <p className="font-medium text-neutral-900">{review.reviewerName ?? "Unnamed"}</p>
                      <p className="text-xs text-neutral-500">
                        {ROLE_LABELS[review.role]} · {review.email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <RatingStars rating={review.rating} />
                    </TableCell>
                    <TableCell className="max-w-xs whitespace-normal text-neutral-700">
                      {review.comment ?? <span className="text-neutral-400">—</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <TableLoadMore
            currentCount={reviews.length}
            totalCount={totalCount}
            hasNextPage={hasNextPage}
            isLoading={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
          />
        </>
      )}
    </section>
  );
};

export default ExperienceReviewsTable;
