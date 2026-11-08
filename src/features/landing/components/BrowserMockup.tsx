import type { ReactNode } from "react";
import { ChevronLeft, Lock, Plus } from "lucide-react";

// Scale unit: maps Figma px (based on 521.89px browser width) to container-query width units.
// The browser-frame inner width in Figma is 521.89px.
const DESIGN_WIDTH = 521.89;
const u = (px: number) => `${(px / DESIGN_WIDTH) * 100}cqw`;

const SHADOW = [
    `drop-shadow(0 ${u(4.66)} ${u(2.33)} rgba(0,0,0,0.25))`,
    `drop-shadow(0 0 ${u(5.76)} rgba(0,0,0,0.14))`,
    `drop-shadow(0 ${u(7.68)} ${u(9.59)} rgba(0,0,0,0.2))`,
].join(" ");

// Decorative browser toolbar matching the Figma "Light Mockup / Toolbar" spec.
const BrowserToolbar = ({ url }: { url: string }) => (
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
                {url}
            </span>
            <Lock style={{ width: u(3.6), height: u(3.6) }} />
        </div>

        <Plus className="absolute" style={{ right: u(6), top: u(7), width: u(5.4), height: u(5.4) }} />
    </div>
);

interface BrowserMockupProps {
    url: string;
    children: ReactNode;
    className?: string;
}

/**
 * A decorative browser-window mockup that wraps any content in a rounded frame
 * with a toolbar (traffic lights, URL pill). Sizes everything with container-query
 * units so it scales correctly at any width.
 */
export const BrowserMockup = ({ url, children, className }: BrowserMockupProps) => (
    <div className={`[container-type:inline-size] w-full ${className ?? ""}`}>
        <div className="overflow-hidden" style={{ borderRadius: u(4.66), filter: SHADOW }}>
            <BrowserToolbar url={url} />
            {children}
        </div>
    </div>
);

