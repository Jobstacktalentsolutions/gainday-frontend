import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { GlowOrb } from "./GlowOrb";
import GradientCard from "./GradientCard";

const POSTER = "/media/hero-demo-poster.webp";

// The employer demo loop. Files live in /public/media (see the encoding notes). Plays only
// while visible, shows just the poster for reduced-motion users, and falls back to the old
// gradient card if the video can't load, so the hero never looks broken.
export const HeroDemo = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const inView = useInView(videoRef, { amount: 0.3 });
    const reduceMotion = useReducedMotion();
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || reduceMotion) return;
        if (inView) void video.play().catch(() => undefined);
        else video.pause();
    }, [inView, reduceMotion]);

    return (
        <div className="relative isolate">
            <GlowOrb tone="amber" className="-bottom-16 -right-16 size-96" />
            <GlowOrb tone="blue" className="-left-12 -top-12 size-80" />

            {failed ? (
                <GradientCard />
            ) : (
                <div className="relative aspect-5/6 w-full animate-float-soft overflow-hidden rounded-2xl border border-white/60 bg-neutral-100 shadow-[0_32px_64px_-24px_rgba(27,23,255,0.45)] motion-reduce:animate-none">
                    <video
                        ref={videoRef}
                        className="size-full object-cover"
                        poster={POSTER}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-label="Short demo: an employer opens a job, filters the submissions and picks a candidate"
                        onError={() => setFailed(true)}
                    >
                        <source src="/media/hero-demo.webm" type="video/webm" />
                        <source src="/media/hero-demo.mp4" type="video/mp4" />
                    </video>
                </div>
            )}
        </div>
    );
};