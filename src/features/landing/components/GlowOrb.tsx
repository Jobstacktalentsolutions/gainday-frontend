import { cn } from "@/lib/utils";

const TONES = {
    blue: "bg-[radial-gradient(circle,rgba(27,23,255,0.5)_0%,rgba(27,23,255,0)_70%)]",
    amber: "bg-[radial-gradient(circle,rgba(224,147,46,0.6)_0%,rgba(224,147,46,0)_70%)]",
    rose: "bg-[radial-gradient(circle,rgba(255,99,71,0.45)_0%,rgba(255,99,71,0)_70%)]",
} as const;

export type GlowTone = keyof typeof TONES;

interface GlowOrbProps {
    tone: GlowTone;
    /** Position and size, e.g. "-left-10 -top-10 size-56". */
    className?: string;
    drift?: boolean;
}

// Decorative. The parent needs `relative isolate` so the orb sits behind its siblings but
// above the page background (that's what gives glass cards something to blur).
export const GlowOrb = ({ tone, className, drift = true }: GlowOrbProps) => (
    <span
        aria-hidden="true"
        className={cn(
            "pointer-events-none absolute -z-10 rounded-full",
            TONES[tone],
            drift && "animate-orb-drift motion-reduce:animate-none",
            className,
        )}
    />
);