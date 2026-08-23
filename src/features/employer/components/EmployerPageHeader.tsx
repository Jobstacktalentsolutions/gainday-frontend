import { Plus } from "lucide-react";


interface EmployerPageHeaderProps {
    employerName: string;
    logoUrl?: string;
    onPostJob: () => void;
}

const EmployerPageHeader = ({ employerName, logoUrl, onPostJob }: EmployerPageHeaderProps) => {
    return (
        <div className="flex w-full items-centetr justify-between">
            <div className="flex flex-col items-start gap-2">
                <span className="text-xs text-primary-500">EMPLOYER</span>
                <div className="flex items-center gap-1">
                    {logoUrl ? (
                        <img src={logoUrl} className="size-4" alt="" />
                    ) : (
                        <div className="size-4 rounded-sm border-[3px] border-neutral-950" aria-hidden="true" />
                    )}
                    <span className="text-shadow-lg font-bold text-back">{employerName}</span>
                </div>
            </div>
            <button
                type="button"
                onClick={onPostJob}
                className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-500 py-1 pl-4 pr-1 text-base text-neutral-50"
            >
                <span>Post a job</span>
                <span className="flex size-8 items-center justify-center rounded-lg bg-secondary-500">
                    <Plus className="size-4 text-white" aria-hidden="true" />
                </span>
            </button>

        </div>
    )
}

export default EmployerPageHeader;