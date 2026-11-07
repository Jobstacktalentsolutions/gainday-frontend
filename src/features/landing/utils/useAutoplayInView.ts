import { useEffect, type RefObject } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * Plays the video while it is in view and pauses it when it leaves.
 * Does nothing if the user prefers reduced motion.
 */
export function useAutoplayInView(ref: RefObject<HTMLVideoElement | null>): void {
    const isInView = useInView(ref, { amount: 0.3 });
    const prefersReduced = useReducedMotion();

    useEffect(() => {
        const video = ref.current;
        if (!video || prefersReduced) return;
        if (isInView) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    }, [isInView, prefersReduced, ref]);
}

