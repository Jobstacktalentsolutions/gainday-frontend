/** One recording serves both landing sections: the hero plays all of it, the candidate section only its own part. */
export const DEMO_VIDEO = {
    sources: { webm: "/media/product-demo.webm", mp4: "/media/product-demo.mp4" },
    // Must match the encoded file: width 1200, height from ffprobe (676 for a 1920x1080 source scaled to 1200:-2).
    width: 1200,
    height: 676,
} as const;

export const HERO_POSTER = "/media/hero-demo-poster.webp";
export const CANDIDATE_POSTER = "/media/candidate-demo-poster.webp";

/** Where the candidate demo sits inside the full recording, in seconds. */
export const CANDIDATE_SEGMENT = { start: 13.5, end: 42 } as const;

/** Seconds as m:ss. Values that aren't ready yet (NaN, Infinity, negative) show as 0:00. */
export function formatTime(seconds: number): string {
    const whole = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
    return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}
