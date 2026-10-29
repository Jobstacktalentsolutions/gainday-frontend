import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { fadeUp, staggerContainer } from "@/lib/motion/variants";
import SectionTag from "../SectionTag";
import CTAButton from "./CTAButton";
import { LandingPhoto } from "./LandingPhoto";

const SolutionSection = () => {
    const navigate = useNavigate();

    return (
        <motion.section
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col gap-16 px-6 py-16 lg:gap-30 lg:py-25"
        >
            <div id="for-candidates" className="scroll-mt-28 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-15 lg:px-55">
                <motion.div variants={fadeUp} className="flex flex-col items-start gap-4 lg:flex-1 lg:max-w-136">
                    <SectionTag label="FOR CANDIDATES" />
                    <h2 className="heading-2 text-black">Show what you can do. Not just what you&rsquo;ve written.</h2>
                    <p className="text-base leading-6 text-neutral-700">
                        No more tailoring CVs and cover letters for every application. Complete practical work
                        simulations, show the employer what you can do, and build a record of your skills that
                        goes beyond one job.
                    </p>
                    <div className="hidden pt-2 lg:block">
                        <CTAButton size="lg" label="Apply for a Role" onClick={() => navigate("/job-board")} />
                    </div>
                </motion.div>

                <motion.div variants={fadeUp} className="flex flex-col gap-6 lg:flex-none">
                    <LandingPhoto
                        chipLabel="Simulation completed"
                        src="/images/landing/candidate.jpg"
                        alt="A candidate smiling at their laptop after finishing a work simulation"
                    />
                    <div className="lg:hidden">
                        <CTAButton size="lg" label="Apply for a Role" onClick={() => navigate("/job-board")} />
                    </div>
                </motion.div>
            </div>

            <div id="for-employers" className="scroll-mt-28 flex flex-col gap-10 lg:flex-row-reverse lg:items-center lg:justify-between lg:gap-15 lg:px-55">
                <motion.div variants={fadeUp} className="flex flex-col items-start gap-4 lg:flex-1 lg:max-w-136">
                    <SectionTag label="FOR EMPLOYERS" />
                    <h2 className="heading-2 text-black">See the talent, not the paperwork.</h2>
                    <p className="text-base leading-6 text-neutral-700">
                        Skip the CV pile and AI-generated applications. Get real evidence of how candidates
                        think, solve problems and perform in the real world &ndash; before you interview.
                    </p>
                    <div className="hidden pt-2 lg:block">
                        <CTAButton size="lg" label="Post a job now" onClick={() => navigate("/employer/signup")} />
                    </div>
                </motion.div>

                <motion.div variants={fadeUp} className="flex flex-col gap-6 lg:flex-none">
                    <LandingPhoto
                        chipLabel="Submissions received"
                        src="/images/landing/employer.jpg"
                        alt="An employer reviewing candidate results on a tablet"
                    />
                    <div className="lg:hidden">
                        <CTAButton size="lg" label="Post a job now" onClick={() => navigate("/employer/signup")} />
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
};

export default SolutionSection;
