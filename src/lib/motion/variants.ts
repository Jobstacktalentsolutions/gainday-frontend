import type { Variants } from "motion/react";

export const fadeUp: Variants = {
    hidden : { opacity : 0, y : 24},
    visible : {
        opacity : 1, 
        y : 0,
        transition : { duration: 0.5, ease: "easeOut"},
    },
}


export const staggerContainer : Variants = {
    hidden : {},
    visible: {
        transition : { staggerChildren : 0.12}
    }
}


export const heroStagger: Variants = staggerContainer