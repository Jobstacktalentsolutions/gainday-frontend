import { cn } from "@/lib/utils";
import { formatExactPrice, formatPrice, perUnlockPence } from "@/lib/formatPrice";
import type { PricingPack } from "../content/pricing";

const GLASS =
    "bg-[linear-gradient(194.75deg,rgba(27,23,255,0.2)_0%,rgba(27,23,255,0.04)_50%,rgba(224,147,46,0.12)_100%)]";

interface PackCardProps {
    pack: PricingPack;
    /** Omit to hide the button (e.g. for signed-in candidates). */
    onSelect?: () => void;
}

const PackCard = ({ pack, onSelect }: PackCardProps) => {
    const subtitle =
        pack.credits === 1
            ? "1 credit"
            : `${pack.credits} credits · ${formatExactPrice(perUnlockPence(pack.pricePence, pack.credits))} each`;

    return (
        <div className="relative flex-1">
            {pack.popular && (
                <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl bg-primary-50 px-4 py-0.5 text-base text-primary-500">
                    Most Popular
                </span>
            )}
            <div
                className={cn(
                    "flex h-full flex-col gap-10 overflow-hidden rounded-[32px] border p-8 backdrop-blur-xl sm:p-10",
                    GLASS,
                    pack.popular ? "border-primary-500" : "border-primary-300",
                )}
            >
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-6">
                        <span
                            aria-hidden="true"
                            className="flex size-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10"
                        >
                            <span className="size-4 rounded-full border-[5px] border-white" />
                        </span>
                        <div className="flex flex-col gap-1">
                            <h3 className="text-xl leading-[1.2] text-primary-50">{pack.name}</h3>
                            <p className="text-base text-white">{subtitle}</p>
                        </div>
                    </div>
                    <p className="text-[48px] leading-14.5 tracking-[-0.48px] text-white">{formatPrice(pack.pricePence)}</p>
                </div>

                {onSelect && (
                    <button
                        type="button"
                        onClick={onSelect}
                        className={cn(
                            "mt-auto h-13 w-full cursor-pointer rounded-xl border border-white/10 text-base text-white transition-colors",
                            pack.popular
                                ? "bg-primary-500 hover:bg-primary-400"
                                : "bg-linear-to-b from-white/8 to-transparent hover:from-white/15",
                        )}
                    >
                        Get {pack.name}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PackCard;