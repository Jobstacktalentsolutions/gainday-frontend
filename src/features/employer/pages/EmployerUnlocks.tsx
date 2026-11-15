import UnlocksSection from "../components/billing/UnlocksSection";

// Every candidate the employer has paid to unlock, with their passport one click away.
const EmployerUnlocks = () => {
    return (
        <div className="min-h-screen bg-neutral-50 px-4 pb-12 pt-28 sm:px-6 lg:px-12 lg:pt-32 xl:px-20">
            <div className="mx-auto w-full max-w-300">
                <UnlocksSection />
            </div>
        </div>
    );
};

export default EmployerUnlocks;
