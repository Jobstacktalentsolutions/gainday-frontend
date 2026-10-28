import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface FooterLinkItem {
    label: string;
    /** Internal route, optionally with a #section hash. */
    to?: string;
    /** External link or mailto:. */
    href?: string;
}

interface FooterColumnProps {
    heading: string;
    links: FooterLinkItem[];
    /** Extra content under the links, e.g. social icons. */
    extra?: ReactNode;
}

const linkClass = "hover:text-primary-500 transition-colors duration-300 lg:text-[14px]";

export function FooterColumn({ heading, links, extra }: FooterColumnProps) {
    return (
        <div className="flex w-20 flex-col items-start gap-4 lg:w-50 lg:gap-10">
            <p className="text-base text-primary-950">{heading}</p>
            <div className="flex flex-col items-start gap-3 text-base whitespace-nowrap text-neutral-700 lg:text-xs">
                {links.map((link) =>
                    link.to ? (
                        <Link key={link.label} to={link.to} className={linkClass}>
                            {link.label}
                        </Link>
                    ) : (
                        <a key={link.label} href={link.href ?? "#"} className={linkClass}>
                            {link.label}
                        </a>
                    ),
                )}
                {extra}
            </div>
        </div>
    );
}