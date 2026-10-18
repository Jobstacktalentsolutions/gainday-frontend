interface FooterColumnProps {
    heading: string
    links: string[]
}

export function FooterColumn({ heading, links }: FooterColumnProps) {
    return (
        <div className="flex w-20 flex-col items-start gap-4 lg:w-50 lg:gap-10">
            <p className="text-base text-primary-950">{heading}</p>
            <div className="flex flex-col items-start gap-3 text-base whitespace-nowrap text-neutral-700 lg:text-xs">
                {links.map((link) => (
                    <a key={link} href="#" className="hover:text-primary-500 duration-300 delay-100 transition-all hover:scale-105 lg:text-[14px]">
                        {link}
                    </a>
                ))}
            </div>
        </div>
    )
}