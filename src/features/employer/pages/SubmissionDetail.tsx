import { useState } from "react";
import { useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import PageBackLink from "../components/PageBackLink";
import SubmissionDetailHeader from "../components/SubmissionDetailHeader";
import TaskResultCard, { TaskResultCardSkeleton } from "../components/TaskResultCard";
import ContactCard, { ContactCardSkeleton } from "../components/ContactCard";
import CapabilityHistoryCard, { CapabilityHistoryCardSkeleton } from "../components/CapabilityHistoryCard";
import IntegrityCard, { IntegrityCardSkeleton } from "../components/IntegrityCard";
import CapabilityPassportModal from "../components/CapabilityPassportModal";
import CandidateProfileCard from "@/features/capability-passport/components/CandidateProfileCard";
import UnlockModal from "../components/UnlockModal";
import { useEmployerSubmission } from "../hooks/useEmployerSubmission";
import { useSubmissionPassport } from "../hooks/useSubmissionPassport";
import { useUnlockCandidates } from "../hooks/useUnlockCandidates";
import type { PaymentRequiredBody } from "../types/payments";
import type { SubmissionStatus } from "../types/submission";
import { getCandidateLabel } from "../utils/submissionLabels";

const PAGE_SHELL = "min-h-screen bg-neutral-50 px-6 pb-10 pt-40 lg:px-12 xl:px-20";
const CONTENT_WIDTH = "mx-auto w-full max-w-6xl";

// Shown above the task list while there is no score, so the answers below don't read as an
// incomplete page. The tasks and answers themselves are always listed.
const UNGRADED_NOTICE: Partial<Record<SubmissionStatus, string>> = {
    PENDING: "Grading is queued. The candidate's answers are shown below; scores will appear once grading is complete.",
    GRADING: "Grading is in progress. The candidate's answers are shown below; scores will appear once it finishes.",
    GRADING_FAILED:
        "We couldn't grade this submission. The candidate's answers are shown below without a score; our team has been alerted.",
    DISQUALIFIED: "This submission was disqualified, so it has no score. The candidate's answers are shown below.",
};

const SubmissionDetail = () => {
    const { jobId = "", submissionId } = useParams<{ jobId: string; submissionId: string }>();
    const { data: submission, isLoading, isError, refetch } = useEmployerSubmission(jobId, submissionId);
    const [isPassportOpen, setIsPassportOpen] = useState(false);
    // Only fetched once the modal is opened.
    const passportQuery = useSubmissionPassport(submissionId, isPassportOpen);

    const unlockCandidates = useUnlockCandidates();
    const [unlockModal, setUnlockModal] = useState<{ open: boolean; recommendedPackId?: string }>({
        open: false,
    });

    const listPath = `/employer/jobs/${jobId}/submissions`;

    const handleUnlockContact = () => {
        if (!submissionId) return;
        unlockCandidates.mutate([submissionId], {
            onSuccess: () => {
                toast.success("Contact unlocked");
                refetch();
            },
            onError: (error) => {
                if (isAxiosError<PaymentRequiredBody>(error) && error.response?.status === 402) {
                    setUnlockModal({ open: true, recommendedPackId: error.response.data.recommendedPackId });
                    return;
                }
                toast.error("Couldn't unlock this candidate. Please try again.");
            },
        });
    };

    if (isLoading) {
        return (
            <div className={PAGE_SHELL}>
                <SubmissionDetailHeader jobId={jobId} isLoading />
                <div className={`${CONTENT_WIDTH} flex flex-col gap-10 lg:flex-row`}>
                    <div className="flex flex-1 flex-col gap-6">
                        <p className="text-base text-primary-950">Task-by-task breakdown</p>
                        {Array.from({ length: 4 }).map((_, index) => (
                            <TaskResultCardSkeleton key={index} />
                        ))}
                    </div>
                    <div className="flex w-full flex-col gap-6 lg:w-89.5 lg:shrink-0">
                        <ContactCardSkeleton />
                        <CapabilityHistoryCardSkeleton />
                        <IntegrityCardSkeleton />
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={PAGE_SHELL}>
                <SubmissionDetailHeader jobId={jobId} />
                <div className={`${CONTENT_WIDTH} flex flex-col items-start gap-4`}>
                    <div className="w-full rounded-3xl border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
                        Something went wrong loading this submission.{" "}
                        <button type="button" onClick={() => refetch()} className="underline">
                            Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!submission) {
        return (
            <div className={PAGE_SHELL}>
                <SubmissionDetailHeader jobId={jobId} />
                <div className={`${CONTENT_WIDTH} flex flex-col items-start gap-4`}>
                    <PageBackLink to={listPath}>Back to all submissions</PageBackLink>
                    <p className="text-base text-neutral-700">
                        We couldn't find that submission. It may have been removed or the link is incorrect.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={PAGE_SHELL}>
            <SubmissionDetailHeader jobId={jobId} submission={submission} />
            <div className={`${CONTENT_WIDTH} flex flex-col gap-10 lg:flex-row`}>
                <section className="flex min-w-0 flex-1 flex-col gap-6" aria-labelledby="task-breakdown-heading">
                    <h2 id="task-breakdown-heading" className="text-base text-primary-950">
                        Task-by-task breakdown
                    </h2>
                    {submission.overallScore === null && (
                        <p
                            role="status"
                            className={`rounded-xl px-4 py-3 text-sm ${
                                submission.status === "GRADING_FAILED"
                                    ? "bg-error-50 text-error-600"
                                    : "bg-neutral-100 text-neutral-700"
                            }`}
                        >
                            {UNGRADED_NOTICE[submission.status] ?? "This submission has no grade."}
                        </p>
                    )}
                    {submission.tasks.map((task) => (
                        <TaskResultCard key={task.taskId} task={task} />
                    ))}
                </section>

                <aside className="flex w-full flex-col gap-6 lg:w-89.5 lg:shrink-0">
                    <ContactCard
                        isUnlocked={submission.isUnlocked}
                        contact={submission.contact}
                        onUnlock={handleUnlockContact}
                    />
                    {submission.candidateProfile && <CandidateProfileCard profile={submission.candidateProfile} />}
                    <CapabilityHistoryCard
                        history={submission.capabilityHistory}
                        onViewDetails={() => setIsPassportOpen(true)}
                    />
                    <IntegrityCard status={submission.integrityStatus} events={submission.integrityEvents} />
                </aside>
            </div>

            <CapabilityPassportModal
                open={isPassportOpen}
                onOpenChange={setIsPassportOpen}
                candidateName={getCandidateLabel(submission)}
                candidateProfile={submission.candidateProfile}
                passport={passportQuery.data}
                isLoading={passportQuery.isPending}
                isError={passportQuery.isError}
                onRetry={() => passportQuery.refetch()}
                isUnlocked={submission.isUnlocked}
                onUnlockContact={handleUnlockContact}
            />

            {submissionId && (
                <UnlockModal
                    open={unlockModal.open}
                    onOpenChange={(open) => setUnlockModal((prev) => ({ ...prev, open }))}
                    submissionIds={[submissionId]}
                    recommendedPackId={unlockModal.recommendedPackId}
                    onUnlocked={() => refetch()}
                />
            )}
        </div>
    );
};

export default SubmissionDetail;