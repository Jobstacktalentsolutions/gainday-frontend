import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

// A soft diagonal band of light that sweeps across a dark section once, the first time it
// scrolls into view. Parent must be `relative overflow-hidden`.
export const SectionSheen = () => {
    const reduceMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.2 });

    if (reduceMotion) return null;

    return (
        <div ref={containerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
            <motion.div
                className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/15 to-transparent"
                initial={{ x: "-100%" }}
                animate={isInView ? { x: "500%" } : { x: "-100%" }}
                transition={{ duration: 2.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
            />
        </div>
    );
};
