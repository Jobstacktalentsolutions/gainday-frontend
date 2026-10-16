import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatShortDate } from "@/lib/formatDate";
import Skeleton from "@/components/ui/skeleton";
import { actionButtonVariants } from "@/components/ui/ActionButton";
import CandidateHeader from "../components/CandidateHeader";
import ApplicationTimeline from "../components/ApplicationTimeline";
import WithdrawApplicationDialog from "../components/WithdrawApplicationDialog";
import { useApplication } from "../hooks/useApplication";
import { useWithdrawApplication } from "../hooks/useWithdrawApplication";
import { APPLICATION_STATUS_META } from "../utils/applicationStatus";
import { formatSalaryRange } from "../utils/formatters";
import type { ApplicationDetail } from "../types/application";

const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-1">
        <dt className="text-sm text-neutral-500">{label}</dt>
        <dd className="text-base text-neutral-900">{value}</dd>
    </div>
);

const ApplicationDetailContent = ({ application }: { application: ApplicationDetail }) => {
    const withdraw = useWithdrawApplication();
    const [withdrawOpen, setWithdrawOpen] = useState(false);
    const { label, badgeClass, canWithdraw } = APPLICATION_STATUS_META[application.status];
    const { job } = application;
    const companyLine = [application.companyName, `Applied ${formatShortDate(application.submittedAt)}`]
        .filter(Boolean)
        .join(" · ");

    return (
        <>
                        <section className="flex flex-col gap-6 rounded-xl bg-white p-6 lg:p-8">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-3xl leading-tight text-neutral-900 lg:text-4xl">
                                        {application.jobTitle}
                                    </h1>
                                    <p className="text-base text-neutral-500">{companyLine}</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-center gap-1 text-neutral-900">
                                        {application.rating !== null ? (
                                            <p className="whitespace-nowrap">
                                                <span className="text-2xl font-bold">{application.rating}</span>
                                                <span className="text-lg">/100</span>
                                            </p>
                                        ) : (
                                            <p className="text-2xl">—</p>
                                        )}
                                        <p className="text-sm text-primary-500">RATING</p>
                                    </div>
                                    <span
                                        className={cn(
                                            "flex min-w-30 items-center justify-center whitespace-nowrap rounded-2xl px-3 py-1 text-sm",
                                            badgeClass,
                                        )}
                                    >
                                        {label}
                                    </span>
                                </div>
                            </div>

                            <div className="h-px w-full bg-neutral-100" />

                            <div className="flex flex-col gap-4">
                                <h2 className="text-xl text-neutral-900">Application progress</h2>
                                <ApplicationTimeline application={application} />
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                {application.rating !== null ? (
                                    <Link
                                        to={`/candidate/submissions/${application.id}/result`}
                                        className={cn(actionButtonVariants({ variant: "primary", size: "md" }), "sm:w-52")}
                                    >
                                        View submission result
                                    </Link>
                                ) : (
                                    <Link
                                        to={`/candidate/applications/${application.id}/submission`}
                                        className={cn(actionButtonVariants({ variant: "primary", size: "md" }), "sm:w-48")}
                                    >
                                        View submission
                                    </Link>
                                )}
                                {application.rating !== null && (
                                    <Link
                                        to={`/candidate/applications/${application.id}/submission`}
                                        className={cn(actionButtonVariants({ variant: "outline", size: "md" }), "sm:w-48")}
                                    >
                                        View submission
                                    </Link>
                                )}
                                {canWithdraw && (
                                    <button
                                        type="button"
                                        onClick={() => setWithdrawOpen(true)}
                                        className="flex h-10 items-center justify-center rounded-lg border border-neutral-700 px-5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-primary-500 sm:w-48"
                                    >
                                        Withdraw
                                    </button>
                                )}
                            </div>
                        </section>

                        <section className="flex flex-col gap-6 rounded-xl bg-white p-6 lg:p-8">
                            <h2 className="text-xl text-neutral-900">About the job</h2>

                            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {job.location && <DetailRow label="Location" value={job.location} />}
                                {job.employmentType && <DetailRow label="Employment type" value={job.employmentType} />}
                                <DetailRow label="Remote" value={job.isRemoteFriendly ? "Remote friendly" : "On-site"} />
                                {job.skillLevel && <DetailRow label="Skill level" value={job.skillLevel} />}
                                {job.salaryRange && (
                                    <DetailRow label="Salary" value={formatSalaryRange(job.salaryRange)} />
                                )}
                                {job.applicationDeadline && (
                                    <DetailRow label="Application deadline" value={formatShortDate(job.applicationDeadline)} />
                                )}
                            </dl>

                            {job.requiredSkills.length > 0 && (
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm text-neutral-500">Required skills</p>
                                    <ul className="flex flex-wrap gap-2">
                                        {job.requiredSkills.map((skill) => (
                                            <li
                                                key={skill}
                                                className="rounded-2xl bg-primary-50 px-3 py-1 text-sm text-primary-500"
                                            >
                                                {skill}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {job.description && (
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm text-neutral-500">Description</p>
                                    <p className="whitespace-pre-line text-base text-neutral-700">{job.description}</p>
                                </div>
                            )}
                        </section>

                        <WithdrawApplicationDialog
                            application={application}
                            open={withdrawOpen}
                            onOpenChange={(open) => {
                                if (!open && !withdraw.isPending) setWithdrawOpen(false);
                            }}
                            onConfirm={(app) =>
                                withdraw.mutate(app.id, { onSettled: () => setWithdrawOpen(false) })
                            }
                            isPending={withdraw.isPending}
                        />
        </>
    );
};

const ApplicationDetailPage = () => {
    const { applicationId } = useParams<{ applicationId: string }>();
    const { data: application, isLoading, isError, refetch } = useApplication(applicationId);
    return (
        <div className="min-h-screen bg-neutral-50">
            <CandidateHeader />

            <main className="px-6 pb-16 pt-32 lg:px-12 lg:pt-44 xl:px-20">
                <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
                    <Link
                        to="/candidate/applications"
                        className="flex w-fit items-center gap-2 text-base text-neutral-700 hover:text-primary-500"
                    >
                        <ArrowLeft className="size-4" aria-hidden="true" />
                        My applications
                    </Link>

                    {isLoading && (
                        <div className="flex flex-col gap-6" aria-busy="true">
                            <Skeleton className="h-12 w-96 max-w-full" />
                            <Skeleton className="h-72 w-full rounded-xl" />
                            <Skeleton className="h-60 w-full rounded-xl" />
                        </div>
                    )}

                    {!isLoading && (isError || !application) && (
                        <div className="w-full rounded-3xl border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
                            We couldn't load this application.{" "}
                            <button type="button" onClick={() => refetch()} className="underline">
                                Try again
                            </button>
                        </div>
                    )}

                    {application && <ApplicationDetailContent application={application} />}
                </div>
            </main>
        </div>
    );
};

export default ApplicationDetailPage;
