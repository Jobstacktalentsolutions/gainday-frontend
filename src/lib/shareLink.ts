// Sharing a link: the native share sheet on touch devices, a clipboard copy everywhere else.
// UI-free on purpose — it reports what happened and the caller decides which toast to show.

export type ShareResult = "shared" | "copied" | "cancelled" | "failed";

interface ShareLinkOptions {
    title: string;
    text?: string;
    url: string;
}

// The single definition of where a job lives for outside readers. Keep it in sync with the
// `/job-board/:jobId` route in Routes.tsx.
export const getJobShareUrl = (jobId: string): string => `${window.location.origin}/job-board/${jobId}`;

// Desktop share sheets are inconsistent (Firefox has none, Chrome's is minimal) and people there
// mostly want a link to paste, so the native sheet is reserved for touch devices.
const shouldUseNativeShare = (): boolean =>
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches;

// `navigator.clipboard` only exists in secure contexts, so it's undefined when the app is opened
// over plain http on a LAN address (e.g. testing on a phone). This is the fallback for that case.
const copyWithTextarea = (text: string): boolean => {
    const textarea = document.createElement("textarea");
    try {
        textarea.value = text;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, text.length);
        return document.execCommand("copy");
    } catch {
        return false;
    } finally {
        textarea.remove();
    }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
    if (navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Permission denied or document not focused — try the textarea route instead.
        }
    }
    return copyWithTextarea(text);
};

export const shareLink = async ({ title, text, url }: ShareLinkOptions): Promise<ShareResult> => {
    const data: ShareData = { title, text, url };

    if (shouldUseNativeShare() && (navigator.canShare?.(data) ?? true)) {
        try {
            await navigator.share(data);
            return "shared";
        } catch (error) {
            // Closing the sheet rejects with AbortError. That's the user's choice, not a failure —
            // don't show an error and don't copy behind their back.
            if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
            // Any other failure: fall through and copy the link instead.
        }
    }

    return (await copyToClipboard(url)) ? "copied" : "failed";
};