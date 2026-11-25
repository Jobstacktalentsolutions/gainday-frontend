import { useCallback, useEffect, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Maximize, Minimize, Pause, Play, RotateCcw, Volume, VolumeOff } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { claimPlayback, releasePlayback, useDemoAudio } from "../utils/demoAudio";
import { formatTime } from "../utils/demoVideo";
import { usePageLoaded } from "../utils/usePageLoaded";

// Visitors who turned on their browser's data saver should not get a multi-megabyte autoplay.
const prefersSavedData = (): boolean =>
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

interface DemoPlayerProps {
    sources: { webm: string; mp4: string };
    poster: string;
    width: number;
    height: number;
    /** Accessible name for the player. */
    label: string;
    /** Start of the part of the file to play, in seconds. Defaults to the beginning. */
    start?: number;
    /** End of the part to play, in seconds. Defaults to the end of the file. */
    end?: number;
    preload?: "none" | "metadata";
    captionsSrc?: string;
    /** Called when no source can be played, so the parent can show a fallback. */
    onUnavailable?: () => void;
}

const ControlButton = ({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) => (
    <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
    >
        {children}
    </button>
);

/**
 * A video player with its own controls. It can play just a segment of a longer file (start/end),
 * keeping the seek bar and time inside that segment. Autoplay starts muted once the page has fully
 * loaded and the player is in view; it pauses when scrolled away or when the tab is hidden, and a
 * manual pause is respected.
 */
export const DemoPlayer = ({
    sources,
    poster,
    width,
    height,
    label,
    start = 0,
    end,
    preload = "metadata",
    captionsSrc,
    onUnavailable,
}: DemoPlayerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const userPausedRef = useRef(false);
    const finishedRef = useRef(false);

    const pageLoaded = usePageLoaded();
    const prefersReducedMotion = useReducedMotion();
    const isInView = useInView(containerRef, { amount: 0.5 });
    const muted = useDemoAudio((state) => state.muted);
    const setMuted = useDemoAudio((state) => state.setMuted);

    const [playing, setPlaying] = useState(false);
    const [finished, setFinished] = useState(false);
    const [position, setPosition] = useState(0); // seconds into the segment
    const [fileDuration, setFileDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const length = Math.max(0, (end ?? fileDuration) - start);

    const pause = useCallback(() => {
        videoRef.current?.pause();
    }, []);

    const play = useCallback(async () => {
        const video = videoRef.current;
        if (!video) return;

        const outsideSegment =
            video.currentTime < start - 0.1 || (end !== undefined && video.currentTime >= end - 0.05);
        if (finishedRef.current || outsideSegment) {
            video.currentTime = start;
            finishedRef.current = false;
            setFinished(false);
        }

        claimPlayback(pause);
        try {
            await video.play();
        } catch (error) {
            // Browsers refuse playback with sound until the visitor interacts with the page. Retry muted.
            if (error instanceof DOMException && error.name === "NotAllowedError" && !video.muted) {
                video.muted = true;
                setMuted(true);
                await video.play().catch(() => undefined);
            }
            // Anything else (e.g. paused again before it began) is not worth reporting.
        }
    }, [end, pause, setMuted, start]);

    // Keep the element's muted state in sync with the shared setting. Declared before the autoplay
    // effect so it is already applied when playback is first attempted.
    useEffect(() => {
        if (videoRef.current) videoRef.current.muted = muted;
    }, [muted]);

    // Autoplay once the page has fully loaded and the player is in view; pause when it leaves view.
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (!isInView) {
            video.pause();
            return;
        }
        const allowed = pageLoaded && !prefersReducedMotion && !prefersSavedData();
        if (allowed && !userPausedRef.current && !finishedRef.current) void play();
    }, [isInView, pageLoaded, prefersReducedMotion, play]);

    // Pause when the tab is hidden so a demo doesn't keep talking in the background.
    useEffect(() => {
        const onVisibility = () => {
            if (document.hidden) videoRef.current?.pause();
        };
        document.addEventListener("visibilitychange", onVisibility);
        return () => document.removeEventListener("visibilitychange", onVisibility);
    }, []);

    useEffect(() => {
        const onChange = () => setIsFullscreen(document.fullscreenElement === containerRef.current);
        document.addEventListener("fullscreenchange", onChange);
        return () => document.removeEventListener("fullscreenchange", onChange);
    }, []);

    useEffect(() => () => releasePlayback(pause), [pause]);

    // While playing: update the seek bar smoothly and stop exactly at the end of the segment.
    useEffect(() => {
        if (!playing) return;
        let frame = 0;
        const tick = () => {
            const video = videoRef.current;
            if (video) {
                if (end !== undefined && video.currentTime >= end - 0.03) {
                    video.pause();
                    finishedRef.current = true;
                    setFinished(true);
                    setPosition(end - start);
                    return;
                }
                setPosition(Math.max(0, video.currentTime - start));
            }
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [playing, start, end]);

    const updateDuration = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        const d = video.duration;
        if (Number.isFinite(d) && d > 0) setFileDuration(d);
    }, []);

    const handleLoadedMetadata = () => {
        updateDuration();
        const video = videoRef.current;
        if (video && video.currentTime < start) video.currentTime = start;
    };

    const handleTimeUpdate = () => {
        const video = videoRef.current;
        if (!video) return;
        updateDuration(); // catch duration once it becomes finite (WebM often starts as Infinity)
        if (video.paused) setPosition(Math.max(0, video.currentTime - start));
    };

    const handleEnded = () => {
        finishedRef.current = true;
        setFinished(true);
        setPlaying(false);
    };

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            userPausedRef.current = false;
            void play();
        } else {
            userPausedRef.current = true;
            video.pause();
        }
    };

    const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        if (!video) return;
        const next = Number(event.target.value);
        video.currentTime = start + next;
        setPosition(next);
        if (next < length - 0.1) {
            finishedRef.current = false;
            setFinished(false);
        }
    };

    const toggleFullscreen = () => {
        const container = containerRef.current;
        if (!container) return;
        if (document.fullscreenElement) {
            void document.exitFullscreen();
        } else if (container.requestFullscreen) {
            void container.requestFullscreen().catch(() => undefined);
        } else {
            // iPhone Safari can only fullscreen the video element itself.
            (videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null)?.webkitEnterFullscreen?.();
        }
    };

    return (
        <div
            ref={containerRef}
            role="group"
            aria-label={label}
            className={cn("relative overflow-hidden bg-black", isFullscreen && "flex h-full w-full items-center justify-center")}
        >
            <video
                ref={videoRef}
                className={cn("block w-full cursor-pointer", isFullscreen ? "max-h-full object-contain" : "object-cover")}
                style={isFullscreen ? undefined : { aspectRatio: `${width} / ${height}` }}
                width={width}
                height={height}
                poster={poster}
                playsInline
                preload={preload}
                onClick={togglePlay}
                onLoadedMetadata={handleLoadedMetadata}
                onDurationChange={updateDuration}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={handleEnded}
                onTimeUpdate={handleTimeUpdate}
            >
                <source src={sources.webm} type="video/webm" />
                {/* Errors fire on <source>, not <video>. The last source failing means nothing can play. */}
                <source src={sources.mp4} type="video/mp4" onError={onUnavailable} />
                {captionsSrc && <track kind="captions" src={captionsSrc} srcLang="en" label="English" default />}
            </video>

            {!playing && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="flex size-14 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm">
                        {finished ? <RotateCcw className="size-6" /> : <Play className="size-6" />}
                    </span>
                </div>
            )}

            {muted && playing && (
                <button
                    type="button"
                    onClick={() => setMuted(false)}
                    className="absolute top-2 right-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
                >
                    <VolumeOff className="size-3.5" aria-hidden="true" />
                    Tap to unmute
                </button>
            )}

            <div className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-linear-to-t from-black/75 via-black/40 to-transparent px-2 pt-6 pb-1.5 text-white">
                <ControlButton label={finished ? "Replay" : playing ? "Pause" : "Play"} onClick={togglePlay}>
                    {finished ? <RotateCcw className="size-4" /> : playing ? <Pause className="size-4" /> : <Play className="size-4" />}
                </ControlButton>

                <span className="shrink-0 text-[11px] tabular-nums">
                    {formatTime(position)} / {formatTime(length)}
                </span>

                <input
                    type="range"
                    aria-label="Seek"
                    aria-valuetext={`${formatTime(position)} of ${formatTime(length)}`}
                    min={0}
                    max={length || 1}
                    step={0.1}
                    value={Math.min(position, length || 1)}
                    onChange={handleSeek}
                    className="h-1 min-w-0 flex-1 cursor-pointer accent-primary-500"
                />

                <ControlButton label={muted ? "Unmute" : "Mute"} onClick={() => setMuted(!muted)}>
                    {muted ? <VolumeOff className="size-4" /> : <Volume className="size-4" />}
                </ControlButton>

                <ControlButton label={isFullscreen ? "Exit full screen" : "Full screen"} onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
                </ControlButton>
            </div>
        </div>
    );
};
