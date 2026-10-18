import { Link } from "react-router-dom"

export interface FooterLinkItem {
    label: string
    /** Internal route, optionally with a #section hash. Omit for links that aren't wired up yet. */
    to?: string
}

interface FooterColumnProps {
    heading: string
    links: FooterLinkItem[]
}

export function FooterColumn({ heading, links }: FooterColumnProps) {
    return (
        <div className="flex w-20 flex-col items-start gap-4 lg:w-50 lg:gap-10">
            <p className="text-base text-primary-950">{heading}</p>
            <div className="flex flex-col items-start gap-3 text-base whitespace-nowrap text-neutral-700 lg:text-xs">
                {links.map((link) =>
                    link.to ? (
                        <Link key={link.label} to={link.to} className="hover:text-primary-500">
                            {link.label}
                        </Link>
                    ) : (
                        // TODO: not wired up yet — give these a destination (see the dead-link report).
                        <a key={link.label} href="#" className="hover:text-primary-500 duration-300 delay-100 transition-all hover:scale-105 lg:text-[14px]">
                            {link.label}
                        </a>
                    ),
                )}
            </div>
        </div>
    )
}

