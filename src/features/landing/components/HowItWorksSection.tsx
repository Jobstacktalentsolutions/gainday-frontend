import { motion } from "motion/react";
import HowItWorksColumn from "./HowItWorksColumn";
import { HighlightBox } from "./HighlightBox";
import { fadeUp, staggerContainer } from "@/lib/motion/variants";


const candidateSteps = [
    { number: "01", text: "Clicks apply — no CV upload as step one." },
    { number: "02", text: "Completes a challenge generated from the job description." },
    { number: "03", text: "Task is scored against role-relevant competencies." },
    { number: "04", text: "Results stack into their Capability Passport." },
    { number: "05", text: "The passport travels to the next application." },
]

const employerSteps = [
    { number: "01", text: "Posts a role and reviews the generated challenge." },
    { number: "02", text: "Receives a leaderboard ranked on objective task performance." },
    { number: "03", text: "Reads actual task outputs, not adjectives." },
    { number: "04", text: "Reviews anonymised Capability Passports for consistency." },
    { number: "05", text: "Unlocks only the candidates worth contacting." },
]

const HowItWorksSection = () => {
    return (
        <motion.section
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.20 }}
            className="flex w-full flex-col items-center gap-15 bg-neutral-950 px-6 py-20 lg:gap-20 lg:px-30 lg:py-30"
        >
            <motion.div
                variants={fadeUp}
                className="flex flex-col items-center gap-3"
            >
                <div className="flex items-center gap-2.5 rounded-md border border-neutral-100 px-2.5 py-1.5">
                    <span className="size-1.5 rounded-full bg-secondary-500" />
                    <p className="text-[10px] text-neutral-100">HOW IT WORKS</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-center text-[32px] leading-9.5 tracking-[-0.32px] text-neutral-50">
                        The CV process is broken.
                    </p>
                    <HighlightBox
                        color="secondary"
                        className="text-[32px] leading-9.5 tracking-[-0.32px]"
                    >
                        Hero&rsquo;s what replaces it
                    </HighlightBox>

                </div>
                <p className="max-w-77.25 text-center text-base text-neutral-300    ">
                    Gainday helps candidates demonstrate capability and helps employers
                    identify it faster.
                </p>

            </motion.div>

            <div className="flex w-full flex-col items-start gap-15">
                <HowItWorksColumn heading="Candidate" steps={candidateSteps} color="secondary" />
                <HowItWorksColumn heading="Employer" steps={employerSteps} color="info" />
            </div>
        </motion.section>
    )
}

export default HowItWorksSection;