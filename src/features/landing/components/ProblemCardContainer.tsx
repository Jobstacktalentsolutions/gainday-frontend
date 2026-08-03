
import fileNotFoundIcon from "@/assets/file-not-found.svg";
import stackOverflowIcon from "@/assets/stackoverflow.svg";
import secureIcon from "@/assets/secure-window.svg";
import { motion } from "motion/react";
import { fadeUp } from "@/lib/motion/variants";

interface cardDetails {
    title: string;
    description: string;
    icon: string;
}

const tempCardDetails: cardDetails[] = [
    {
        title: "Signals are weakening",
        description: "Tailored CVs and cover letters can be produced in seconds. Application quality no longer tracks capability.",
        icon: fileNotFoundIcon,
    },
    {
        title: "Volume is rising",
        description: "Recruiters face hundreds of near-identical, highly polished profiles per vacancy and screen on proxies.",
        icon: stackOverflowIcon,
    },
    {
        title: "Evidence evaporates",
        description: "Candidates prove themselves in assessments and interviews, then start from zero on the next application.",
        icon: secureIcon,
    }
]

const ProblemCardContainer = () => {

    return (
        <div 
        
        className="flex flex-col gap-6 lg:flex-row lg:px-24">
            {tempCardDetails.map((card) => (
                <motion.div 
                variants={fadeUp}
                className="rounded-[12px] border border-primary-200 py-9 px-6 flex flex-col">
                    <p className=" flex self-start items-center justify-center rounded-[6px] border border-neutral-200 mb-4 p-3">
                        <img
                            src={card.icon}
                            alt={`${card.title} icon`}
                            className="w-6 h-6"
                        />
                    </p>
                    <h3 className="text-[24px] mb-2">
                        {card.title}
                    </h3>
                    <p className="text-base leading-6 text-neutral-700">
                        {card.description}
                    </p>

                </motion.div>
            ))}
        </div>
    );
}

export default ProblemCardContainer;