import fileNotFoundIcon from "@/assets/file-not-found.svg";
import stackOverflowIcon from "@/assets/stackoverflow.svg";
import secureIcon from "@/assets/secure-window.svg";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";
import { GlowOrb, type GlowTone } from "./GlowOrb";

interface ProblemCard {
    title: string;
    description: string;
    icon: string;
    /** Translucent tint, so the glass picks up its own hue. */
    tint: string;
    orb: GlowTone;
    orbClass: string;
}

const cards: ProblemCard[] = [
    {
        title: "Signals are weakening",
        description: "Tailored CVs and cover letters can be produced in seconds. Application quality no longer tracks capability.",
        icon: fileNotFoundIcon,
        tint: "bg-primary-50/50",
        orb: "blue",
        orbClass: "-left-10 -top-10 size-56",
    },
    {
        title: "Volume is rising",
        description: "Recruiters face hundreds of near-identical, highly polished profiles per vacancy and screen on proxies.",
        icon: stackOverflowIcon,
        tint: "bg-error-50/55",
        orb: "rose",
        orbClass: "-bottom-12 left-1/3 size-56",
    },
    {
        title: "Evidence evaporates",
        description: "Candidates prove themselves in assessments and interviews, then start from zero on the next application.",
        icon: secureIcon,
        tint: "bg-secondary-100/50",
        orb: "amber",
        orbClass: "-right-10 -top-8 size-56",
    },
];

const ProblemCardContainer = () => (
    <div className="flex flex-col gap-6 lg:flex-row lg:px-24">
        {cards.map((card) => (
            <motion.div key={card.title} variants={fadeUp} className="relative isolate flex-1">
                <GlowOrb tone={card.orb} className={card.orbClass} />

                <div
                    className={cn(
                        "relative flex h-full flex-col overflow-hidden rounded-xl border border-white/70 px-6 py-9 backdrop-blur-xl",
                        "shadow-[0_8px_32px_-8px_rgba(1,0,53,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]",
                        "transition duration-300 ease-out hover:-translate-y-1",
                        "hover:shadow-[0_22px_44px_-14px_rgba(1,0,53,0.22),inset_0_1px_0_rgba(255,255,255,0.9)]",
                        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                        card.tint,
                    )}
                >
                    {/* Soft diagonal highlight, the "glass" sheen */}
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/50 via-transparent to-transparent"
                    />

                    <p className="relative mb-4 flex self-start items-center justify-center rounded-md border border-neutral-200/80 bg-white/80 p-3 shadow-xs">
                        <img src={card.icon} alt="" className="size-6" />
                    </p>
                    <h3 className="relative mb-2 text-[24px] leading-8 text-primary-950">{card.title}</h3>
                    <p className="relative text-base leading-6 text-neutral-700">{card.description}</p>
                </div>
            </motion.div>
        ))}
    </div>
);

export default ProblemCardContainer;