import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import JobCard from "./JobCard";
import { fadeUp, staggerContainer } from "@/lib/motion/variants";


const jobs = [
    {
        company: "NORTHBANK UTILITIES",
        title: "Customer Operations Lead",
        description:
            "Own the escalation queue for a 200k-customer billing platform and keep service levels honest during peak load.",
        duration: "18 MINUTES",
    },
    {
        company: "HALDEN HEALTH GROUP",
        title: "Business Analyst",
        description:
            "Turn messy operational data into decisions clinicians and finance leads will actually act on.",
        duration: "20 MINUTES",
    },
    {
        company: "FERRYMEAD LOGISTICS",
        title: "Operations Coordinator",
        description: "Keep a 40-vehicle regional fleet moving when the plan meets reality.",
        duration: "15 MINUTES",
    },
]

const LiveRolesSection = () => {
    return (
        <motion.section
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex w-full flex-col items-start gap-15 bg-white px-6 py-10  lg:gap-20 lg:px-30 lg:py-13.75"
        >
            <div className="flex w-full items-start justify-between">
                <motion.div
                    variants={fadeUp}
                    className="flex flex-col items-start gap-6 lg:gap-4"
                >
                    <div className="flex items-center gap-2.5 rounded-md border border-primary-500 px-2.5 py-1.5 lg:px-3 lg:py-2.5">
                        <span className="size-1.5 rounded-full bg-primary-500" />
                        <p className="text-[10px] text-primary-500 lg:text-sm">LIVE ROLES</p>
                    </div>
                    <p className=" text-[32px] leading-9.5 tracking-[-0.32px] text-black lg:text-[48px] lg:leading-14.5 lg:tracking-[-0.48px]">
                        Apply by Doing The Work
                    </p>

                </motion.div>

                <motion.a
                    variants={fadeUp}
                    href="#all-roles"
                    className="flex h-7.5 items-center justify-center curosr-pointer whitespace-nowrap gap-2 text-base text-primary-500 underline underline-offset-2 lg:h-13"
                >

                    All Roles
                    <ArrowRight className="text-primary-500" />
                </motion.a>
            </div>

            <div className="flex w-full flex-col items-start gap-6 lg:flex-row">
                {jobs.map((job) => (
                    <JobCard key={job.title} {...job} />
                ))}
            </div>

        </motion.section>
    );
}

export default LiveRolesSection;