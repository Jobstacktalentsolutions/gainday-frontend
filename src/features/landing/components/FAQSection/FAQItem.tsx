
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus} from "lucide-react";

interface FAQItemProps {
    id :string ;
    question : string;
    answer : string ;
    isOpen : boolean;
    onToggle : () => void;
}

const FAQItem = ({ id, question, answer, isOpen, onToggle} : FAQItemProps) => {
    
    const panelId = `faq-panel-${id}`
    const buttonId = `faq-button-${id}`

    
    return (
        <div
        className= {
            isOpen 
            ? "w-full rounded-xl bg-black/2 px-6 py-4 backdrop-blur-[20px] lg:rounded-3xl lg:px-10 lg:py-10"
            : "w-full border-b border-neutral-300 px-3 py-5 lg:px-10 lg:py-10"
        }
        >
            <button
            id = {buttonId}
            type = "button"
            onClick = { onToggle }
            aria-expanded={ isOpen }
            aria-controls = { panelId }
            className = "flex w-full items-center justify-between gap-4 text-left"
            >

            </button>

        </div>
    );
}

export default FAQItem;