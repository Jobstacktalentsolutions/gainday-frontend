import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FormTextarea } from "@/components/form/FormTextarea";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useParseJobDescription, type ParsedJobDetails } from "../hooks/useParseJobDescription";

// Mirrors the backend's ParseJobDescriptionDto minimum so the employer sees the hint inline instead
// of a round-trip 400.
const MIN_RAW_TEXT_LENGTH = 40;

interface ImportJobDescriptionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onParsed: (parsed: ParsedJobDetails) => void;
    hasExistingContent?: boolean;
}

const ImportJobDescriptionModal = ({
    open,
    onOpenChange,
    onParsed,
    hasExistingContent = false,
}: ImportJobDescriptionModalProps) => {
    const [rawText, setRawText] = useState("");
    const parseMutation = useParseJobDescription();
    const isParsing = parseMutation.isPending;

    const trimmedLength = rawText.trim().length;
    const isTooShort = trimmedLength > 0 && trimmedLength < MIN_RAW_TEXT_LENGTH;
    const canSubmit = trimmedLength >= MIN_RAW_TEXT_LENGTH && !isParsing;

    const handleOpenChange = (next: boolean) => {
        // Keep the modal open while a parse is running so its result is never lost.
        if (isParsing) return;
        if (!next) parseMutation.reset();
        onOpenChange(next);
    };

    const handleSubmit = async () => {
        if (!canSubmit) return;
        try {
            const parsed = await parseMutation.mutateAsync(rawText);
            onParsed(parsed);
            setRawText("");
            onOpenChange(false);
        } catch {
            // The error is shown inline below; the modal stays open so the employer can retry.
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="w-full max-w-xl sm:max-w-xl p-6 sm:p-7">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-neutral-900">
                        Import job description
                    </DialogTitle>
                    <DialogDescription className="text-sm text-neutral-500">
                        Paste an existing job description. We'll fill in the form and rewrite the description for candidates.
                    </DialogDescription>
                </DialogHeader>

                <FormTextarea
                    label="Job description to import"
                    hideLabel
                    rows={12}
                    placeholder="Paste the job description here..."
                    value={rawText}
                    disabled={isParsing}
                    error={isTooShort ? `Paste at least ${MIN_RAW_TEXT_LENGTH} characters so Gainday has enough to work with.` : undefined}
                    onChange={(e) => setRawText(e.target.value)}
                />

                {hasExistingContent && (
                    <p className="text-sm text-neutral-500">
                        Fields already filled in the form will be replaced.
                    </p>
                )}

                {parseMutation.isError && !isParsing && (
                    <p role="alert" className="text-sm text-error-500">
                        Couldn't parse that description. Try again.
                    </p>
                )}

                <DialogFooter className="pt-3">
                    <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isParsing}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!canSubmit}>
                        {isParsing && <Loader2 className="animate-spin" aria-hidden="true" />}
                        {isParsing ? "Parsing..." : "Parse"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ImportJobDescriptionModal;
