import { Link } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import Skeleton from "@/components/ui/skeleton";
import { formatShortDate } from "@/lib/formatDate";
import { APPLICATION_STATUS_META } from "../utils/applicationStatus";
import type { Application } from "../types/application";

interface ApplicationCardProps {
    application: Application;
    onWithdraw: (application: Application) => void;
}

const ApplicationCard = ({ application, onWithdraw }: ApplicationCardProps) => {
    const { label, badgeClass, canWithdraw } = APPLICATION_STATUS_META[application.status];
    const statusLine = `${label}${application.decidedAt ? ` ${formatShortDate(application.decidedAt)}` : ""}`;
    const companyLine = [application.companyName, `Applied ${formatShortDate(application.submittedAt)}`]
        .filter(Boolean)
        .join(" · ");

    return (
        <article className="relative flex w-full flex-col gap-6 rounded-xl border border-white bg-white p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-col gap-2 lg:w-100">
                {/* The title link's ::after stretches over the whole card, making all of it clickable
                    without nesting the withdraw button inside an anchor. */}
                <h2 className="text-2xl leading-8 text-neutral-900">
                    <Link
                        to={`/candidate/applications/${application.id}`}
                        className="flex items-center gap-2 after:absolute after:inset-0 after:rounded-xl focus-visible:outline-2 focus-visible:outline-primary-500"
                    >
                        {application.jobTitle}
                        {application.status === "SELECTED" && (
                            <CircleCheck
                                className="size-6 shrink-0 text-success-500"
                                aria-label="Selected"
                            />
                        )}
                    </Link>
                </h2>
                <p className="text-base text-neutral-500">{companyLine}</p>
                <p className="text-base text-neutral-700">{statusLine}</p>
            </div>

            {/* Below lg these three sit in one wrapping row; at lg the wrapper disappears and they
                become direct children of the card so justify-between spaces them out. */}
            <div className="flex flex-wrap items-center justify-between gap-4 lg:contents">
                {application.rating !== null ? (
                    <Link
                        to={`/candidate/submissions/${application.id}/result`}
                        className="relative z-10 flex w-17.5 flex-col items-center gap-3 text-neutral-900 transition-colors hover:text-primary-600"
                        title="View submission result"
                    >
                        <p className="whitespace-nowrap">
                            <span className="text-2xl font-bold">{application.rating}</span>
                            <span className="text-lg">/100</span>
                        </p>
                        <p className="text-sm text-primary-500 underline underline-offset-4 decoration-primary-300">RATING</p>
                    </Link>
                ) : (
                    <div className="flex w-17.5 flex-col items-center gap-3 text-neutral-900">
                        <p className="text-2xl">—</p>
                        <p className="text-sm text-primary-500">RATING</p>
                    </div>
                )}

                <span
                    className={cn(
                        "flex min-w-30 items-center justify-center whitespace-nowrap rounded-2xl px-3 py-1 text-sm",
                        badgeClass,
                    )}
                >
                    {label}
                </span>

                <button
                    type="button"
                    disabled={!canWithdraw}
                    onClick={() => onWithdraw(application)}
                    className="relative z-10 flex h-13 w-40 items-center justify-center rounded-xl border border-neutral-700 px-10 py-2 text-base text-neutral-700 transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
                >
                    {application.status === "WITHDRAWN" ? "Withdrawn" : "Withdraw"}
                </button>
            </div>
        </article>
    );
};

export const ApplicationCardSkeleton = () => {
    return (
        <div className="flex w-full flex-col gap-6 rounded-xl bg-white p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 lg:w-100">
                <Skeleton className="h-8 w-64 max-w-full" />
                <Skeleton className="h-6 w-72 max-w-full" />
                <Skeleton className="h-6 w-56 max-w-full" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 lg:contents">
                <div className="flex w-17.5 flex-col items-center gap-3">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-7 w-30 rounded-2xl" />
                <Skeleton className="h-13 w-40 rounded-xl" />
            </div>
        </div>
    );
};

export default ApplicationCard;