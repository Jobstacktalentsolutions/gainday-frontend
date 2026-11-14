import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavbarLinksProps {
    label: string;
    links: readonly { label: string; to: string }[];
}

export function NavbarLinks({ label, links }: NavbarLinksProps) {
    const [highlighted, setHighlighted] = useState<string | null>(null);
    const highlightId = useId();
    const reducedMotion = useReducedMotion();

    return (
        <nav
            aria-label={label}
            className="hidden items-center gap-3 lg:flex"
            onMouseLeave={() => setHighlighted(null)}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setHighlighted(null);
            }}
        >
            {links.map((link) => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    onMouseEnter={() => setHighlighted(link.to)}
                    onFocus={() => setHighlighted(link.to)}
                    className={({ isActive }) => cn(
                        "relative rounded-lg px-2 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-primary-500",
                        isActive ? "bg-primary-50 text-primary-500" : "text-neutral-700 hover:text-primary-500",
                    )}
                >
                    {highlighted === link.to && (
                        <motion.span
                            layoutId={highlightId}
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 rounded-lg bg-primary-500/8"
                            transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 450, damping: 35 }}
                        />
                    )}
                    <span className="relative">{link.label}</span>
                </NavLink>
            ))}
        </nav>
    );
}
