import { Check } from "lucide-react";
import { motion } from "motion/react";
import gaindayLogo from "@/assets/gainday.svg";
import { GlowOrb } from "../GlowOrb";

interface LandingPhotoProps {
    src: string;
    alt: string;
    /** Label shown in the animated chip at the bottom of the card. */
    chipLabel: string;
}

const FRAME = "bg-linear-to-b from-primary-500 via-primary-700 to-secondary-500";

export const LandingPhoto = ({ src, alt, chipLabel }: LandingPhotoProps) => (
    <div className="relative isolate w-full lg:w-98.75">
        <GlowOrb tone="amber" className="-bottom-16 -right-16 size-96" />
        <GlowOrb tone="blue" className="-left-16 -top-16 size-80" />

        <div className={`relative aspect-395/492 rounded-3xl p-2 shadow-[0_32px_64px_-28px_rgba(27,23,255,0.5)] ${FRAME}`}>
            <img
                src={src}
                alt={alt}
                width={790}
                height={984}
                loading="lazy"
                className="size-full rounded-2xl object-cover"
            />

            {/* Thin inner outline */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-[5%] rounded-2xl border border-white/55" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-[7%] rounded-2xl  bg-black/20" />


            <img
                src={gaindayLogo}
                alt=""
                className="absolute right-[12%] top-[9%] h-8.5 w-auto brightness-0 invert opacity-80"
            />

            <div className="absolute inset-x-0 bottom-[10%] flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
                    className="relative"
                >
                    <span className="inline-flex absolute items-center gap-2 scale-x-90 w-full -bottom-1 rounded-[8px] bg-neutral-200 px-3 py-1.5 text-sm text-neutral-950 shadow-lg" />
                    <div className="inline-flex relative items-center gap-2 rounded-[8px] bg-white px-3 py-2.5 text-sm text-neutral-950 shadow-lg">
                        <span className="flex size-5 items-center justify-center rounded-full bg-success-500 text-white">
                            <Check className="size-3.5" aria-hidden="true" />
                        </span>
                        {chipLabel}
                    </div>

                </motion.div>
            </div>
        </div>
    </div>
);
