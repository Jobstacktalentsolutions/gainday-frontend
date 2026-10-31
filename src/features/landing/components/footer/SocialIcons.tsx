import type { ReactNode } from "react";

interface SocialLink {
    label: string;
    href: string;
    icon: ReactNode;
}

const SOCIAL_LINKS: SocialLink[] = [
    {
        label: "X",
        href: "https://x.com/gaindayltd",
        icon: <img src="/social-icons/twitter.png" alt="" className="size-5 object-contain" />,
    },
    {
        label: "Instagram",
        href: "https://www.instagram.com/gaindayltd/",
        icon: <img src="/social-icons/instagram.png" alt="" className="size-5 object-contain" />,
    },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/gainday/",
        icon: <img src="/social-icons/linkedin.png" alt="" className="size-5 object-contain" />,
    },
];

export const SocialIcons = () => (
    <ul className="flex items-center gap-4 pt-1">
        {SOCIAL_LINKS.map(({ label, href, icon }) => (
            <li key={label}>
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Gainday on ${label} (opens in a new tab)`}
                    className="block transition duration-300 hover:scale-110 hover:opacity-75"
                >
                    {icon}
                </a>
            </li>
        ))}
    </ul>
);
