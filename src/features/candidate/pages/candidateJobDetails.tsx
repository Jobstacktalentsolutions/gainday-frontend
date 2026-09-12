import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, MapPin, Wallet, Share2 } from "lucide-react";
import { PublicNavbar } from "../components/PublicNavbar";
import { AuthPromptModal } from "../components/AuthPromptModal";
import { ActionButton } from "@/components/ui/ActionButton";
import { StepContinueButton } from "@/components/ui/StepNavigationButtons";
import { useJobDetails } from "../hooks/useJobDetails";
import { formatPostedDate, formatSalaryRange } from "../utils/formatters";


export function JobDetailsPage() {

    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const { job } = useJobDetails(jobId);
    const [authPromptOpen, setAuthPromptOpen] = useState(false);

    if (!job) {
        //TODO : Ask Tofunmi for a proper job not found state
        return (
            <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-neutral-700">
                Job not found
            </div>
        )
    }

}