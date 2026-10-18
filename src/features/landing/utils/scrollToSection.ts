// Smooth-scrolls to the element with this id. Returns false if the current page has no such
// element. Respects the OS "reduce motion" setting.
export const scrollToSectionById = (id: string): boolean => {
    const element = document.getElementById(id);
    if (!element) return false;

    const prefersReducedMotion =
        typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    element.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    return true;
};

// Where a landing-page section lives. Links built with this work from any page: on /landing they
// scroll, anywhere else they navigate there first (see useScrollToHash).
export const landingSectionPath = (id: string): string => `/landing#${id}`;