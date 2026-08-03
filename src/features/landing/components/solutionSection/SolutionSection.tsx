import { motion } from "motion/react";
import GradientCard from "../GradientCard";
import SectionTag from "../SectionTag";
import CTAButton from "./CTAButton";

const SolutionSection = () => {
    return (
        <motion.section
            className="py-25 px-6 gap-30 flex flex-col"
        >
            <div className="flex flex-col gap-4 lg:flex-row  lg:px-30 lg:gap-44.5">
                <div className="lg:flex-1">
                    <SectionTag label="FOR CANDIDATES" />
                    <h3 className="text-[32px] tracking-[-0.32px] leading-9.5 pt-4 lg:text-[48px] lg:tracking-[-0.48px] lg:leading-14.5">
                        Skip the CV black hole.
                        Show employers what you can actually do.
                    </h3>
                    <p className="text[16px] text-neutral-700 pt-4 leading-6">
                        Your CV can only describe what you've done. It can't show what you're capable of right now.
                        In a pile of hundreds of AI-polished applications,
                        yours gets lost before a human reads it. Gainday gives you a way to prove your thinking directly through a real task, scored fairly, seen by employers who are actually hiring.
                        Get matched with employers who've already seen what you can do.
                    </p>
                    <div className="lg:block hidden pt-4">
                        <CTAButton
                            label="Try a candidate challenge"
                            onClick={() => { }}
                        />
                    </div>
                </div>
                <div className="lg:flex-1 lg:w-122.75 lg:h-139.5">
                    <GradientCard />
                    <div className="lg:hidden pt-4">
                        <CTAButton
                            label="Try a candidate challenge"
                            onClick={() => { }}
                        />
                    </div>
                </div>


            </div>
            <div className="flex flex-col gap-4 lg:flex-row-reverse lg:px-30 lg:gap-44.5 ">
                <div className="lg:flex-1">
                    <SectionTag label="FOR EMPLOYERS" />
                    <h3 className="text-[32px] tracking-[-0.32px] leading-9.5 pt-4 lg:text-[48px] lg:tracking-[-0.48px] lg:leading-14.5">
                        Stop guessing.
                        Start seeing.
                    </h3>
                    <p className="text[16px] text-neutral-700 pt-4 leading-6">
                        Every candidate on Gainday has completed a real task relevant to your role.
                        You get a ranked shortlist with capability scores not a pile of CVs to wade through.
                        You see their reasoning before you spend a penny.
                    </p>
                    <div className="lg:block hidden pt-4">
                        <CTAButton
                            label="Post a job now"
                            onClick={() => { }}
                        />
                    </div>

                </div>

                <div className="g:flex-1 lg:w-122.75 lg:h-139.5">
                    <GradientCard />
                    <div className="lg:hidden pt-4">
                        <CTAButton
                            label="Post a job now"
                            onClick={() => { }}
                        />
                    </div>

                </div>

            </div>

        </motion.section>
    );
}

export default SolutionSection;