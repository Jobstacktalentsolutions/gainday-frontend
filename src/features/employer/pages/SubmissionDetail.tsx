import { useParams } from "react-router-dom";
import { toast } from "sonner";
import PageBackLink from "../components/PageBackLink";
import SubmissionDetailHeader from "../components/SubmissionDetailHeader";
import TaskResultCard, { TaskResultCardSkeleton } from "../components/TaskResultCard";
import ContactCard, { ContactCardSkeleton } from "../components/ContactCard";
import CapabilityHistoryCard, { CapabilityHistoryCardSkeleton } from "../components/CapabilityHistoryCard";
import IntegrityCard, { IntegrityCardSkeleton } from "../components/IntegrityCard";
import { useEmployerSubmission } from "../hooks/useEmployerSubmission";

const PAGE_SHELL = "min-h-screen bg-neutral-50 px-6 pb-10 pt-40 lg:px-12 xl:px-20";
const CONTENT_WIDTH = "mx-auto w-full max-w-6xl";

const SubmissionDetail = () => {
    const { jobId = "", submissionId } = useParams<{ jobId: string; submissionId: string }>();
    const { data: submission, isLoading, isError, refetch } = useEmployerSubmission(jobId, submissionId);

    const listPath = `/employer/jobs/${jobId}/submissions`;

    const handleUnlockContact = () => {
        // TODO: navigate to the payment page once it exists.
        toast.info("This feature is not available yet");
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
                    <CapabilityHistoryCard history={submission.capabilityHistory} />
                    <IntegrityCard status={submission.integrityStatus} checks={submission.integrityChecks} />
                </aside>
            </div>
        </div>
    );
};

export default SubmissionDetail;