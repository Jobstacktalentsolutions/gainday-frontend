import type { RichTextComposerPayload, TextAreaPayload } from "@/features/simulation-tasks/types";

interface Props {
    // TEXT_AREA and RICH_TEXT_COMPOSER share an identical payload shape today (see
    // interface-type.ts: "same shape as TEXT_AREA (just a placeholder), rendered separately
    // so the two interface types can diverge later") — this renders both as a plain textarea
    // until RICH_TEXT_COMPOSER gets real rich-text editing.
    payload: TextAreaPayload | RichTextComposerPayload;
    value: string;
    onChange: (value: string) => void;
}

const MAX_CHARS = 1000;

const TextAreaAnswer = ({ payload, value, onChange }: Props) => (
    <textarea
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, MAX_CHARS))}
        placeholder={payload.placeholder ?? "Type your response here..."}
        className="h-38.25 w-full resize-none rounded-lg border border-neutral-200 px-3.5 py-2.5 text-[16px] text-neutral-700 shadow-[0px_1px_1px_rgba(10,13,18,0.05)] outline-none placeholder:text-neutral-400 focus:border-primary-500"
    />
);

export default TextAreaAnswer;
