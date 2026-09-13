import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { FormTextarea } from "@/components/form/FormTextarea";
import ConfirmOverwriteModal from "./ConfirmOverwriteModal";
import { useParseJobDescription, type ParsedJobDetails } from "../hooks/useParseJobDescription";


interface JobDescriptionPasteInputProps {
    onParsed: (rawText: string, parsed: ParsedJobDetails) => void;
}

const JobDescriptionPasteInput = ({ onParsed }: JobDescriptionPasteInputProps) => {
    const [rawText, setRawText] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const parseMutation = useParseJobDescription();


    const handleParseClick = () => {
        if (!rawText.trim()) return;
        setConfirmOpen(true);
    }

    const handleConfirm = async () => {
        setConfirmOpen(false);
        try {
            const parsed = await parseMutation.mutateAsync(rawText);
            onParsed(rawText, parsed);
        } catch {
            //put the parse mutation error
        }
    }

    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50 p-5">
            <div className="flex flex-col gap-1">
                <p className="text-base font-medium text-neutral-800">
                    Have an existing job description?
                </p>
                <p className="text-sm text-neutral-500">
                    Paste it below and we'll fill in as many of the fields underneath as we can find.
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

        </div>
    )
}