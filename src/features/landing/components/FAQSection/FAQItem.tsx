
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";

interface FAQItemProps {
    id: string;
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
}

const FAQItem = ({ id, question, answer, isOpen, onToggle }: FAQItemProps) => {

    const panelId = `faq-panel-${id}`
    const buttonId = `faq-button-${id}`


    return (
        <div
            className={
                isOpen
                    ? "faq-glow-border w-full rounded-xl bg-white/40 px-6 py-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] backdrop-blur-[20px] lg:rounded-3xl lg:px-10 lg:py-10"
                    : "w-full border-b border-neutral-300 px-3 py-5 lg:px-10 lg:py-10"
            }
        >
            <button
                id={buttonId}
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 text-left"
            >
                <span className="text-lg text-primary-950 lg:text-2xl">{question}</span>
                <span className="flex size-6 shrink-0 items-center justify-center rounded border border-neutral-300 lg:size-12"></span>
                {isOpen ? (
                    <Minus className="size-4 text-neutral-500 lg:size-6" />
                ) : (
                    <Plus className="size-4 text-neutral-500 lg:size-6" />
                )

                }
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="pt-4 text-base leading-6 text-neutral-700 lg:pt-4">
                            {answer}
                        </p>
                    </motion.div>
                )}

            </AnimatePresence>

        </div>
    );
}

export default FAQItem;