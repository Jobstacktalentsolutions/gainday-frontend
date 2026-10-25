import type { KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { countWords, limitState } from "./replyLimits";
import { isSendShortcut } from "./chatHelpers";

interface Props {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    maxWords: number;
    /** Sending, or the chat is not accepting a reply right now. */
    disabled: boolean;
    placeholder: string | null;
}

// The reply box: multi-line, with a live word counter. It warns softly at 90% of the limit and blocks
// sending over the limit.
const ReplyBox = ({ value, onChange, onSend, maxWords, disabled, placeholder }: Props) => {
    const words = countWords(value);
    const state = limitState(words, maxWords);
    const empty = value.trim() === "";
    const canSend = !disabled && !empty && state !== "over";

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (isSendShortcut(event)) {
            event.preventDefault();
            if (canSend) onSend();
        }
    };

    return (
        <div className="flex w-full flex-col gap-2">
            <textarea
                aria-label="Your reply"
                rows={3}
                value={value}
                disabled={disabled}
                placeholder={placeholder ?? "Write your reply…"}
                onChange={(event) => onChange(event.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full resize-y rounded-xl border border-neutral-200 px-4 py-3 text-[15px] text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-primary-500 disabled:bg-neutral-50"
            />
            <div className="flex items-center justify-between gap-3">
                <span
                    aria-live="polite"
                    className={cn(
                        "text-sm",
                        state === "over" && "font-medium text-error-600",
                        state === "warning" && "text-warning-600",
                        state === "ok" && "text-neutral-500",
                    )}
                >
                    {words} / {maxWords} words
                </span>
                <button
                    type="button"
                    onClick={onSend}
                    disabled={!canSend}
                    className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ReplyBox;
