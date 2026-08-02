import sparkle from "@/assets/sparkle.svg";
import arrowTr from "@/assets/arrow-tr.svg";
import { Button } from "@/components/ui/button";
import { StatsRow } from "./StatsRow";
import { fadeUp, heroStagger } from "@/lib/motion/variants";
import { motion } from "motion/react";
import GradientCard from "./GradientCard";

const HeroSection = () => {
    return (
        <motion.section
            variants={heroStagger}
            initial="hidden"
            animate="visible"
            className="px-6 pt-20 pb-10 gap-20 flex flex-col lg:flex-row lg:px-29 lg:pt-23 lg:gap-44.5 lg:pb-30">
            <div className="lg:flex-1">
                <div className="flex items-center justify-center gap-4 flex-col lg:items-start ">
                    <motion.div
                        variants={fadeUp}
                        className="max-w-65  flex items-center justify-center text-[10px] lg:text-[14px] text-primary-500 gap-x-2.5 px-1.5 py-2 border rounded-[6px] border-primary-500 lg:flex-1 lg:max-w-max lg:py-2.5 lg:px-3">
                        <img
                            src={sparkle}
                            alt="sparkle icon"
                            className="w-4.25 h-2.75"
                        />
                        THE PERFECT AI-ASSISTED TOOL FOR HIRING
                    </motion.div>

                    <motion.h2
                        variants={fadeUp}
                        className=" text-[40px] text-black leading-12 tracking-tight text-center flex flex-col items-center justify-center lg:text-left lg:text-[52px] lg:leading-14 lg:tracking-[-0.56px] lg:flex-row lg:items-end lg:gap-3">
                        Stop Screening <br className="hidden lg:block" /> Applications. {" "} <br />Start Screening
                        <span className="relative inline-flex items-center justify-center border-2 border-primary-500  px-4 py-1 text-primary-500 align-baseline mt-1.5">
                            <span className="absolute -top-1 -left-1 w-1.5 h-1.5  bg-primary-500 " />
                            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-primary-500" />
                            <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-primary-500" />
                            <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-primary-500 " />
                            Ability
                        </span>
                    </motion.h2>
                    <motion.p
                        variants={fadeUp}
                        className="text-center text-base text-neutral-700 leading-6 lg:text-left lg:max-w-134.75">
                        Candidates apply by doing a piece of the actual job. Employers get a ranked list built on evidence — and every challenge a candidate completes
                        stacks into a Capability Passport they keep forever.
                    </motion.p>

                    <motion.div
                        variants={fadeUp}
                        className="flex flex-col items-center justify-center gap-4 py-4 lg:flex-row">
                        <Button className="text-base h-11 flex gap-2 items-center justify-center pl-4 pr-1 py-2 bg-primary-500 hover:bg-primary-600">

                            Try a candidate challenge
                            <span className="w-9 h-9 bg-secondary-500 flex items-center justify-center rounded-[8px]">
                                <img
                                    className=""
                                    src={arrowTr}
                                    alt="arrow pointing North East"
                                />
                            </span>
                        </Button>
                        <Button variant="outline" className="text-base rounded-[8px] px-10 py-2 leading-6 h-11 hover:bg-neutral-100">
                            See the employer view
                        </Button>

                    </motion.div>
                    <motion.div
                        variants={fadeUp}
                        className="px-2">
                        <StatsRow />
                    </motion.div>
                </div>
            </div>
            <motion.div
                variants={fadeUp}
                className="left-box lg:flex-1">
                <GradientCard />
            </motion.div>

        </motion.section>
    );
}

export default HeroSection;