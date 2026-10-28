import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import sparkle from "@/assets/sparkle.svg";
import { Button } from "@/components/ui/button";
import { fadeUp, heroStagger } from "@/lib/motion/variants";
import { HeroDemo } from "./HeroDemo";
import { HighlightBox } from "./HighlightBox";
import { StatsRow } from "./StatsRow";
import CTAButton from "./solutionSection/CTAButton";

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <motion.section
            variants={heroStagger}
            initial="hidden"
            animate="visible"
            className="relative isolate flex flex-col gap-20 overflow-hidden px-6 pb-10 pt-20 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-29 lg:pb-30 lg:pt-23"
        >
            <div className="flex flex-col items-center gap-4 lg:flex-1 lg:items-start lg:gap-6">
                <motion.div
                    variants={fadeUp}
                    className="flex max-w-max items-center gap-x-2.5 rounded-[6px] border border-primary-500 px-3 py-2.5 text-[10px] uppercase text-primary-500 lg:text-[14px]"
                >
                    <img src={sparkle} alt="" className="h-2.75 w-4.25" />
                    THE PERFECT AI-ASSISTED TOOL FOR HIRING
                </motion.div>

                <motion.h1 variants={fadeUp} className="heading-1 text-center text-black lg:text-left">
                    Skip the CV pile. <br className="hidden lg:block" />
                    Find the people <br className="hidden lg:block" />
                    who can <HighlightBox className="heading-2 align-baseline">do the Job</HighlightBox>
                </motion.h1>

                <motion.p
                    variants={fadeUp}
                    className="text-center text-base leading-6 text-neutral-700 lg:max-w-134.75 lg:text-left"
                >
                    AI-powered work simulations help you see how candidates perform in real, role-specific
                    tasks, so you can save time, reduce hiring costs and make better decisions with confidence.
                </motion.p>

                <motion.div variants={fadeUp} className="flex flex-col items-center gap-4 py-2 lg:flex-row lg:gap-5">
                    <CTAButton size="lg" label="I’m an employer" onClick={() => navigate("/employer/signup")} />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/job-board")}
                        className="h-13 cursor-pointer rounded-xl border-neutral-400 px-10 text-base text-neutral-700 transition-colors duration-300 hover:bg-neutral-100"
                    >
                        I’m a candidate
                    </Button>
                </motion.div>

                <motion.div variants={fadeUp} className="pt-2 lg:pt-6">
                    <StatsRow />
                </motion.div>
            </div>

            <motion.div variants={fadeUp} className="lg:w-122.75 lg:flex-none">
                <HeroDemo />
            </motion.div>
        </motion.section>
    );
};

export default HeroSection;