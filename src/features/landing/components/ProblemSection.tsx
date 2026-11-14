import { motion } from "motion/react";
import { fadeUp, staggerContainer } from "@/lib/motion/variants";
import { GlowOrb } from "./GlowOrb";
import ProblemCardContainer from "./ProblemCardContainer";


const ProblemSection = () => (
    <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="relative isolate flex flex-col gap-15 overflow-hidden px-6 pb-25 lg:gap-20 lg:px-15"
    >
        {/* Ambient artifacts behind the whole section */}
        <GlowOrb tone="blue" className="-left-32 top-1/3 size-112 opacity-60" />
        <GlowOrb tone="amber" className="-right-32 top-1/2 size-112 opacity-60" />

        <motion.div variants={fadeUp} className="flex flex-col items-center justify-center gap-4 text-center">
            <h2 className="heading-2 text-black">Hiring Used to Mean Guessing</h2>
            <p className="max-w-155 text-base leading-6 text-neutral-700">
                Hundreds of CVs and no way to tell who can do the job?
            </p>
        </motion.div>

        <ProblemCardContainer />
    </motion.section>
);

export default ProblemSection;