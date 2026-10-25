import { useEffect, useState } from "react";

// Returns the id of the section currently near the top of the viewport (for the TOC highlight).
// Remount (via `key`) when the document changes so stale ids never linger.
export const useActiveSection = (ids: string[]) => {
    const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);
    const key = ids.join("|");

    useEffect(() => {
        const elements = key
            .split("|")
            .map((id) => document.getElementById(id))
            .filter((el): el is HTMLElement => el !== null);
        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible[0]) setActiveId(visible[0].target.id);
            },
            // Active band = just under the fixed header, top ~35% of the viewport.
            { rootMargin: "-120px 0px -65% 0px" },
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [key]);

    return activeId;
};