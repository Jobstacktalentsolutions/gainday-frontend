import { Link, useParams } from "react-router-dom";
import { Laptop } from "lucide-react";
import { toast } from "sonner";
import { actionButtonVariants, ActionButton } from "@/components/ui/ActionButton";
import { cn } from "@/lib/utils";
import { getJobShareUrl, shareLink } from "@/lib/shareLink";
import CandidateHeader from "./CandidateHeader";

// Shown instead of any simulation page on a phone or tablet.
export default function DesktopOnlyNotice() {
    const { jobId } = useParams<{ jobId: string }>();
    const jobPath = jobId ? `/job-board/${jobId}` : "/job-board";

    async function handleSendLink() {
        const result = await shareLink({
            title: "Continue my Gainday assessment",
            text: "Open this on a laptop or desktop computer to take the assessment",
            url: jobId ? getJobShareUrl(jobId) : `${window.location.origin}/job-board`,
        });
        // "shared" and "cancelled" need no toast (the share sheet is its own confirmation).
        if (result === "copied") toast.success("Link copied. Open it on a computer to continue.");
        if (result === "failed") toast.error("Couldn't share the link. Try again.");
    }

    return (
        <div className="min-h-screen w-full bg-neutral-50">
            <CandidateHeader />

            <main className="mx-auto flex w-full max-w-xl flex-col items-center px-5 pb-16 pt-32 sm:pt-40">
                <div className="flex w-full flex-col items-center gap-6 rounded-3xl bg-white p-6 text-center shadow-[0px_4px_10px_rgba(16,24,40,0.05)] sm:p-10">
                    <span className="flex size-14 items-center justify-center rounded-2xl bg-primary-50">
                        <Laptop className="size-7 text-primary-500" aria-hidden="true" />
                    </span>

                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl leading-8 tracking-[-0.32px] text-primary-950 sm:text-[32px] sm:leading-9.5">
                            Use a laptop or desktop to take this assessment
                        </h1>
                        <p className="text-base text-neutral-700">
                            The work simulation needs a full-size screen, a keyboard and full-screen mode so
                            your results are fair and comparable. It can't be taken on a phone or tablet.
                        </p>
                        <p className="text-base text-neutral-400">
                            Your account and progress are saved. Sign in on a computer and pick up from the job page.
                        </p>
                    </div>

                    <div className="flex w-full flex-col gap-3">
                        <ActionButton variant="primary" size="lg" onClick={handleSendLink}>
                            Send myself the link
                        </ActionButton>
                        <Link
                            to={jobPath}
                            className={cn(actionButtonVariants({ variant: "outline", size: "lg" }))}
                        >
                            Back to job
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}