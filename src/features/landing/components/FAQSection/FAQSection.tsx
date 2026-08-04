
import { useState } from "react";
import { motion, stagger } from "motion/react";
import { fadeUp, staggerContainer } from "@/lib/motion/variants";
import SectionTag from "../SectionTag";

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
            <motion.div
                variants={fadeUp}
                className="flex flex-col items-center gap-4"
            >
                <SectionTag label="FAQs" />
                <p className="text=[32px] leading-9.5 tracking-[-0.32px] text-black lg:text-[48px] lg:leading-14.5 lg:tracking-[-0.48px]">
                    Good to know
                </p>

            </motion.div>

            <motion.div
                variants={fadeUp}
                className="flex w-full max-w-30 flex-col items-start">
                {faqs.map((faq) => (
                    <div></div>
                ))}

            </motion.div>

        </motion.section>
    );
}

export default FAQSection;