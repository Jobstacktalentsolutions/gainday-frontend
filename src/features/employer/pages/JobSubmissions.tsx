import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import Skeleton from "@/components/ui/skeleton";
import { ActionButton } from "@/components/ui/ActionButton";
import PageBackLink from "../components/PageBackLink";
import SubmissionSortDropdown from "../components/SubmissionSortDropdown";
import SubmissionsTable, { SubmissionsTableSkeleton } from "../components/SubmissionTable";
import SubmissionsEmptyState from "../components/SubmissionsEmptyState";
import CreditPurchaseModal from "../components/CreditPurchaseModal";
import { useJobSubmissions } from "../hooks/useJobSubmissions";
import { useJobTitle } from "../hooks/useJobTitle";
import { useSubmissionSort } from "../hooks/useSubmissionSort";
import { useUnlockCandidates } from "../hooks/useUnlockCandidates";
import type { PaymentRequiredBody } from "../types/payments";
import { SORT_CONFIG, sortSubmissions } from "../utils/submissionSort";
import { CATEGORY_ORDER } from "../utils/submissionCategories";
import { cn } from "@/lib/utils";

interface UnlockPrompt {
    open: boolean;
    submissionIds: string[];
    recommendedPackId?: string;
}

const JobSubmissions = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const { data: submissions, isLoading, isError, refetch } = useJobSubmissions(jobId);
    const jobTitle = useJobTitle(jobId);
    const { sort, setSort, isDefault, reset } = useSubmissionSort();

    const sortedSubmissions = useMemo(
        () => (submissions ? sortSubmissions(submissions, sort) : []),
        [submissions, sort],
    );

    const hasSubmissions = !!submissions && submissions.length > 0;

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [unlockPrompt, setUnlockPrompt] = useState<UnlockPrompt>({ open: false, submissionIds: [] });
    const unlockCandidates = useUnlockCandidates();

    const toggleSelect = (submissionId: string) =>
        setSelectedIds((current) =>
            current.includes(submissionId)
                ? current.filter((id) => id !== submissionId)
                : [...current, submissionId],
        );

    // Only candidates still locked count: a selection can go stale after a refetch.
    const lockedSelectedIds = selectedIds.filter((id) =>
        submissions?.some((submission) => submission.id === id && !submission.isUnlocked),
    );

    const unlockSelected = (submissionIds: string[]) => {
        const count = submissionIds.length;
        unlockCandidates.mutate(submissionIds, {
            onSuccess: () => {
                toast.success(count === 1 ? "Candidate unlocked" : `${count} candidates unlocked`);
                setSelectedIds([]);
                refetch();
            },
            onError: (error) => {
                if (isAxiosError<PaymentRequiredBody>(error) && error.response?.status === 402) {
                    setUnlockPrompt({
                        open: true,
                        submissionIds,
                        recommendedPackId: error.response.data.recommendedPackId,
                    });
                    return;
                }
                toast.error("Couldn't unlock these candidates. Please try again.");
            },
        });
    };

    const unlockLabel = lockedSelectedIds.length === 1 ? "Unlock candidate" : `Unlock ${lockedSelectedIds.length} candidates`;

    return (
        <div className="min-h-screen bg-neutral-50 px-6 pb-30 pt-32 md:px-7.5 lg:px-12 xl:px-20">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
                <PageBackLink to="/employer/jobs">Go back to jobs posted</PageBackLink>

                <div className="flex flex-col items-start">
                    <h1 className="text-4xl text-black lg:text-5xl">All Submissions</h1>
                    {jobTitle.isLoading ? (
                        <Skeleton className="mt-2 h-6 w-64" />
                    ) : (
                        jobTitle.data && <p className="text-base uppercase text-primary-500">{jobTitle.data}</p>
                    )}
                </div>

                {!isLoading && !isError && hasSubmissions && (
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                            {SORT_CONFIG.map((config) => (
                                <SubmissionSortDropdown
                                    key={config.key}
                                    config={config}
                                    activeDirection={sort.key === config.key ? sort.direction : null}
                                    onSelect={(direction) => setSort({ key: config.key, direction })}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={reset}
                            disabled={isDefault}
                            className={cn(
                                "text-base text-primary-500 transition-opacity",
                                isDefault ? "cursor-default opacity-40" : "hover:underline",
                            )}
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {lockedSelectedIds.length > 0 && (
                    <div className="sticky top-24 z-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary-200 bg-white px-5 py-4 shadow-sm">
                        <p className="text-base text-neutral-950">
                            {lockedSelectedIds.length} selected
                        </p>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setSelectedIds([])}
                                className="text-base text-primary-500 hover:underline"
                            >
                                Clear selection
                            </button>
                            <ActionButton
                                size="md"
                                className="w-auto"
                                disabled={unlockCandidates.isPending}
                                onClick={() => unlockSelected(lockedSelectedIds)}
                            >
                                {unlockLabel}
                            </ActionButton>
                        </div>
                    </div>
                )}

                {isLoading && <SubmissionsTableSkeleton />}

                {!isLoading && isError && (
                    <div className="w-full rounded-3xl border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
                        Something went wrong loading these submissions.{" "}
                        <button type="button" onClick={() => refetch()} className="underline">
                            Try again
                        </button>
                    </div>
                )}

                {!isLoading && !isError && (
                    hasSubmissions && jobId ? (
                        <div className="flex flex-col gap-2">
                            <SubmissionsTable
                                jobId={jobId}
                                submissions={sortedSubmissions}
                                selectedIds={lockedSelectedIds}
                                onToggleSelect={toggleSelect}
                            />
                            <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-xs text-neutral-400">
                                <span className="font-medium uppercase tracking-wide text-neutral-500">Breakdown key:</span>
                                {CATEGORY_ORDER.map((category) => (
                                    <span key={category.key}>
                                        <span className="font-semibold text-neutral-600">{category.short}</span>
                                        {" — "}
                                        {category.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <SubmissionsEmptyState />
                    )
                )}
            </div>

            {unlockPrompt.submissionIds.length > 0 && (
                <CreditPurchaseModal
                    open={unlockPrompt.open}
                    onOpenChange={(open) => setUnlockPrompt((prev) => ({ ...prev, open }))}
                    mode="unlock"
                    submissionIds={unlockPrompt.submissionIds}
                    recommendedPackId={unlockPrompt.recommendedPackId}
                    onUnlocked={() => {
                        setSelectedIds([]);
                        refetch();
                    }}
                />
            )}
        </div>
    );
};

export default JobSubmissions;
