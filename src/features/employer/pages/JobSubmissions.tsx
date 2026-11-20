import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import Skeleton from "@/components/ui/skeleton";
import { ActionButton } from "@/components/ui/ActionButton";
import PageBackLink from "../components/PageBackLink";
import SubmissionSortDropdown from "../components/SubmissionSortDropdown";
import SubmissionsTable, { SubmissionsTableSkeleton } from "../components/SubmissionTable";
import CapabilityLegend from "../components/CapabilityLegend";
import SubmissionsEmptyState from "../components/SubmissionsEmptyState";
import CreditPurchaseModal from "../components/CreditPurchaseModal";
import { UnlockConfirmation } from "../components/UnlockConfirmation";
import { useJobSubmissions } from "../hooks/useJobSubmissions";
import { useJobTitle } from "../hooks/useJobTitle";
import { useSubmissionSort } from "../hooks/useSubmissionSort";
import { useUnlockCandidates } from "../hooks/useUnlockCandidates";
import { useSelectCandidate } from "../hooks/useSelectCandidate";
import type { PaymentRequiredBody } from "../types/payments";
import { SORT_CONFIG, sortSubmissions } from "../utils/submissionSort";
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
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [unlockPrompt, setUnlockPrompt] = useState<UnlockPrompt>({ open: false, submissionIds: [] });
    const unlockCandidates = useUnlockCandidates();
    const selectCandidate = useSelectCandidate();

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
    const unlockedSelectedIds = selectedIds.filter((id) => submissions?.some((submission) => submission.id === id && submission.isUnlocked));

    const selectUnlocked = async () => {
        const results = await Promise.allSettled(unlockedSelectedIds.map((submissionId) => selectCandidate.mutateAsync({ submissionId, selected: true, jobId })));
        const failed = results.filter((result) => result.status === "rejected").length;
        if (failed) toast.error(`${failed} candidate selections failed. Please try again.`);
        else toast.success("Candidates selected");
        setSelectedIds([]);
        void refetch();
    };

    const unlockSelected = (submissionIds: string[]) => {
        const count = submissionIds.length;
        unlockCandidates.mutate(submissionIds, {
            onSuccess: () => {
                setConfirmOpen(false);
                toast.success(count === 1 ? "Candidate unlocked" : `${count} candidates unlocked`);
                setSelectedIds([]);
                refetch();
            },
            onError: (error) => {
                if (isAxiosError<PaymentRequiredBody>(error) && error.response?.status === 402) {
                    setConfirmOpen(false);
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
        <div className="min-h-screen bg-neutral-50 px-4 pb-12 pt-28 sm:px-6 md:px-7.5 lg:px-12 lg:pt-32 xl:px-20">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 lg:gap-8">
                <PageBackLink to="/employer/jobs">Go back to jobs posted</PageBackLink>

                <div className="flex flex-col items-start">
                    <h1 className="text-3xl text-black lg:text-4xl">All Submissions</h1>
                    {jobTitle.isLoading ? (
                        <Skeleton className="mt-2 h-6 w-64" />
                    ) : (
                        jobTitle.data && <p className="text-base uppercase text-primary-500">{jobTitle.data}</p>
                    )}
                </div>

                {!isLoading && !isError && hasSubmissions && (
                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        <div className="flex flex-wrap items-center gap-2">
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
                                "text-sm text-primary-500 transition-opacity",
                                isDefault ? "cursor-default opacity-40" : "hover:underline",
                            )}
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {selectedIds.length > 0 && (
                    <div className="sticky top-24 z-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary-200 bg-white px-5 py-4 shadow-sm">
                        <p className="text-base text-neutral-950">
                            {selectedIds.length} selected
                        </p>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setSelectedIds([])}
                                className="text-base text-primary-500 hover:underline"
                            >
                                Clear selection
                            </button>
                            {unlockedSelectedIds.length > 0 && <ActionButton gradient={false} size="md" disabled={selectCandidate.isPending} onClick={() => void selectUnlocked()}>Select {unlockedSelectedIds.length} {unlockedSelectedIds.length === 1 ? "candidate" : "candidates"}</ActionButton>}
                            {lockedSelectedIds.length > 0 && <ActionButton gradient={false}
                                size="md"
                                className="w-auto"
                                disabled={unlockCandidates.isPending}
                                onClick={() => setConfirmOpen(true)}
                            >
                                {unlockLabel}
                            </ActionButton>}
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
                        <div className="flex flex-col gap-3">
                            <CapabilityLegend />
                            <SubmissionsTable
                                jobId={jobId}
                                submissions={sortedSubmissions}
                                selectedIds={selectedIds}
                                onToggleSelect={toggleSelect}
                            />
                        </div>
                    ) : (
                        <SubmissionsEmptyState />
                    )
                )}
            </div>

            <UnlockConfirmation open={confirmOpen} onOpenChange={setConfirmOpen} count={lockedSelectedIds.length} pending={unlockCandidates.isPending} onConfirm={() => unlockSelected(lockedSelectedIds)} onTopUp={() => { setConfirmOpen(false); setUnlockPrompt({ open: true, submissionIds: lockedSelectedIds }); }} />
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
