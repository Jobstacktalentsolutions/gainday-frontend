
import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

// Counts from `from` (default 0) to the number inside `rawValue`, e.g. "318+", "£0", "95%".
// Pass a `from` larger than the target to count down.
const useCountUp = (rawValue: string, duration = 1.5, from = 0) => {
    const ref = useRef<HTMLParagraphElement>(null);
    const isInView = useInView(ref, { once: true, amount: 0.6 });
    const reduceMotion = useReducedMotion();
    const [display, setDisplay] = useState(() => rawValue.replace(/\d+/, String(from)));

    const match = rawValue.match(/(\D*)(\d+)(\D*)/);

    useEffect(() => {
        if (!match || reduceMotion) {
            setDisplay(rawValue);
            return;
        }
        if (!isInView) return;

        const [, prefix, numStr, suffix] = match;
        const controls = animate(from, parseInt(numStr, 10), {
            duration,
            ease: "easeOut",
            onUpdate: (value) => setDisplay(`${prefix}${Math.round(value)}${suffix}`),
        });

        return () => controls.stop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isInView, reduceMotion]);

    return { ref, display };
};

export default useCountUp;