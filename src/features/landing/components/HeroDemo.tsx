import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Lock, Plus } from "lucide-react";
import { useInView, useReducedMotion } from "motion/react";
import { GlowOrb } from "./GlowOrb";
import GradientCard from "./GradientCard";
import { GradientFrame } from "./GradientFrame";

// Must match the encoded video: width 1200, height from ffprobe (675 for a 1920x1080 source).
const VIDEO_WIDTH = 1200;
const VIDEO_HEIGHT = 675;
const POSTER = "/media/hero-demo-poster.webp";

const FRAME_WIDTH = 560;
const u = (px: number) => `${(px / FRAME_WIDTH) * 100}cqw`;

const SHADOW = [
    `drop-shadow(0 ${u(4.66)} ${u(2.33)} rgba(0,0,0,0.25))`,
    `drop-shadow(0 0 ${u(5.76)} rgba(0,0,0,0.14))`,
    `drop-shadow(0 ${u(7.68)} ${u(9.59)} rgba(0,0,0,0.2))`,
].join(" ");

// Decorative browser toolbar (Figma "Light Mockup / Toolbar").
const BrowserToolbar = () => (
    <div
        aria-hidden="true"
        className="relative bg-white text-[#4a4a4a]"
        style={{ height: u(19.95), borderTopLeftRadius: u(3.84), borderTopRightRadius: u(3.84) }}
    >
        <div className="absolute flex items-center" style={{ left: u(7.67), top: u(7.67), gap: u(3.07) }}>
            {["#FF5F57", "#FEBC2E", "#28C840"].map((color) => (
                <span key={color} className="rounded-full" style={{ width: u(4.6), height: u(4.6), background: color }} />
            ))}
        </div>

        <span
            className="absolute rounded-[1px] border border-[#8a8a8a]"
            style={{ left: u(37.6), top: u(7.2), width: u(6.5), height: u(5.3) }}
        />
        <ChevronLeft className="absolute" style={{ left: u(58), top: u(7.2), width: u(5.4), height: u(5.4) }} />

        <div
            className="absolute flex items-center bg-[#ececec]"
            style={{ left: u(72.14), top: u(4.6), width: u(188), height: u(10.74), borderRadius: u(3), paddingInline: u(2), gap: u(1.2) }}
        >
            <img src="/gainday_icon.svg" alt="" style={{ width: u(6.14), height: u(6.14) }} />
            <span className="whitespace-nowrap leading-none" style={{ fontSize: u(4.99) }}>
                gainday.com/employer/jobs
            </span>
            <Lock style={{ width: u(3.6), height: u(3.6) }} />
        </div>

        <Plus className="absolute" style={{ right: u(6), top: u(7), width: u(5.4), height: u(5.4) }} />
    </div>
);

// Plays only while visible, shows just the poster for reduced-motion users, and falls back to
// the gradient card if the video can't load, so the hero never looks broken.
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
                <GradientFrame
                    designWidth={FRAME_WIDTH}
                    angle={156.49}
                    padX={19}
                    padY={27.93}
                    className="animate-float-soft motion-reduce:animate-none"
                >
                    <div className="overflow-hidden" style={{ borderRadius: u(4.66), filter: SHADOW }}>
                        <BrowserToolbar />
                        <video
                            ref={videoRef}
                            className="block w-full object-cover"
                            style={{ aspectRatio: `${VIDEO_WIDTH} / ${VIDEO_HEIGHT}` }}
                            width={VIDEO_WIDTH}
                            height={VIDEO_HEIGHT}
                            poster={POSTER}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            aria-label="Short demo: an employer opens a job, filters the submissions and picks a candidate"
                        >
                            <source src="/media/hero-demo.webm" type="video/webm" />
                            {/* Errors fire on <source>, not <video>. The last source failing means nothing can play. */}
                            <source src="/media/hero-demo.mp4" type="video/mp4" onError={() => setFailed(true)} />
                        </video>
                    </div>
                </GradientFrame>
            )}
        </div>
    );
};