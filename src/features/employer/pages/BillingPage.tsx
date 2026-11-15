import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CreditBalanceHero from "../components/billing/CreditBalanceHero";
import PurchasesSection from "../components/billing/PurchasesSection";
import CreditPurchaseModal from "../components/CreditPurchaseModal";
import { useCreditBalance } from "../hooks/useCreditBalance";

const BillingPage = () => {
    const { data, isLoading } = useCreditBalance();
    const [searchParams, setSearchParams] = useSearchParams();

    // Entry point for the Pricing page's "Get <pack>" buttons: /employer/billing?buy=<packId>.
    // Read once, open the modal, then drop the param so a refresh doesn't reopen it.
    const [initialPackKey] = useState(() => searchParams.get("buy"));
    const [buyOpen, setBuyOpen] = useState(initialPackKey !== null);

    useEffect(() => {
        if (searchParams.has("buy")) {
            const next = new URLSearchParams(searchParams);
            next.delete("buy");
            setSearchParams(next, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    return (
        <div className="min-h-screen bg-neutral-50 px-4 pb-12 pt-28 sm:px-6 lg:px-12 lg:pt-32 xl:px-20">
            <div className="mx-auto flex w-full max-w-300 flex-col gap-6 sm:gap-8">
                <h1 className="text-3xl leading-tight tracking-tight text-black lg:text-4xl">
                    Billing &amp; Credits
                </h1>

                <CreditBalanceHero balance={data?.balance} isLoading={isLoading} onBuy={() => setBuyOpen(true)} />
                <PurchasesSection />
            </div>

            <CreditPurchaseModal
                open={buyOpen}
                onOpenChange={setBuyOpen}
                mode="buy"
                recommendedPackId={initialPackKey || undefined}
            />
        </div>
    );
};

export default BillingPage;
