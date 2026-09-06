import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, MapPin, Play } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { MOCK_JOB_PREVIEWS } from "../mocks/jobPreviews";
import type { JobPreviewDetails, JobStatus } from "../types/jobPreview";
