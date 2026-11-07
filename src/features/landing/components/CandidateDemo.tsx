import { useRef, useState } from "react";
import { BrowserMockup } from "./BrowserMockup";
import { useAutoplayInView } from "../utils/useAutoplayInView";

// Must match the encoded candidate-demo output: 1000×538 (crop=1920:1032:0:48, scale=1000:-2).
const VIDEO_WIDTH = 1000;
const VIDEO_HEIGHT = 538;

/**
 * Candidate job-board / simulation demo video inside a browser mockup.
 * Plays only while in view, respects reduced-motion, and falls back to
 * the cta.jpg hero image if the video cannot load.
 */
export const CandidateDemo = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [failed, setFailed] = useState(false);

    useAutoplayInView(videoRef);

    if (failed) {
        return (
            <div className="h-55 overflow-hidden rounded-xl ring-1 ring-white/20 lg:h-86.5">
                <img
                    src="/images/landing/cta.jpg"
                    alt="A smiling professional working on a laptop"
                    className="size-full object-cover"
                />
            </div>
        );
    }

    return (
        <BrowserMockup url="gainday.com/job-board">
            <video
                ref={videoRef}
                className="block w-full object-cover"
                style={{ aspectRatio: `${VIDEO_WIDTH} / ${VIDEO_HEIGHT}` }}
                width={VIDEO_WIDTH}
                height={VIDEO_HEIGHT}
                poster="/media/candidate-demo-poster.webp"
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Short demo: a candidate browses the job board, opens a role and completes a work simulation"
            >
                <source src="/media/candidate-demo.webm" type="video/webm" />
                {/* Errors fire on <source>, not <video>. The last source failing means nothing can play. */}
                <source src="/media/candidate-demo.mp4" type="video/mp4" onError={() => setFailed(true)} />
            </video>
        </BrowserMockup>
    );
};

