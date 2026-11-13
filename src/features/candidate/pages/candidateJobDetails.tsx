import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, MapPin, Wallet, Share2, Check } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { JobBoardHeader } from "../components/JobBoardHeader";
import { ApplyDialog } from "../components/ApplyDialog";
import { CompleteProfileDialog } from "../components/CompleteProfileDialog";
import { ActionButton } from "@/components/ui/ActionButton";
import { StepContinueButton } from "@/components/ui/StepNavigationButtons";
import { useJobDetails } from "../hooks/useJobDetails";
import { useAppliedJobIds } from "../hooks/useAppliedJobIds";
import { formatPostedDate, formatSalaryRange, hasSalary } from "../utils/formatters";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { getJobShareUrl, shareLink } from "@/lib/shareLink";
import { cleanText } from "@/lib/cleanText";
import { cn } from "@/lib/utils";


const metaChipClass = "flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm text-primary-950 sm:px-4 sm:py-3 sm:text-base";

export default function JobDetailsPage() {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const { job, isLoading } = useJobDetails(jobId);
    const { appliedSet, getSubmissionUrlForJob } = useAppliedJobIds();
    const { user, isAuthenticated } = useCurrentUser();
    const [authPromptOpen, setAuthPromptOpen] = useState(false);
    const [profilePromptOpen, setProfilePromptOpen] = useState(false);

    const isApplied = Boolean(job && appliedSet.has(job.id));
    const isClosed = job?.status === "CLOSED";
    const applyButtonClass = cn(
        "w-full justify-between sm:w-fit sm:justify-start",
        !isApplied && isClosed &&
        "pointer-events-none disabled:bg-neutral-200 disabled:text-neutral-500 disabled:opacity-100 disabled:shadow-none",
    );
    const businessProblem = cleanText(job?.businessProblem);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-neutral-700">
                <JobBoardHeader />
                Loading...
            </div>
        )
    }

    if (!job) {
        //TODO : Ask Tofunmi for a proper job not found state
        return (
            <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-neutral-700">
                Job not found
            </div>
        )
    }

    async function handleShareClick() {
        if (!job) return;
        const result = await shareLink({
            title: `${job.title} at ${job.employer.companyName}`,
            text: "Take a look at this role on Gainday",
            url: getJobShareUrl(job.id),
        });
        // "shared" needs no toast (the share sheet is its own confirmation), and neither does
        // "cancelled" — the person closed the sheet on purpose.
        if (result === "copied") toast.success("Job link copied to clipboard");
        if (result === "failed") toast.error("Couldn't share the link — try again.");
    }

    function handleApplyClick() {
        if (isApplied) {
            navigate(getSubmissionUrlForJob(job!.id));
            return;
        }
        if (isClosed) return;
        if (isAuthenticated) {
            if (user?.isProfileComplete === false) {
                setProfilePromptOpen(true);
                return;
            }
            navigate(`/job-board/${job!.id}/pre-simulation`);
        } else {
            setAuthPromptOpen(true);
        }
    }

    function handleSignUp() {
        navigate(`/candidate/signup?redirect=${encodeURIComponent(`/job-board/${job!.id}/pre-simulation`)}`);
    }

    function handleSignIn() {
        navigate(`/candidate/signin?redirect=${encodeURIComponent(`/job-board/${job!.id}/pre-simulation`)}`);
    }


    return (
        <div className="min-h-screen w-full bg-neutral-50">
            <JobBoardHeader />

            <main className="mx-auto w-full max-w-300 px-5 pb-20 pt-33.75 sm:pt-43.75 lg:px-0">
                <div className="relative flex flex-col gap-8 overflow-hidden rounded-[32px] bg-white p-5 sm:gap-10 sm:p-8">
                    {/* Decorative gradient blobs */}
                    <div
                        aria-hidden="true"
                        className={`pointer-events-none block absolute  -left-5 -top-64 h-105 w-95 rotate-[-49deg] rounded-full bg-linear-to-b opacity-38 blur-3xl
                            bg-[linear-gradient(180deg,var(--color-primary-500)_40%,var(--color-secondary-500)_55%,var(--color-secondary-300)_65%,transparent_100%)]`}
                    />
                    <div
                        aria-hidden="true"
                        className={`pointer-events-none block absolute -right-5 -top-64 h-105 w-95 rotate-49 rounded-full bg-linear-to-b opacity-38 blur-3xl
                            bg-[linear-gradient(180deg,var(--color-primary-500)_40%,var(--color-secondary-500)_55%,var(--color-secondary-300)_65%,transparent_100%)]`}
                    />

                    <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div className="flex min-w-0 flex-col gap-4 md:flex-1">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                <h1 className="min-w-0 wrap-break-word text-[28px] leading-[1.2] text-primary-950 sm:text-[40px] lg:text-[48px] lg:leading-14.5 lg:tracking-[-0.48px]">
                                    {job.title}
                                </h1>
                                <span className="rounded-full bg-primary-50 px-3 py-1 text-sm text-info-500 sm:px-4 sm:text-base">
                                    {job.roleCategory}
                                </span>
                            </div>
                            <p className="text-base text-neutral-400">{job.employer.companyName}</p>
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                {hasSalary(job.salaryRange) && (
                                    <span className={metaChipClass}>
                                        <Wallet className="size-5 shrink-0 sm:size-6" />
                                        {formatSalaryRange(job.salaryRange)}
                                    </span>
                                )}
                                <span className={metaChipClass}>
                                    <Clock className="size-5 shrink-0 sm:size-6" />
                                    Posted {formatPostedDate(job.createdAt)}
                                </span>
                                <span className={metaChipClass}>
                                    <MapPin className="size-5 shrink-0 sm:size-6" />
                                    {job.location}
                                </span>
                            </div>
                        </div>

                        {/* Stacked and full-width on phones; side by side from sm; beside the title from md. */}
                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center md:shrink-0 md:gap-4">
                            <StepContinueButton
                                size="lg"
                                disabled={!isApplied && isClosed}
                                icon={isApplied ? <Check className="size-4" /> : undefined}
                                className={applyButtonClass}
                                onClick={handleApplyClick}
                            >
                                {isApplied ? "View Submission" : isClosed ? "Closed" : "Apply"}
                            </StepContinueButton>
                            <ActionButton
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto"
                                endIcon={<Share2 className="size-4" />}
                                onClick={handleShareClick}
                            >
                                Share
                            </ActionButton>
                        </div>
                    </div>

                    <div className="h-px w-full bg-neutral-200" />
                    {Boolean(job.description?.trim()) && (
                        <>
                            <section className="flex flex-col gap-3">
                                <h2 className="text-[16px] text-primary-500">ABOUT THIS ROLE</h2>
                                <div className="prose prose-sm max-w-none text-[16px] text-primary-950 prose-headings:font-semibold prose-headings:text-primary-950 prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-primary-950">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{job.description}</ReactMarkdown>
                                </div>
                            </section>
                            <div className="h-px w-full bg-neutral-200" />
                        </>
                    )}


                    <section className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-[16px] text-primary-500">ROLE DETAILS</h2>
                            <div className="flex flex-wrap gap-x-10 gap-y-4">
                                <div className="flex flex-col gap-1">
                                    <p className="text-[14px] text-neutral-700">Category</p>
                                    <p className="text-[16px] text-primary-950">{job.roleCategory}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-[14px] text-neutral-700">Employment type</p>
                                    <p className="text-[16px] text-primary-950">{job.employmentType}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-[14px] text-neutral-700">Deadline</p>
                            <p className="text-[16px] text-primary-950">
                                {formatPostedDate(job.applicationDeadline)}
                            </p>
                        </div>
                    </section>

                    {Boolean(job.requiredSkills && job.requiredSkills.length > 0) && (
                        <>
                            <div className="h-px w-full bg-neutral-200" />
                            <section className="flex flex-col gap-3">
                                <h2 className="text-[16px] text-primary-500">REQUIRED SKILLS</h2>
                                <div className="flex flex-wrap gap-3">
                                    {job.requiredSkills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-full bg-primary-50 px-2 py-1 text-[14px] text-primary-950"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}

                    <div className="h-px w-full bg-neutral-200" />
                    <section className="flex flex-col gap-4 rounded-xl bg-primary-50 p-4 sm:p-6">
                        {businessProblem && (
                            <>
                                <h2 className="text-[24px] leading-8 text-primary-950">About this role</h2>
                                <p className="text-[16px] text-primary-950">What this hire needs to solve?</p>
                                <p className="text-[16px] text-neutral-700">{businessProblem}</p>
                            </>
                        )}
                        <StepContinueButton
                            size="lg"
                            disabled={!isApplied && isClosed}
                            icon={isApplied ? <Check className="size-4" /> : undefined}
                            className={applyButtonClass}
                            onClick={handleApplyClick}
                        >
                            {isApplied ? "View Submission" : isClosed ? "Closed" : "Start Now"}
                        </StepContinueButton>
                        <p className="text-[16px] text-neutral-400">
                            Uses a 20 to 30 minute work simulation, not a cover letter.
                        </p>
                    </section>
                </div>
            </main>


            <ApplyDialog
                open={authPromptOpen}
                onOpenChange={setAuthPromptOpen}
                onSignUp={handleSignUp}
                onSignIn={handleSignIn}
            />
            <CompleteProfileDialog
                open={profilePromptOpen}
                onOpenChange={setProfilePromptOpen}
                onCompleteProfile={() => navigate("/candidate/profile")}
            />
        </div>
    );

}