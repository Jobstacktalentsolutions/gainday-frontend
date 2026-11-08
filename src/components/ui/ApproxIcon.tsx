import { cn } from "@/lib/utils";

interface ApproxIconProps {
    className?: string;
}

/**
 * Vertically-centered mathematical approximation symbol (tilde curve),
 * avoiding font-specific glyph elevation quirks (such as Glacial Indifference
 * placing standard ASCII tildes at the cap/overline height).
 */
export const ApproxIcon = ({ className }: ApproxIconProps) => (
    <svg
        className={cn("size-2.5 shrink-0 text-current inline-block", className)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M4 12c2.5-4 5.5-4 8 0s5.5 4 8 0" />
    </svg>
);

export default ApproxIcon;
