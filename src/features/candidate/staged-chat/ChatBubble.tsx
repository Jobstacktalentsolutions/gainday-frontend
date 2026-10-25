import { cn } from "@/lib/utils";
import { initialsOf } from "./chatHelpers";

interface Props {
    author: "customer" | "candidate";
    /** The customer's display name, used for the avatar and the label. Not shown for candidate bubbles. */
    customerName?: string;
    text: string;
    /** Shown small and muted. Omitted while a message is still on its way. */
    time?: string;
}

// Customers sit on the left with an initials avatar; the candidate's own messages sit on the right.
// Once sent, a bubble is plain text: nothing here can edit or delete it.
const ChatBubble = ({ author, customerName = "", text, time }: Props) => {
    const isCandidate = author === "candidate";
    return (
        <div className={cn("flex w-full items-end gap-2", isCandidate ? "justify-end" : "justify-start")}>
            {!isCandidate && (
                <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium text-neutral-700"
                >
                    {initialsOf(customerName)}
                </span>
            )}
            <div className={cn("flex max-w-[80%] flex-col gap-1", isCandidate ? "items-end" : "items-start")}>
                {!isCandidate && <span className="text-xs text-neutral-500">{customerName}</span>}
                <p
                    className={cn(
                        "whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[15px] leading-6",
                        isCandidate ? "rounded-br-sm bg-primary-600 text-white" : "rounded-bl-sm bg-neutral-100 text-neutral-950",
                    )}
                >
                    {text}
                </p>
                {time && <time className="text-[11px] text-neutral-400">{time}</time>}
            </div>
        </div>
    );
};

export default ChatBubble;
