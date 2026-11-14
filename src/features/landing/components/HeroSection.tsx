import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Aurora from "@/components/ui/Aurora";
import { fadeUp, heroStagger } from "@/lib/motion/variants";
import { HeroDemo } from "./HeroDemo";
import { HighlightBox } from "./HighlightBox";
import CTAButton from "./solutionSection/CTAButton";

const HERO_COLORS = ["#1B17FF", "#4B78FF", "#A5D8FF", "#F4A74A", "#E0932E"];

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <motion.section
            variants={heroStagger}
            initial="hidden"
            animate="visible"
            className="relative isolate flex flex-col gap-20 px-6 pb-10 pt-20 lg:flex-row lg:items-center lg:justify-between lg:gap-0 lg:px-30 lg:pb-30 lg:pt-23"
        >
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-24.25 bottom-0 -z-10">
                <Aurora
                    colorStops={HERO_COLORS}
                    lightMode
                    opacity={0.48}
                    amplitude={1.2}
                    blend={0.7}
                    speed={5}
                    height={0.6}
                    glow={0.65}
                    layers={2}
                    mouseInteraction
                />
            </div>
            <div className="flex flex-col items-center gap-4 lg:w-134.75 lg:flex-none lg:items-start lg:gap-6">

                <motion.h1 variants={fadeUp} className="heading-1 text-center text-black lg:text-left">
                    Skip the CV pile. <br className="hidden lg:block" />
                    Find the people <br className="hidden lg:block" />
                    who can <HighlightBox className="heading-2 align-baseline">do the Job</HighlightBox>
                </motion.h1>

                <motion.p variants={fadeUp} className="text-center text-base leading-6 text-neutral-700 lg:text-left">
                    Paste your job description and Gainday turns it into a work simulation built from the day-to-day
                    tasks of the role. Candidates apply by completing it, and you get a ranked shortlist based on
                    how they perform.
                </motion.p>

                <motion.div variants={fadeUp} className="flex flex-col items-center gap-4 py-2 lg:flex-row lg:gap-5">
                    <CTAButton size="lg" label="I'm an employer" onClick={() => navigate("/employer/signup")} />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/job-board")}
                        className="h-13 cursor-pointer rounded-xl border-neutral-400 px-10 text-base text-neutral-700 transition-colors duration-300 hover:bg-neutral-100"
                    >
                        I'm a candidate
                    </Button>
                </motion.div>

                {/* <motion.div variants={fadeUp} className="pt-2 lg:pt-6">
                    <StatsRow />
                </motion.div> */}
            </div>

            <motion.div variants={fadeUp} className="w-full lg:w-140 lg:flex-none">
                <HeroDemo />
            </motion.div>
        </motion.section>
    );
};

export default HeroSection;