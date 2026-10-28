import { Check } from "lucide-react";
import { motion } from "motion/react";
import gaindayLogo from "@/assets/gainday.svg";
import { GlowOrb } from "../GlowOrb";

interface LandingPhotoProps {
    src: string;
    alt: string;
    /** "simulation": full-bleed photo with outline, logo and status chip. "framed": photo in a gradient frame. */
    variant: "simulation" | "framed";
}

const FRAME = "bg-linear-to-b from-primary-500 via-primary-700 to-secondary-500";

export const LandingPhoto = ({ src, alt, variant }: LandingPhotoProps) => (
    <div className="relative isolate w-full lg:w-98.75">
        <GlowOrb tone="amber" className="-bottom-16 -right-16 size-96" />
        <GlowOrb tone="blue" className="-left-16 -top-16 size-80" />

        {variant === "framed" ? (
            <div className={`aspect-[395/492] rounded-3xl p-2 shadow-[0_32px_64px_-28px_rgba(27,23,255,0.5)] ${FRAME}`}>
                <img
                    src={src}
                    alt={alt}
                    width={790}
                    height={984}
                    loading="lazy"
                    className="size-full rounded-2xl object-cover"
                />
            </div>
        ) : (
            <div className={`relative aspect-[395/492] overflow-hidden rounded-3xl shadow-[0_32px_64px_-28px_rgba(27,23,255,0.5)] ${FRAME}`}>
                <img src={src} alt={alt} width={790} height={984} loading="lazy" className="size-full object-cover" />
                {/* Scrim keeps the white logo and chip readable on any photo */}
                <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-black/35 via-transparent to-black/45" />
                {/* Thin inner outline */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-[6%] rounded-2xl border border-white/55" />

                <img
                    src={gaindayLogo}
                    alt=""
                    className="absolute right-[10%] top-[9%] h-6 w-auto brightness-0 invert"
                />

                <div className="absolute inset-x-0 bottom-[13%] flex justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm text-neutral-950 shadow-lg"
                    >
                        <span className="flex size-5 items-center justify-center rounded-full bg-success-500 text-white">
                            <Check className="size-3.5" aria-hidden="true" />
                        </span>
                        Simulation completed
                    </motion.div>
                </div>
            </div>
        )}
    </div>
);