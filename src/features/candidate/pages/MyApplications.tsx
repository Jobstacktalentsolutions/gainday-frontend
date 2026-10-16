import { useState } from "react";
import CandidateHeader from "../components/CandidateHeader";
import ApplicationCard, { ApplicationCardSkeleton } from "../components/ApplicationCard";
import ApplicationsEmptyState from "../components/ApplicationEmptyState";
import WithdrawApplicationDialog from "../components/WithdrawApplicationDialog";
import { useMyApplications } from "../hooks/useMyApplications";
import { useWithdrawApplication } from "../hooks/useWithdrawApplication";
import type { Application } from "../types/application";

const MyApplications = () => {
    const { data: applications, isLoading, isError, refetch } = useMyApplications();
    const withdraw = useWithdrawApplication();
    const [applicationToWithdraw, setApplicationToWithdraw] = useState<Application | null>(null);

    const handleConfirmWithdraw = (application: Application) => {
        withdraw.mutate(application.id, { onSettled: () => setApplicationToWithdraw(null) });
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            <CandidateHeader />

            <main className="px-6 pb-16 pt-32 lg:px-12 lg:pt-44 xl:px-20">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:gap-12">
                    <div className="flex flex-col">
                        <p className="text-base text-primary-500">MY APPLICATIONS</p>
                        <h1 className="text-4xl leading-tight tracking-[-0.48px] text-black lg:text-5xl">
                            Jobs you've applied to
                        </h1>
                    </div>

                    {isLoading && (
                        <div className="flex flex-col gap-6" aria-busy="true">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <ApplicationCardSkeleton key={index} />
                            ))}
                        </div>
                    )}

                    {!isLoading && isError && (
                        <div className="w-full rounded-3xl border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
                            Something went wrong loading your applications.{" "}
                            <button type="button" onClick={() => refetch()} className="underline">
                                Try again
                            </button>
                        </div>
                    )}

                    {!isLoading && !isError && (
                        applications && applications.length > 0 ? (
                            <div className="flex flex-col gap-6">
                                {applications.map((application) => (
                                    <ApplicationCard
                                        key={application.id}
                                        application={application}
                                        onWithdraw={setApplicationToWithdraw}
                                    />
                                ))}
                            </div>
                        ) : (
                            <ApplicationsEmptyState />
                        )
                    )}
                </div>
            </main>

            <WithdrawApplicationDialog
                application={applicationToWithdraw}
                open={applicationToWithdraw !== null}
                onOpenChange={(open) => {
                    if (!open && !withdraw.isPending) setApplicationToWithdraw(null);
                }}
                onConfirm={handleConfirmWithdraw}
                isPending={withdraw.isPending}
            />
        </div>
    );
};

export default MyApplications;
