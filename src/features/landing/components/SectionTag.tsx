

interface SectionTagProps {
    label: string;
}

const SectionTag = ({ label }: SectionTagProps) => {
    return (
        <div
            className="flex max-w-max items-center justify-center text-[10px] lg:text-[14px] text-primary-500 gap-x-2.5 px-2 py-2 border rounded-[6px] border-primary-500 lg:flex-1 lg:max-w-max lg:py-2.5 lg:px-3">
            <span className="rounded-full w-1.5 h-1.5 bg-secondary-500" />
            {label}
        </div>
    )
}

export default SectionTag;