import type { ReactNode } from "react";
import { cn } from "@/lib/utils"

interface HighlightBoxProps {
    children: ReactNode;
    color?: "primary" | "secondary";
    className: string;
}


const colorMap = {
    primary: {
        border: "border-primary-500",
        text: "text-primary-500",
        corner: "bg-primary-500",
        bg: "bg-primary-50/40",
    },
    secondary: {
        border: "border-secondary-500",
        text: "text-secondary-500",
        corner: "bg-secondary-500",
        bg: "bg-white/10",
    }
}

export function HighlightBox({ children, color = "primary", className }: HighlightBoxProps) {
    const c = colorMap[color];

    return (
        <span
            className={cn(
                "relative inline-flex items-center justify-center border px-4 py-1 whitespace-nowrap",
                c.border,
                c.bg,
                c.text,
                className
            )}
        >
            {children}
            <span className={cn("absolute -top-1 -left-1 size-2", c.corner)} />
            <span className={cn("absolute -bottom-1 -left-1 size-2", c.corner)} />
            <span className={cn("absolute -top-1 -right-1 size-2", c.corner)} />
            <span className={cn("absolute -bottom-1 -right-1 size-2", c.corner)} />

        </span>
    );

}