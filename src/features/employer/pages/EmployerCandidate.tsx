import { Users } from "lucide-react";

// TODO: placeholder until the Candidates design is ready. This page will list the candidates
// the employer has unlocked, along with their contact details.
const EmployerCandidates = () => {
    return (
        <div className="min-h-screen bg-neutral-50 px-6 pb-10 pt-32 md:px-7.5 lg:px-12 xl:px-20">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
                <div className="flex flex-col items-start">
                    <h1 className="text-2xl text-black lg:text-3xl">Candidates</h1>
                    <p className="text-neutral-500">Candidates you've unlocked, along with their contact details.</p>
                </div>

                <div className="flex w-full flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-primary-300 bg-white py-12 lg:py-20">
                    <span className="flex size-12 items-center justify-center rounded-lg bg-primary-50">
                        <Users className="size-6 text-primary-500" aria-hidden="true" />
                    </span>
                    <div className="flex flex-col items-center gap-1 text-center">
                        <p className="text-xl text-black lg:text-2xl">Coming soon</p>
                        <p className="max-w-72 text-base text-neutral-700">
                            Your unlocked candidates will appear here once this page is ready.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerCandidates;