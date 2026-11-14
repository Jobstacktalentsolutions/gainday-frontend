interface JobMetaRowProps {
    location: string;
    employmentType: string;
}

const JobMetaRow = ({ location, employmentType }: JobMetaRowProps) => {
    return (
        <div className="flex flex-wrap items-center gap-1 text-sm text-neutral-700 lg:text-base">
            <span>
                {location}
            </span>
            <span className="size-1 rounded-full bg-neutral-300 " aria-hidden="true" />
            <span>{employmentType}</span>
        </div>)
}

export default JobMetaRow;
