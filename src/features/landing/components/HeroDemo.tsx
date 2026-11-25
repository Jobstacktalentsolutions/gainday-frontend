import { useState } from "react";
import { ChevronLeft, Lock, Plus } from "@/components/ui/icons";
import { GlowOrb } from "./GlowOrb";
import GradientCard from "./GradientCard";
import { GradientFrame } from "./GradientFrame";
import { DemoPlayer } from "./DemoPlayer";
import { DEMO_VIDEO, HERO_POSTER } from "../utils/demoVideo";

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
                gainday.org/employer/jobs
            </span>
            <Lock style={{ width: u(3.6), height: u(3.6) }} />
        </div>

        <Plus className="absolute" style={{ right: u(6), top: u(7), width: u(5.4), height: u(5.4) }} />
    </div>
);

// Plays the whole recording, and falls back to the gradient card if the video can't load, so the
// hero never looks broken. (The old floating animation on the frame was removed: the frame now has
// clickable controls and shouldn't drift under the cursor.)
export const HeroDemo = () => {
    const [failed, setFailed] = useState(false);

    return (
        <div className="relative isolate">
            <GlowOrb tone="amber" className="-bottom-16 -right-16 size-96" />
            <GlowOrb tone="blue" className="-left-12 -top-12 size-80" />

            {failed ? (
                <GradientCard />
            ) : (
                <GradientFrame designWidth={FRAME_WIDTH} angle={156.49} padX={19} padY={27.93}>
                    <div className="overflow-hidden" style={{ borderRadius: u(4.66), filter: SHADOW }}>
                        <BrowserToolbar />
                        <DemoPlayer
                            sources={DEMO_VIDEO.sources}
                            poster={HERO_POSTER}
                            width={DEMO_VIDEO.width}
                            height={DEMO_VIDEO.height}
                            label="Product demo: an employer posts a job, reviews candidate submissions and shortlists top performers"
                            preload="metadata"
                            onUnavailable={() => setFailed(true)}
                        />
                    </div>
                </GradientFrame>
            )}
        </div>
    );
};
