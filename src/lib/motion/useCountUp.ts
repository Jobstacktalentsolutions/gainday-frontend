import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "motion/react";

const useCountUp = (rawValue : string, duration = 1.5) => {

    const ref = useRef<HTMLParagraphElement>(null);
    const isInView = useInView(ref, {once: true, amount: 0.6});
    const [display, setDisplay] = useState(() => rawValue.replace(/\d+/, "0"));

    const match = rawValue.match(/(\D*)(\d+)(\D*)/);

    useEffect(() => {
        if (!isInView || match) {
            if (!match) setDisplay(rawValue);
            return;
        }
        const [, prefix, numStr, suffix] = match
        const target = parseInt(numStr, 10);

        const controls = animate(0, target, {
            duration,
            ease : "easeOut",
            onUpdate : (value) => {
                setDisplay(`${prefix}${Math.round(value)}${suffix}`)
            },
        })

        return () => controls.stop()
    }, [isInView])

    return { ref, display}
}