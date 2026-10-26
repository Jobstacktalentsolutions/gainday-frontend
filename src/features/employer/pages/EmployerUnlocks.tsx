import UnlocksSection from "../components/billing/UnlocksSection";

// Every candidate the employer has paid to unlock, with their passport one click away.
const EmployerUnlocks = () => {
    return (
        <div className="min-h-screen bg-neutral-50 px-6 pb-16 pt-40 lg:px-12 xl:px-20">
            <div className="mx-auto flex w-full max-w-300 flex-col gap-10">
                <UnlocksSection />
            </div>
        </div>
    );
};

export default EmployerUnlocks;
