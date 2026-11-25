import { useState } from "react";
import { BrowserMockup } from "./BrowserMockup";
import { DemoPlayer } from "./DemoPlayer";
import { CANDIDATE_POSTER, CANDIDATE_SEGMENT, DEMO_VIDEO } from "../utils/demoVideo";

/**
 * Candidate job-board / simulation demo inside a browser mockup. It plays only the candidate part of
 * the shared recording (see CANDIDATE_SEGMENT), and falls back to the cta.jpg image if the video
 * cannot load.
 */
export const CandidateDemo = () => {
    const [failed, setFailed] = useState(false);

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
        <BrowserMockup url="gainday.org/job-board">
            <DemoPlayer
                sources={DEMO_VIDEO.sources}
                poster={CANDIDATE_POSTER}
                width={DEMO_VIDEO.width}
                height={DEMO_VIDEO.height}
                start={CANDIDATE_SEGMENT.start}
                end={CANDIDATE_SEGMENT.end}
                label="Product demo: a candidate browses the job board, opens a role and completes a work simulation"
                preload="none"
                onUnavailable={() => setFailed(true)}
            />
        </BrowserMockup>
    );
};
