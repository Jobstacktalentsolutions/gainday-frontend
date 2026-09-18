import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { FormTextarea } from "@/components/form/FormTextarea";
import ConfirmOverwriteModal from "./ConfirmOverwriteModal";
import { useParseJobDescription, type ParsedJobDetails } from "../hooks/useParseJobDescription";

// Mirrors the backend's ParseJobDescriptionDto minimum — surfaced here so the employer gets an
// inline hint instead of a round-trip 400.
const MIN_RAW_TEXT_LENGTH = 40;

interface JobDescriptionPasteInputProps {
    onParsed: (parsed: ParsedJobDetails) => void;
}

const JobDescriptionPasteInput = ({ onParsed }: JobDescriptionPasteInputProps) => {
    const [rawText, setRawText] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const parseMutation = useParseJobDescription();

    const isTooShort = rawText.trim().length > 0 && rawText.trim().length < MIN_RAW_TEXT_LENGTH;

    const handleParseClick = () => {
        if (!rawText.trim() || isTooShort) return;
        setConfirmOpen(true);
    }

    const handleConfirm = async () => {
        setConfirmOpen(false);
        try {
            const parsed = await parseMutation.mutateAsync(rawText);
            onParsed(parsed);

            setRawText("");
        } catch {
            toast.error("Couldn't parse that description — try again, or fill the fields in manually.");
            // leave raw text to allow retry
        }
    }

    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-primary-50 p-5">
            <div className="flex flex-col gap-1">
                <p className="text-base font-medium text-neutral-800">
                    Have an existing job description?
                </p>
                <p className="text-sm text-neutral-500">
                    Paste it below and we'll fill in as many of the fields underneath as we can find
                </p>
            </div>

            <FormTextarea
                label="Paste job description"
                hideLabel
                rows={6}
                placeholder="Paste your existing job description here..."
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
            />

            <div className="flex items-center gap-3 self-start">
                <button
                    type="button"
                    onClick={handleParseClick}
                    disabled={!rawText.trim() || isTooShort || parseMutation.isPending}
                    className="flex cursor-pointer h-10 items-center gap-2 rounded-xl bg-primary-500 hover:bg-primary-400 px-4 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {parseMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                        <Sparkles className="size-4" aria-hidden="true" />
                    )}
                    {parseMutation.isPending ? "Parsing..." : "Parse job description"}
                </button>

                {isTooShort && (
                    <p className="text-sm text-neutral-500">
                        Paste at least {MIN_RAW_TEXT_LENGTH} characters so Gainday has enough to work with.
                    </p>
                )}

                {!isTooShort && parseMutation.isError && (
                    <p className="text-sm text-error-500">
                        Couldn't parse that description. Try again, or fill the fields in manually.
                    </p>
                )}
            </div>

            <ConfirmOverwriteModal
                open={confirmOpen}
                onConfirm={handleConfirm}
                onCancel={() => setConfirmOpen(false)}
            />


        </div>
    )
}

export default JobDescriptionPasteInput;
