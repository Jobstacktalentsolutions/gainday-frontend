import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
    window.addEventListener("load", onChange);
    return () => window.removeEventListener("load", onChange);
};

/** True once the browser's load event has fired (every image and script on the page has finished). */
export function usePageLoaded(): boolean {
    return useSyncExternalStore(
        subscribe,
        () => document.readyState === "complete",
        () => false,
    );
}
