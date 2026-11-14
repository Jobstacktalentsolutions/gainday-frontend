import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import PageBackLink from "../components/PageBackLink";
import { CapabilityPassportContent } from "../components/CapabilityPassportModal";
import CreditPurchaseModal from "../components/CreditPurchaseModal";
import { useEmployerSubmission } from "../hooks/useEmployerSubmission";
import { useSubmissionPassport } from "../hooks/useSubmissionPassport";
import { useUnlockCandidates } from "../hooks/useUnlockCandidates";
import { getCandidateLabel } from "../utils/submissionLabels";
import type { PaymentRequiredBody } from "../types/payments";

const EmployerPassportPage = () => {
    const { jobId = "", submissionId } = useParams<{ jobId: string; submissionId: string }>();
    const location = useLocation();
    const submissionQuery = useEmployerSubmission(jobId, submissionId);
    const passportQuery = useSubmissionPassport(submissionId, true);
    const unlockCandidates = useUnlockCandidates();
    const [purchase, setPurchase] = useState<{ open: boolean; recommendedPackId?: string }>({ open: false });
    const submission = submissionQuery.data;
    const returnTo = location.state?.returnTo === "/employer/unlocks"
        ? "/employer/unlocks"
        : `/employer/jobs/${jobId}/submissions/${submissionId}`;

    const unlock = () => {
        if (!submissionId) return;
        unlockCandidates.mutate([submissionId], {
            onSuccess: () => { toast.success("Contact unlocked"); submissionQuery.refetch(); },
            onError: (error) => {
                if (isAxiosError<PaymentRequiredBody>(error) && error.response?.status === 402) {
                    setPurchase({ open: true, recommendedPackId: error.response.data.recommendedPackId });
                } else {
                    toast.error("Couldn't unlock this candidate. Please try again.");
                }
            },
        });
    };

    return (
        <main className="min-h-screen bg-neutral-50 px-4 py-6 sm:px-6">
            <div className="mx-auto flex w-full max-w-269 flex-col gap-6">
                <PageBackLink to={returnTo}>Back</PageBackLink>
                {submissionQuery.isPending && <p className="text-sm text-neutral-700">Loading...</p>}
                {submissionQuery.isError && (
                    <p className="text-sm text-error-600">Something went wrong loading this submission. <button type="button" onClick={() => submissionQuery.refetch()} className="underline">Try again</button></p>
                )}
                {!submissionQuery.isPending && !submissionQuery.isError && !submission && (
                    <p className="text-sm text-neutral-700">We couldn't find that submission. It may have been removed or the link is incorrect.</p>
                )}
                {submission && (
                    <CapabilityPassportContent
                        open
                        onOpenChange={() => {}}
                        candidateName={getCandidateLabel(submission)}
                        displayId={submission.displayId}
                        candidateProfile={submission.candidateProfile}
                        passport={passportQuery.data}
                        isLoading={passportQuery.isPending}
                        isError={passportQuery.isError}
                        onRetry={() => passportQuery.refetch()}
                        isUnlocked={submission.isUnlocked}
                        isSelected={submission.isSelected}
                        contact={submission.contact}
                        onUnlockContact={unlock}
                    />
                )}
                {submissionId && <CreditPurchaseModal open={purchase.open} onOpenChange={(open) => setPurchase((prev) => ({ ...prev, open }))} mode="unlock" submissionIds={[submissionId]} recommendedPackId={purchase.recommendedPackId} onUnlocked={() => submissionQuery.refetch()} />}
            </div>
        </main>
    );
};

export default EmployerPassportPage;
