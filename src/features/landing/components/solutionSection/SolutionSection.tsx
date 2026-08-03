import { motion } from "motion/react";
import GradientCard from "../GradientCard";
import SectionTag from "../SectionTag";

const SolutionSection = () => {
    return (
        <motion.section
            className="py-25 px-6 gap-30 flex flex-col"
        >
            <div className="flex flex-col gap-4">
                <div >
                    <SectionTag label="FOR CANDIDATES" />
                    <h3 className="text-[32px] tracking-[-0.32px] leading-9.5 pt-4">
                        Skip the CV black hole.
                        Show employers what you can actually do.
                    </h3>
                    <p className="text[16px] text-neutral-700 pt-4 leading-6">
                        Your CV can only describe what you've done. It can't show what you're capable of right now.
                        In a pile of hundreds of AI-polished applications,
                        yours gets lost before a human reads it. Gainday gives you a way to prove your thinking directly through a real task, scored fairly, seen by employers who are actually hiring.
                        Get matched with employers who've already seen what you can do.
                    </p>
                </div>
                <GradientCard />

            </div>
            <div className="flex flex-col gap-4 ">
                <div>
                    <SectionTag label="FOR EMPLOYERS" />
                    <h3 className="text-[32px] tracking-[-0.32px] leading-9.5 pt-4">
                        Stop guessing.
                        Start seeing.
                    </h3>
                    <p className="text[16px] text-neutral-700 pt-4 leading-6">
                        Every candidate on Gainday has completed a real task relevant to your role.
                        You get a ranked shortlist with capability scores not a pile of CVs to wade through.
                        You see their reasoning before you spend a penny.
                    </p>

                </div>

                <GradientCard />
            </div>

        </motion.section>
    );
}

export default SolutionSection;