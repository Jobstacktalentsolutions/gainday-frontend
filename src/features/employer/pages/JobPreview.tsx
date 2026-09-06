import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, MapPin, Play } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { MOCK_JOB_PREVIEWS } from "../mocks/jobPreviews";
import type { JobPreviewDetails, JobStatus } from "../types/jobPreview";


// TODO: replace with the real single-job fetch hook once available, e.g.
// const { data: job, isLoading } = useJobPreview(jobId);
const useJobPreviewMock = (jobId: string | undefined) => {
    const job = MOCK_JOB_PREVIEWS.find((preview) => preview.id === jobId);
    return { job, isLoading: false };
};