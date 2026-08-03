import { motion } from "motion/react";
import { Clock } from "lucide-react";
import { fadeUp } from "@/lib/motion/variants";

interface JobCardProps {
    company : string;
    title: string;
    description : string;
    duration : string;
}

const JobCard = ({ company, title, description, duration} : JobCardProps) => { 
    return (
        <motion.div
        variants={ fadeUp }
        className="flex w-full flex-col items-start gap-6 rounded-xl border border-primary-200 px-6 py-9 lg:flex-1"
        >
            <p className = "text-sm text-primary-500">{company}</p>

            <div className = "flex flex-col items-start gap-2">
                <p className = "text-2xl leading-8 text-primary-950">{title}</p>
                <p className = "text-base leading-6 text-neutral-700">{description}</p>
            </div>

            <div className ="flex items-center gap-2.5">
                <Clock className="size-4 text-secondary-500" />
                <p className = "text-sm text-seconday-500">{duration}</p>
            </div>

        </motion.div>
    )
}

export default JobCard;