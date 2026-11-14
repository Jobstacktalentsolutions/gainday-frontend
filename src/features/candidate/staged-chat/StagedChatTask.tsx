import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { X } from "lucide-react";
import CaseFilePanel from "./CaseFilePanel";
import ChatBubble from "./ChatBubble";
import ReplyBox from "./ReplyBox";
import { usePostStagedChatReply, useStagedChatState, type StagedChatTranscriptEntry } from "./stagedChatApi";

interface Props {
    submissionId: string;
    taskId: string;
}

interface Draft {
    turn: number;
    text: string;
    idempotencyKey: string;
}

const timeOf = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function errorMessageOf(error: unknown): string {
    if (isAxiosError<{ message?: string | { message?: string } }>(error)) {
        const message = error.response?.data?.message;
        if (typeof message === "string") return message;
        if (message && typeof message === "object" && typeof message.message === "string") return message.message;
    }
    return "The reply could not be sent. Check your connection and try again.";
}

/**
 * A staged chat: a scripted customer and the candidate's replies, one turn at a time.
 * Messages appear instantly without artificial delays, and candidate replies render optimistically.
 */
const StagedChatTask = ({ submissionId, taskId }: Props) => {
    const state = useStagedChatState(submissionId, taskId);
    const post = usePostStagedChatReply(submissionId, taskId);

    const [text, setText] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [turnTimes, setTurnTimes] = useState<Record<number, string>>({});

    // Keeps one idempotency key per draft, so retrying the same send cannot store a second reply.
    const draft = useRef<Draft | null>(null);
    const listRef = useRef<HTMLOListElement | null>(null);

    const data = state.data;
    const pending: StagedChatTranscriptEntry | null =
        data && data.status === "IN_PROGRESS"
            ? data.transcript.find((entry) => entry.candidateReply === null) ?? null
            : null;

    // Track stable timestamps for released turns
    useEffect(() => {
        if (!data) return;
        const now = timeOf(new Date().toISOString());
        setTurnTimes((prev) => {
            const next = { ...prev };
            let changed = false;
            for (const entry of data.transcript) {
                if (!next[entry.turn]) {
                    next[entry.turn] = now;
                    changed = true;
                }
            }
            return changed ? next : prev;
        });
    }, [data?.transcript]);

    // Keep chat scrolled to bottom on new messages
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [data?.transcript.length, data?.transcript[data.transcript.length - 1]?.candidateReply]);

    if (state.isPending) return <p className="text-sm text-neutral-500">Loading the conversation…</p>;
    if (state.isError || !data) {
        return (
            <p role="alert" className="text-sm text-error-600">
                The conversation could not be loaded. Refresh the page to try again.
            </p>
        );
    }

    const turnCount = data.turnCount;
    const canReply = pending !== null && !post.isPending;

    const send = () => {
        if (!pending) return;
        const body = text.trim();
        if (!body) return;

        const key =
            draft.current && draft.current.turn === pending.turn && draft.current.text === body
                ? draft.current.idempotencyKey
                : crypto.randomUUID();
        draft.current = { turn: pending.turn, text: body, idempotencyKey: key };
        setError(null);
        setText(""); // Instantly clear input for snappy UX

        post.mutate(
            {
                turn: pending.turn,
                text: body,
                clientSentAt: new Date().toISOString(),
                idempotencyKey: key,
            },
            {
                onSuccess: () => {
                    draft.current = null;
                },
                onError: (failure) => {
                    // Restore text if send fails
                    if (draft.current) {
                        setText(draft.current.text);
                    }
                    setError(errorMessageOf(failure));
                },
            },
        );
    };

    const progress =
        data.status === "COMPLETE"
            ? `All ${turnCount} replies sent`
            : `Reply ${Math.min(data.currentTurn, turnCount)} of ${turnCount}`;

    return (
        <div className="flex w-full flex-col gap-4 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-start md:gap-6">
            <div className="hidden md:block">
                <CaseFilePanel tabs={data.caseFile.tabs} />
            </div>

            <div className="flex w-full flex-col gap-3">
                <button
                    type="button"
                    onClick={() => setSheetOpen(true)}
                    className="button-gradient-outline self-start rounded-lg border border-neutral-300 px-3 py-2 text-sm md:hidden"
                >
                    Case file
                </button>

                <p className="text-sm text-neutral-500" aria-live="polite">
                    {progress}
                </p>

                <ol
                    ref={listRef}
                    aria-label="Conversation"
                    className="flex max-h-[55dvh] flex-col gap-4 overflow-y-auto pr-1 md:max-h-[60vh] scroll-smooth"
                >
                    {data.transcript.map((entry) => (
                        <li key={entry.turn} className="flex flex-col gap-3">
                            <ChatBubble
                                author="customer"
                                customerName={data.displayName}
                                text={entry.customerMessage}
                                time={turnTimes[entry.turn]}
                            />
                            {entry.candidateReply !== null && (
                                <ChatBubble
                                    author="candidate"
                                    text={entry.candidateReply}
                                    time={entry.candidateSentAt ? timeOf(entry.candidateSentAt) : timeOf(new Date().toISOString())}
                                />
                            )}
                        </li>
                    ))}
                </ol>

                {data.status === "IN_PROGRESS" && (
                    <div className="sticky bottom-0 flex flex-col gap-2 bg-white pt-2">
                        <ReplyBox
                            value={text}
                            onChange={setText}
                            onSend={send}
                            maxWords={data.wordLimit.max}
                            disabled={!canReply}
                            placeholder={data.placeholder}
                        />
                        {error && (
                            <p role="alert" className="text-sm text-error-600">
                                {error}
                            </p>
                        )}
                    </div>
                )}

                {data.status === "COMPLETE" && (
                    <p className="text-sm text-neutral-700">The conversation is complete. Your replies are saved.</p>
                )}
                {data.status === "INCOMPLETE" && (
                    <p className="text-sm text-neutral-700">
                        This conversation closed before it finished. The replies you sent are kept.
                    </p>
                )}
            </div>

            {sheetOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Case file"
                    className="fixed inset-x-0 bottom-0 z-50 flex max-h-[80dvh] flex-col gap-3 overflow-y-auto rounded-t-2xl bg-white p-4 shadow-xl md:hidden"
                >
                    <div className="flex justify-end">
                        <button type="button" onClick={() => setSheetOpen(false)} aria-label="Close case file" className="p-1">
                            <X className="size-5" />
                        </button>
                    </div>
                    <CaseFilePanel tabs={data.caseFile.tabs} />
                </div>
            )}
        </div>
    );
};

export default StagedChatTask;
