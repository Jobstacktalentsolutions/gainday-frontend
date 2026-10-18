import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToSectionById } from "../utils/scrollToSection";

// Scrolls to the section named in the URL hash when /landing is opened or a link to
// /landing#section is clicked. `key` is a dependency on purpose: clicking the same link twice
// leaves the hash unchanged, but React Router gives every navigation a fresh key.
export const useScrollToHash = () => {
    const { hash, key } = useLocation();

    useEffect(() => {
        if (!hash) return;
        // Give the sections a moment to mount and lay out before measuring.
        const timer = window.setTimeout(() => scrollToSectionById(hash.slice(1)), 50);
        return () => window.clearTimeout(timer);
    }, [hash, key]);
};