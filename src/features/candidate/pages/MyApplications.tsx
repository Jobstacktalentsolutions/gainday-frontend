import { toast } from "sonner";
import CandidateHeader from "../components/CandidateHeader";
import ApplicationCard, { ApplicationCardSkeleton } from "../components/ApplicationCard";
import ApplicationsEmptyState from "../components/ApplicationEmptyState";
import { useMyApplications } from "../hooks/useMyApplications";

const MyApplications = () => {
    const { data: applications, isLoading, isError, refetch } = useMyApplications();

    const handleWithdraw = () => {
        // TODO: confirm + call the withdraw endpoint once it exists.
        toast.info("This feature is not available yet");
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            <CandidateHeader />

            <main className="px-6 pb-16 pt-32 lg:px-12 lg:pt-44 xl:px-20">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:gap-20">
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
                                        onWithdraw={handleWithdraw}
                                    />
                                ))}
                            </div>
                        ) : (
                            <ApplicationsEmptyState />
                        )
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyApplications;