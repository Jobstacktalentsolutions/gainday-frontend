import CandidateHeader from "../components/CandidateHeader";
import PassportEmptyState from "../components/PassportEmptyState";
import CapabilityPassportView from "@/features/capability-passport/components/CapabilityPassportView";
import CapabilityPassportSkeleton from "@/features/capability-passport/components/CapabilityPassportSkeleton";
import { useCandidatePassport } from "@/features/capability-passport/hooks/useCandidatePassport";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { getFirstName } from "../utils/getFirstName";

const CapabilityPassportPage = () => {
    const { user } = useCurrentUser();
    const { data: passport, isLoading, isError, refetch } = useCandidatePassport();
    const firstName = getFirstName(user?.fullName);

    return (
        <div className="min-h-screen bg-neutral-50">
            <CandidateHeader />

            <main className="px-6 pb-16 pt-32 lg:px-12 lg:pt-44 xl:px-20">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:gap-20">
                    <div className="flex flex-col">
                        <p className="text-base text-primary-500">MY CAPABILITY PASSPORT</p>
                        <h1 className="text-4xl leading-tight tracking-[-0.48px] text-black lg:text-5xl">
                            {firstName ? `Welcome back, ${firstName}` : "Welcome back"}
                        </h1>
                        <p className="text-base text-neutral-700">
                            Here is your Capability Passport and everything you have applied to so far.
                        </p>
                    </div>

                    {isLoading && <CapabilityPassportSkeleton variant="candidate" />}

                    {!isLoading && isError && (
                        <div className="w-full rounded-3xl border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
                            Something went wrong loading your Capability Passport.{" "}
                            <button type="button" onClick={() => refetch()} className="underline">
                                Try again
                            </button>
                        </div>
                    )}

                    {!isLoading && !isError && (
                        passport ? (
                            <CapabilityPassportView passport={passport} variant="candidate" />
                        ) : (
                            <PassportEmptyState />
                        )
                    )}
                </div>
            </main>
        </div>
    );
};

export default CapabilityPassportPage;