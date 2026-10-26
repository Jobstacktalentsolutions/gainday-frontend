import CapabilityPassportModal from "../CapabilityPassportModal";
import { useEmployerSubmission } from "../../hooks/useEmployerSubmission";
import { useSubmissionPassport } from "../../hooks/useSubmissionPassport";
import { getCandidateLabel } from "../../utils/submissionLabels";
import type { UnlockRecord } from "../../types/billing";

interface UnlockedPassportModalProps {
    /** The unlocked row that was clicked. Its job and submission ids are set, as the list only links those. */
    record: UnlockRecord & { jobId: string; submissionId: string };
    onClose: () => void;
}

// Mounted only while a row is open, so the submission and passport are fetched on demand.
const UnlockedPassportModal = ({ record, onClose }: UnlockedPassportModalProps) => {
    const submissionQuery = useEmployerSubmission(record.jobId, record.submissionId);
    const passportQuery = useSubmissionPassport(record.submissionId, true);
    const submission = submissionQuery.data;

    return (
        <CapabilityPassportModal
            open
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
            candidateName={submission ? getCandidateLabel(submission) : record.candidateName ?? "Candidate"}
            displayId={submission?.displayId}
            candidateProfile={submission?.candidateProfile ?? null}
            passport={passportQuery.data}
            isLoading={passportQuery.isPending || submissionQuery.isPending}
            isError={passportQuery.isError}
            onRetry={() => passportQuery.refetch()}
            // Every row on this page is an unlock, so the contact is shown without checking the submission.
            isUnlocked
            isSelected={submission?.isSelected === true || submission?.status === "SELECTED"}
            contact={submission?.contact ?? null}
        />
    );
};

export default UnlockedPassportModal;
