import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, MapPin, Wallet, Share2 } from "lucide-react";
import { PublicNavbar } from "../components/PublicNavbar";
import { AuthPromptModal } from "../components/AuthPromptModal";
import { ActionButton } from "@/components/ui/ActionButton";
import { StepContinueButton } from "@/components/ui/StepNavigationButtons";
import { useJobDetails } from "../hooks/useJobDetails";
import { formatPostedDate, formatSalaryRange } from "../utils/formatters";


export default function JobDetailsPage() {

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

    function handleSignUp() {
        // TODO: confirm the real signup route/query param shape for carrying job context
        navigate(`/signup?redirect=/job-board/${job.id}/apply`);
    }

    function handleContinueAsGuest() {
        // TODO: guest info form (name/email/phone) not built yet — stub only
        console.log("TODO: open guest info form for", job.id);
    }

    return (
        <div className="min-h-screen w-full bg-neutral-50">
            <PublicNavbar />

            <main className="mx-auto w-full max-w-300 px-5 pb-20 pt-33.75 sm:pt-43.75 lg:px-0">
                <div className="flex flex-col gap-10 overflow-hidden rounded-[32px] bg-white p-8">
                    <div className="flex flex-wrap items-start justify-between gap-6">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-[32px] leading-[1.2] text-primary-950 sm:text-[48px] sm:leading-14.5 sm:tracking-[-0.48px]">
                                    {job.title}
                                </h1>
                                <span className="rounded-full bg-primary-50 px-4 py-1 text-[16px] text-info-500">
                                    {job.roleCategory}
                                </span>
                            </div>
                            <p className="text-[16px] text-neutral-400">{job.employer.companyName}</p>
                            <div className="flex flex-wrap items-center gap-4">
                                <span className="flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-[16px] text-primary-950">
                                    <Wallet className="size-6" />
                                    {formatSalaryRange(job.salaryRange)}
                                </span>
                                <span className="flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-[16px] text-primary-950">
                                    <Clock className="size-6" />
                                    Posted {formatPostedDate(job.createdAt)}
                                </span>
                                <span className="flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-[16px] text-primary-950">
                                    <MapPin className="size-6" />
                                    {job.location}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <StepContinueButton size="lg" onClick={() => setAuthPromptOpen(true)}>
                                Apply
                            </StepContinueButton>
                            <ActionButton
                                variant="outline"
                                size="lg"
                                className="w-auto"
                                endIcon={<Share2 className="size-4" />}
                            >
                                Share
                            </ActionButton>
                        </div>
                    </div>

                    <div className="h-px w-full bg-neutral-200" />
                    <section className="flex flex-col gap-3">
                        <h2 className="text-[16px] text-primary-500">ABOUT THIS ROLE</h2>
                        <p className="text-[16px] text-primary-950">{job.description}</p>
                    </section>

                    <div className="h-px w-full bg-neutral-200" />

                    <section className="flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-[16px] text-primary-500">ROLE DETAILS</h2>
                            <div className="flex flex-wrap gap-10">
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

                    <div className="h-px w-full bg-neutral-200" />
                    <section className="flex flex-col gap-4 rounded-xl bg-primary-50 p-4">
                        <span className="w-fit rounded-md border border-primary-500 px-2 py-2 text-[10px] text-primary-500">
                            FULL TRANSPARENCY
                        </span>
                        <p className="text-[16px] text-primary-950">What this hire needs to solve?</p>
                        <p className="text-[16px] text-neutral-700">{job.businessProblem}</p>
                        <StepContinueButton size="lg" onClick={() => setAuthPromptOpen(true)}>
                            Start Now
                        </StepContinueButton>
                        <p className="text-[16px] text-neutral-400">
                            Uses a 20 to 30 minute work simulation, not a cover letter.
                        </p>
                    </section>
                </div>
            </main>


            <AuthPromptModal
                open={authPromptOpen}
                onOpenChange={setAuthPromptOpen}
                onSignUp={handleSignUp}
                onContinueAsGuest={handleContinueAsGuest}
            />
        </div>
    );

}