import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Figma "Frame 10": a rounded blue-to-navy gradient card with a warm glow rising from the
// bottom-right. Used around the hero demo and both landing photos. Everything is measured in
// design px and converted to container-query units, so it scales with its own width.
const GLOW_W = 283.2; // the ellipse before rotation
const GLOW_H = 392;
const GLOW_CENTER_X = 424.5; // centre of the glow's bounding box, from the frame's top-left
const GLOW_CENTER_Y = 458.3;

interface GradientFrameProps {
    /** Width of the Figma frame this is modelled on: 560 (hero) or 491 (photos). */
    designWidth: number;
    /** Figma gradient angle: 156.49 (hero) or 140.58 (photos). */
    angle: number;
    /** Inner margins in design px. */
    padX: number;
    padY: number;
    className?: string;
    children: ReactNode;
}

export const GradientFrame = ({ designWidth, angle, padX, padY, className, children }: GradientFrameProps) => {
    const cq = (px: number) => `${(px / designWidth) * 100}cqw`;

    return (
        <div
            className={cn("relative w-full overflow-hidden rounded-xl @container", className)}
            style={{ background: `linear-gradient(${angle}deg, #1B17FF 1.44%, #100E99 61.68%)` }}
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute rounded-full"
                style={{
                    left: cq(GLOW_CENTER_X - GLOW_W / 2),
                    top: cq(GLOW_CENTER_Y - GLOW_H / 2),
                    width: cq(GLOW_W),
                    height: cq(GLOW_H),
                    transform: "rotate(-66deg)",
                    background:
                        "radial-gradient(closest-side, rgba(224,147,46,0.95) 0%, rgba(224,147,46,0.55) 45%, rgba(224,147,46,0) 100%)",
                    filter: `blur(${cq(24)})`,
                }}
            />
            <div className="relative" style={{ padding: `${cq(padY)} ${cq(padX)}` }}>
                {children}
            </div>
        </div>
    );
};