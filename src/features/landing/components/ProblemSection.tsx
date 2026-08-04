import ProblemCardContainer from "./ProblemCardContainer";
import SectionTag from "./SectionTag";
import { motion } from "motion/react";
import { staggerContainer } from "@/lib/motion/variants";
import { fadeUp } from "@/lib/motion/variants";

const ProblemSection = () => {
    return (
        <motion.section
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="px-6 flex flex-col gap-15">
            <motion.div
                variants={fadeUp}
                className="flex flex-col items-center justify-center">
                <SectionTag label="THE PROBLEM" />
                <h2 className="tracking-[-0.32px] text-[32px] leading-9.5 text-center mt-3  lg:my-4 lg:text-[48px]">
                    Hiring Used to Mean Guessing
                </h2>
                <p className="text-neutral-700 text-[16px] text-center mt-1">
                    Hiring still begins with assumptions,
                    and AI has made those assumptions cheaper to fake.
                </p>
            </motion.div>

            <div className="pb-25">
                <ProblemCardContainer />
            </div>

        </motion.section>
    );
}

export default ProblemSection;