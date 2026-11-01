import { Mail, MessageCircle, Share2 } from "lucide-react";

const XIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 fill-current">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
    >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

interface ShareJobPanelProps {
    jobTitle: string;
    jobUrl: string;
}

const buttonClass =
    "flex h-10 items-center gap-2 rounded-lg border border-neutral-200 px-4 text-sm font-medium text-neutral-700 transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600";

export const ShareJobPanel = ({ jobTitle, jobUrl }: ShareJobPanelProps) => {
    const message = `We're hiring: ${jobTitle}. Show us what you can do with a short work simulation on Gainday.`;
    const url = encodeURIComponent(jobUrl);

    const channels = [
        { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`, icon: <LinkedInIcon /> },
        { label: "X", href: `https://x.com/intent/post?text=${encodeURIComponent(message)}&url=${url}`, icon: <XIcon /> },
        { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${message} ${jobUrl}`)}`, icon: <MessageCircle className="size-4" aria-hidden="true" /> },
        {
            label: "Email",
            href: `mailto:?subject=${encodeURIComponent(`We're hiring: ${jobTitle}`)}&body=${encodeURIComponent(`${message}\n\n${jobUrl}`)}`,
            icon: <Mail className="size-4" aria-hidden="true" />,
        },
    ];

    const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

    const handleNativeShare = async () => {
        try {
            await navigator.share({ title: jobTitle, text: message, url: jobUrl });
        } catch {
            // The person closed the share sheet. Nothing to do.
        }
    };

    return (
        <div className="flex w-full max-w-md flex-col gap-3 text-left">
            <div>
                <p className="text-base font-medium text-neutral-950">Share your job to start getting applications</p>
                <p className="text-sm text-neutral-500">Post it where your network will see it.</p>
            </div>
            <div className="flex flex-wrap gap-2">
                {channels.map(({ label, href, icon }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={buttonClass}>
                        {icon}
                        {label}
                    </a>
                ))}
                {canNativeShare && (
                    <button type="button" onClick={handleNativeShare} className={buttonClass}>
                        <Share2 className="size-4" aria-hidden="true" />
                        More…
                    </button>
                )}
            </div>
        </div>
    );
};