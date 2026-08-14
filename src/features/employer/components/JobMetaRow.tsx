interface JobMetaRowProps {
    location: string;
    employmentType: string;
}

const JobMetaRow = ({ location, employmentType }: JobMetaRowProps) => {
    <div className="flex items-center gap-1 text-base text-neutral-700">
        <span>
            {location}
        </span>
        <span className="size-1 rounded-full bg-neutral-300 " aria-hidden="true" />
        <span>{employmentType}</span>

    </div>
}

export default JobMetaRow;