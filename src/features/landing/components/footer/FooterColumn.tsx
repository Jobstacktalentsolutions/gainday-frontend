interface FooterColumnProps {
    heading: string
    links: string[]
}

export function FooterColumn({ heading, links }: FooterColumnProps) {
    return (
        <div className="flex w-20 flex-col items-start gap-4 lg:w-[200px] lg:gap-10">
            <p className="text-base text-primary-950">{heading}</p>
            <div className="flex flex-col items-start gap-3 text-base whitespace-nowrap text-neutral-700 lg:text-xs">
                {links.map((link) => (
                    <a key={link} href="#" className="hover:text-primary-500">
                        {link}
                    </a>
                ))}
            </div>
        </div>
    )
}