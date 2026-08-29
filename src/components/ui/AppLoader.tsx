import "../styles/AppLoader.css";
import { useDelayedVisibility } from "@/hooks/useDelayedVisibility";
import { useState, useEffect } from "react";
import GaindayMark from "./GaindayMark";

const WORD = "Gainday";
const LETTER_INTERVAL_MS = 90;
const TYPING_START_DELAY_MS = 900;

const AppLoader = () => {
    const isVisible = useDelayedVisibility(200);
    const [letterCount, setLetterCount] = useState(0);
    const [showCursor, setShowCursor] = useState(false);

    useEffect(() => {
        const startTimer = setTimeout(() => {
            setShowCursor(true);
        }, TYPING_START_DELAY_MS);

        return () => clearTimeout(startTimer);
    }, []);

    useEffect(() => {
        if (!showCursor || letterCount >= WORD.length) return;

        const timer = setTimeout(() => {
            setLetterCount((c) => c + 1);
        }, LETTER_INTERVAL_MS);

        return () => clearTimeout(timer);
    }, [showCursor, letterCount]);

    if (!isVisible) return null;

    const typingDone = letterCount >= WORD.length;

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label="Loading Gainday"
            className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-50"
        >
            <div className="app-loader-logo flex items-center gap-3">
                <GaindayMark className="app-loader-path" width={56} height={64} />

                <p className="text-5xl font-bold text-neutral-900 leading-none" aria-hidden="true">
                    {WORD.slice(0, letterCount).split("").map((char, i) => (
                        <span
                            key={i}
                            className="app-loader-letter"
                            style={{ animationDelay: "0ms" }}
                        >
                            {char}
                        </span>
                    ))}
                    {showCursor && !typingDone && (
                        <span className="app-loader-cursor" />
                    )}
                </p>
            </div>

            <span className="sr-only">Loading Gainday</span>
        </div>
    );
};

export default AppLoader;