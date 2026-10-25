import { useNavigate } from "react-router-dom";
import { Check, Lock } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import Header from "@/features/landing/components/Header";
import { HighlightBox } from "@/features/landing/components/HighlightBox";
import SectionTag from "@/features/landing/components/SectionTag";
import { Footer } from "@/features/landing/components/footer/Footer";
import AppLoader from "@/components/ui/AppLoader";
import { useCreditPacks } from "@/features/employer/hooks/useCreditPacks";
import PackCard from "../components/PackCard";
import { FREE_FEATURES, PAID_LOCKED, PRICING_CHIPS, type PricingPack } from "../content/pricing";

const headingClass =
    "text-[36px] leading-11 tracking-[-0.36px] md:text-[56px] md:leading-16 md:tracking-[-0.56px]";

const PricingPage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useCurrentUser();
    const packsQuery = useCreditPacks();

    // Signed-out visitors and employers can buy; signed-in candidates/admins just read.
    const canBuy = !isAuthenticated || user?.role === "EMPLOYER";

    // Live catalogue from the backend, so the pack ids match what the purchase endpoint accepts.
    const packs: PricingPack[] = packsQuery.data
        ? packsQuery.data.map((pack) => ({
              id: pack.id,
              name: pack.name,
              credits: pack.credits,
              pricePence: pack.pricePence,
              popular: pack.label !== null,
          }))
        : [];

    // The billing page opens its pack picker from ?buy=. A signed-out visitor goes through signup
    // with the same path as the redirect, so they land on the payment step once they're in.
    const handleSelect = (pack: PricingPack) => {
        const buyPath = `/employer/billing?buy=${pack.id}`;
        if (isAuthenticated && user?.role === "EMPLOYER") {
            navigate(buyPath);
        } else {
            navigate(`/employer/signup?redirect=${encodeURIComponent(buyPath)}`);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-neutral-50">
            <Header />

            <main className="flex flex-1 flex-col gap-20 pt-40 lg:gap-30">
                {/* Hero */}
                <section className="flex flex-col items-center gap-4 px-6 text-center md:px-30">
                    <SectionTag label="Pricing" />
                    <h1 className={`flex max-w-xl flex-col items-center gap-3 text-black ${headingClass}`}>
                        <span>Post for Free. Pay Only to Unlock</span>
                        <HighlightBox className={headingClass}>Candidates.</HighlightBox>
                    </h1>
                    <p className="text-base text-neutral-700">No subscription.</p>
                </section>

                {/* Packs */}
                <section className="bg-neutral-950 px-6 py-16 lg:p-30">
                    <div className="mx-auto flex w-full max-w-300 flex-col gap-20">
                        {packsQuery.isPending && <AppLoader />}
                        {packsQuery.isError && (
                            <p role="alert" className="text-base text-white">
                                Pricing is unavailable right now. Please try again shortly.
                            </p>
                        )}

                        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-6">
                            {packs.map((pack) => (
                                <PackCard
                                    key={pack.id}
                                    pack={pack}
                                    onSelect={canBuy ? () => handleSelect(pack) : undefined}
                                />
                            ))}
                        </div>

                        <ul className="flex flex-wrap gap-4 lg:gap-6">
                            {PRICING_CHIPS.map((chip) => (
                                <li key={chip} className="rounded-2xl bg-primary-50 px-6 py-1 text-base text-neutral-950">
                                    {chip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Free vs paid */}
                <section className="mx-auto grid w-full max-w-300 gap-6 px-6 pb-20 md:grid-cols-2 lg:px-0 lg:pb-30">
                    <div className="flex flex-col gap-6 rounded-xl border border-primary-200 px-6 py-9">
                        <p className="text-sm uppercase text-primary-500">Free</p>
                        <ul className="flex flex-col gap-3">
                            {FREE_FEATURES.map((item) => (
                                <li key={item} className="flex items-start gap-1 text-sm text-primary-950">
                                    <Check className="size-5 shrink-0" aria-hidden="true" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-6 rounded-xl border border-primary-200 bg-linear-to-br from-secondary-500 via-[#5b3050] to-primary-500 px-6 py-9">
                        <p className="text-sm uppercase text-primary-50">Paid — 1 credit per candidate</p>
                        <ul className="flex flex-col gap-3">
                            {PAID_LOCKED.map((item) => (
                                <li key={item} className="flex items-center gap-1 text-sm text-primary-50">
                                    <Lock className="size-5 shrink-0" aria-hidden="true" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default PricingPage;