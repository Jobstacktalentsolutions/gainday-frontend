import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { fadeUp, staggerContainer } from "@/lib/motion/variants";
import { HighlightBox } from "./HighlightBox";
import { HowItWorksCard, type StepTone } from "./HowItWorksCard";
import { SectionSheen } from "./SectionSheen";

const candidateSteps = [
    "Clicks apply, no CV upload as step one.",
    "Complete a challenge generated from the job description.",
    "Task is scored against role-relevant competencies. Results stack into your Capability Passport.",
];

const employerSteps = [
    "Posts a role and reviews the generated challenge.",
    "Receives a leaderboard ranked on objective task performance.",
    "Reviews anonymised Capability Passports for consistency. Unlocks only the candidates worth contacting.",
];

const StepRow = ({ heading, steps, tone }: { heading: string; steps: string[]; tone: StepTone }) => (
    <motion.div variants={fadeUp} className="flex w-full flex-col gap-5">
        <h3 className="text-[18px] leading-[1.2] text-neutral-50">{heading}</h3>
        <ol className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-0">
            {steps.map((text, i) => (
                <div key={text} className="contents">
                    <HowItWorksCard number={String(i + 1).padStart(2, "0")} text={text} tone={tone} />
                    {i < steps.length - 1 && (
                        <li aria-hidden="true" className="hidden items-center px-3 text-neutral-400 lg:flex">
                            <ArrowRight className="size-6" />
                        </li>
                    )}
                </div>
            ))}
        </ol>
    </motion.div>
);

const HowItWorksSection = () => (
    <motion.section
        id="assessment-process"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative isolate flex w-full scroll-mt-28 flex-col items-center gap-15 overflow-hidden bg-neutral-950 px-6 py-20 lg:gap-20 lg:px-30 lg:py-30"
    >
        <SectionSheen />

        <motion.div variants={fadeUp} className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-md border border-neutral-100 px-2.5 py-1.5 lg:px-3 lg:py-2.5">
                <span className="size-1.5 rounded-full bg-secondary-500" />
                <p className="text-[10px] text-neutral-100 lg:text-sm">HOW IT WORKS</p>
            </div>
            <div className="flex flex-col items-center gap-2">
                <p className="heading-2 text-center text-neutral-50">From job description</p>
                <HighlightBox color="secondary" className="heading-2 whitespace-normal text-center">
                    to demonstrated capability
                </HighlightBox>
            </div>
            <p className="max-w-125.5 text-center text-base text-neutral-300">
                Gainday helps candidates demonstrate capability and helps employers identify it faster.
            </p>
        </motion.div>

        <div className="flex w-full max-w-300 flex-col gap-10 lg:gap-12">
            <StepRow heading="Candidate" steps={candidateSteps} tone="amber" />
            <StepRow heading="Employer" steps={employerSteps} tone="blue" />
        </div>
    </motion.section>
);

export default HowItWorksSection;