import { motion } from "motion/react";

const ITEM_TEXT = "TESTED AND TRUSTED";
const REPEAT_COUNT = 8;

const MarqueeContent = () => {
    return (
        <div
            className="flex shrink-0 items-center gap-12"
            aria-hidden="true"
        >
            {Array.from({ length: REPEAT_COUNT }).map((_, i) => (
                <div key={i} className="flex shrink-0 items-center gap-12">
                    <p className="p-1 text-[14px] whitespace-nowrap text-neutral-500 lg:text-[16px]">
                        {ITEM_TEXT}
                    </p>
                    <span className="size-1.5 shrink-0 rounded-full bg-primary-500" />
                </div>
            ))}
        </div>
    );
}

export function MarqueeStrip() {
    return (
        <div
            role="img"
            aria-label="Tested and trusted"
            className="flex w-full items-center overflow-hidden border-t border-b border-neutral-300 py-[21.5px] lg:py-10"
        >
            <motion.div
                className="flex items-center gap-12"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                    duration: 25,
                    ease: "linear",
                    repeat: Infinity,
                }}
            >
                <MarqueeContent />
                <MarqueeContent />

            </motion.div>

        </div>
    );
}