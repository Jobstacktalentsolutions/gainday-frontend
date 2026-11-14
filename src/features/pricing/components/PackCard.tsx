import { Layers, Sprout, TrendingUp } from "lucide-react";
import GradientASCII from "@/components/ui/GradientASCII";
import "./pricing-gradient.css";
import { cn } from "@/lib/utils";
import { formatExactPrice, formatPrice, perUnlockPence } from "@/lib/formatPrice";
import type { PricingPack } from "../content/pricing";

const STAR_COLORS = ["#1e3fd8", "#f6f8ff", "#a5d8ff", "#38bdf8"];

const GLASS =
    "bg-[linear-gradient(194.75deg,color-mix(in_srgb,var(--color-primary-500)_35%,transparent)_0%,color-mix(in_srgb,var(--color-primary-500)_8%,transparent)_45%,color-mix(in_srgb,var(--color-primary-500)_55%,transparent)_100%)]";

const PACK_ICONS: Record<string, typeof Sprout> = {
    STARTER: Sprout,
    GROWTH: TrendingUp,
    SCALE: Layers,
};

interface PackCardProps {
    pack: PricingPack;
    /** Omit to hide the button (e.g. for signed-in candidates). */
    onSelect?: () => void;
}

const PackCard = ({ pack, onSelect }: PackCardProps) => {
    const Icon = PACK_ICONS[pack.id] ?? Layers;
    const subtitle =
        pack.credits === 1
            ? "1 credit"
            : `${pack.credits} credits · ${formatExactPrice(perUnlockPence(pack.pricePence, pack.credits))} each`;

    return (
        <div className={cn("relative flex-1", pack.popular && "lg:flex-[1.15] lg:-my-5")}>
            {pack.popular && (
                <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl bg-primary-50 px-4 py-0.5 text-base text-primary-500">
                    Growth pack
                </span>
            )}
            <div
                className={cn(
                    "pricing-gradient relative isolate flex h-full flex-col gap-6 overflow-hidden rounded-[32px] border p-6 backdrop-blur-xl sm:p-8",
                    GLASS,
                    pack.popular ? "border-primary-500" : "border-primary-300",
                )}
            >
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 opacity-35">
                    <GradientASCII
                        colors={STAR_COLORS}
                        shape="horizon"
                        characters=" =+xX0S8#@"
                        cellSize={18}
                        density={0.8}
                        glyphOpacity={0.85}
                        glow={0.2}
                        flicker={0.2}
                        softness={0.5}
                        flow={0.5}
                        gradientOpacity={0.9}
                        grain={0.08}
                        mouseInteraction
                        scrambleRadius={0.1}
                        clickEffect="wave"
                        intro
                    />
                </div>
                <div className="relative z-10 flex flex-col gap-5">
                    <div className="flex flex-col gap-4">
                        <span
                            aria-hidden="true"
                            className="flex size-12 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10"
                        >
                            <span className="flex size-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">
                                <Icon className="size-5 text-white" />
                            </span>
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
                            "relative z-10 mt-auto h-13 w-full cursor-pointer rounded-xl border border-white/10 text-base text-white transition-colors",
                            pack.popular
                                ? "bg-primary-500 hover:bg-primary-400"
                                : "bg-linear-to-b from-white/8 to-transparent hover:from-white/15",
                        )}
                    >
                        Choose {pack.name}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PackCard;