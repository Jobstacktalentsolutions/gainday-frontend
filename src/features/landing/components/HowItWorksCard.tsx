import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

export type StepTone = "amber" | "blue";

// "Light source" in the lower-right corner: amber for candidates, blue for employers.
const TONES: Record<StepTone, { number: string; glow: string; hover: string }> = {
    amber: {
        number: "text-secondary-500",
        glow: "bg-[radial-gradient(circle,rgba(224,147,46,0.7)_0%,rgba(224,147,46,0)_68%)]",
        hover: "hover:border-secondary-500/40 hover:shadow-[0_30px_56px_-24px_rgba(0,0,0,0.9),inset_-28px_-28px_56px_-34px_rgba(224,147,46,0.55)]",
    },
    blue: {
        number: "text-primary-400",
        glow: "bg-[radial-gradient(circle,rgba(75,120,255,0.75)_0%,rgba(75,120,255,0)_68%)]",
        hover: "hover:border-primary-400/40 hover:shadow-[0_30px_56px_-24px_rgba(0,0,0,0.9),inset_-28px_-28px_56px_-34px_rgba(75,120,255,0.6)]",
    },
};

interface HowItWorksCardProps {
    number: string;
    text: string;
    tone: StepTone;
}

export const HowItWorksCard = ({ number, text, tone }: HowItWorksCardProps) => {
    const t = TONES[tone];

    return (
        <motion.li variants={fadeUp} className="flex-1">
            <div
                className={cn(
                    "group relative flex h-full min-h-45 flex-col justify-between gap-6 overflow-hidden rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur-xl",
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]",
                    "transition-all duration-300 ease-out hover:-translate-y-2 hover:bg-white/7",
                    "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                    t.hover,
                )}
            >
                <span
                    aria-hidden="true"
                    className={cn(
                        "pointer-events-none absolute -bottom-20 -right-20 size-50 rounded-full blur-2xl opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100",
                        t.glow,
                    )}
                />
                <p className={cn("heading-2 relative", t.number)}>{number}</p>
                <p className="relative text-base leading-6 text-neutral-50">{text}</p>
            </div>
        </motion.li>
    );
};