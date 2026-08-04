
import { useState } from "react";
import { motion, stagger } from "motion/react";
import { fadeUp, staggerContainer } from "@/lib/motion/variants";

const faqs = [
    {
        id: "cv",
        question: "Do I need a CV?",
        answer:
            "Yes. Your CV provides context. Your challenge demonstrates capability and is the first thing employers see.",
    },
    {
        id: "challenges",
        question: "Who creates the challenges?",
        answer:
            "Gainday's AI generates each challenge directly from the employer's job description and stated business problem, and the employer reviews it before it goes live.",
    },
    {
        id: "scoring",
        question: "How are candidates scored?",
        answer:
            "Every submission is scored against five weighted categories — problem solving, execution, communication, commercial awareness, and prioritization — so results stay comparable across roles.",
    },
]

const FAQSection = () => {
    return (
        <motion.section
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.20 }}
            className="flex w-full flex-col items-center gap-15 px-6 py-10 lg:gap-20 lg:px-30 lg:py-13.75"
        >

        </motion.section>
    );
}

export default FAQSection;