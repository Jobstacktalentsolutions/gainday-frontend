import sparkle from "@/assets/sparkle.svg";

interface SectionTagProps {
    label: string;
}

const SectionTag = ({ label }: SectionTagProps) => {
    return (
        <div
            className="max-w-65  flex items-center justify-center text-[10px] lg:text-[14px] text-primary-500 gap-x-2.5 px-1.5 py-2 border rounded-[6px] border-primary-500 lg:flex-1 lg:max-w-max lg:py-2.5 lg:px-3">
            <img
                src={sparkle}
                alt="sparkle icon"
                className="w-4.25 h-2.75"
            />
            {label}
        </div>
    )
}

export default SectionTag;