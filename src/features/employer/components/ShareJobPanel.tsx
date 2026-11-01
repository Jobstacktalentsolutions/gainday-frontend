import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { toast } from "sonner";

interface ShareJobPanelProps {
    jobTitle: string;
    jobUrl: string;
}

export const ShareJobPanel = ({ jobTitle, jobUrl }: ShareJobPanelProps) => {
    const [copied, setCopied] = useState(false);

    const message = `We're hiring: ${jobTitle}. Show us what you can do with a short work simulation on Gainday.`;
    const url = encodeURIComponent(jobUrl);

    const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    const xHref = `https://x.com/intent/post?text=${encodeURIComponent(message)}&url=${url}`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(jobUrl);
            setCopied(true);
            toast.success("Job link copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Couldn't copy link — please copy manually");
        }
    };

    return (
        <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
            <div className="flex flex-col items-center gap-1.5">
                <h3 className="text-[20px]  tracking-tight text-neutral-950 sm:text-3xl mb-4">
                    Share your job to start getting applications
                </h3>
                <p className="text-base text-neutral-500">Post it where your network will see it.</p>
            </div>

            <div className="flex items-center justify-center gap-3">
                {/* LinkedIn */}
                <a
                    href={linkedInHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on LinkedIn"
                    className="flex size-12 items-center justify-center rounded-xl bg-primary-500 text-white shadow-xs transition-all hover:bg-primary-600 hover:scale-105 active:scale-95"
                >
                    <img
                        src="/social-icons/linkedin.png"
                        alt=""
                        aria-hidden="true"
                        className="size-5 object-contain brightness-0 invert"
                    />
                </a>

                {/* X */}
                <a
                    href={xHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on X"
                    className="flex size-12 items-center justify-center rounded-xl bg-primary-500 text-white shadow-xs transition-all hover:bg-primary-600 hover:scale-105 active:scale-95"
                >
                    <img
                        src="/social-icons/twitter.png"
                        alt=""
                        aria-hidden="true"
                        className="size-5 object-contain brightness-0 invert"
                    />
                </a>

                {/* Copy link */}
                <button
                    type="button"
                    onClick={handleCopy}
                    className="flex h-12 items-center justify-center gap-2 rounded-xl bg-neutral-800 px-5 text-sm font-medium text-white shadow-xs transition-all hover:bg-neutral-900 hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                    {copied ? (
                        <Check className="size-4 text-success-400" aria-hidden="true" />
                    ) : (
                        <Link2 className="size-4" aria-hidden="true" />
                    )}
                    <span>{copied ? "Copied" : "Copy link"}</span>
                </button>
            </div>
        </div>
    );
};
