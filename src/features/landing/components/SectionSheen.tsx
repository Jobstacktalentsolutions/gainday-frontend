import { motion, useReducedMotion } from "motion/react";

// A soft diagonal band of light that sweeps across a dark section once, the first time it
// scrolls into view. Parent must be `relative overflow-hidden`.
export const SectionSheen = () => {
    const reduceMotion = useReducedMotion();
    if (reduceMotion) return null;

    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
                className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/8 to-transparent"
                initial={{ x: "-100%" }}
                whileInView={{ x: "450%" }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 2.2, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
            />
        </div>
    );
};