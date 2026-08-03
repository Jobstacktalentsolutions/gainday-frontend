import { motion } from "motion/react";
import { StepItem } from "./StepItem";
import { fadeUp } from "@/lib/motion/variants";

interface Step {
    number: string;
    text: string;
}

interface HowItWorksColumnProps {
    heading: string;
    steps: Step[];
    color: "secondary" | "info"
}

const HowItWorksColumn = ({ heading, steps, color }: HowItWorksColumnProps) => {
    return (
        <motion.div
            variants={fadeUp}
            className="flex w-full flex-col items-start gap-5 lg:w-110.75"
        >
            <p className="text-[18px] text-neutral-50">
                {heading}
            </p>
            <div className="flex w-full flex-col items-start gap-3">
                {steps.map((step, i) => (
                    <StepItem
                        key={step.number}
                        {...step}
                        color={color}
                        showDivider={i < steps.length - 1}
                    />
                ))}
            </div>

        </motion.div>
    );
}

export default HowItWorksColumn;