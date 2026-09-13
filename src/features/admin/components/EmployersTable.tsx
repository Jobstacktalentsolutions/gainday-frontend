import { AdminButton } from "@/components/ui/AdminButton";
import StatusBadge from "./StatusBadge";
import type { AdminEmployer } from "../types/user";

interface EmployersTableProps {
    employers: AdminEmployer[];
    onEdit: (employer: AdminEmployer) => void;
    onSuspend: (employer: AdminEmployer) => void;
    isSuspending: boolean;
}

const EmployersTable = ({ employers, onEdit, onSuspend, isSuspending }: EmployersTableProps) => {
    if (employers.length === 0) {
        return (
            <div className="w-full rounded-[10px] border border-neutral-200 bg-white px-5 py-10 text-center text-sm text-neutral-500">
                No employers match your search.
            </div>
        );
    }

    return (
        <div
            role="table"
            aria-label="Employers"
            className="flex w-full flex-col overflow-clip rounded-[10px] border border-neutral-200 bg-white px-5 py-2"
        >
            <div
                role="row"
                className="flex w-full items-center gap-4 py-3 text-xs font-medium text-neutral-500"
            >
                <span role="columnheader" className="min-w-0 flex-1">
                    NAME / EMAIL
                </span>
                <span role="columnheader" className="w-32 shrink-0">
                    COMPANY
                </span>
                <span role="columnheader" className="w-20 shrink-0 text-center">
                    VERIFIED
                </span>
                <span role="columnheader" className="w-22.5 shrink-0">
                    STATUS
                </span>
                <span role="columnheader" className="w-45 shrink-0">
                    ACTIONS
                </span>
            </div>

            {employers.map((employer) => (
                <div
                    key={employer.id}
                    role="row"
                    className="flex w-full items-center gap-4 border-t border-neutral-100 py-3.5 first:border-t-0"
                >
                    <div role="cell" className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <p className="truncate text-sm font-medium text-neutral-900">
                            {employer.name}
                        </p>
                        <p className="truncate text-xs text-neutral-500">{employer.email}</p>
                    </div>

                    <p role="cell" className="w-32 shrink-0 truncate text-[13px] text-neutral-900">
                        {employer.employerProfile.companyName}
                    </p>

                    <div role="cell" className="flex w-20 shrink-0 justify-center">
                        {employer.employerProfile.isVerified ? (
                            <span className="inline-flex items-center justify-center rounded-full bg-success-50 px-2.5 py-1 text-xs font-medium text-success-700">
                                Yes
                            </span>
                        ) : (
                            <span className="inline-flex items-center justify-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500">
                                No
                            </span>
                        )}
                    </div>

                    <div role="cell" className="w-22.5 shrink-0">
                        <StatusBadge status={employer.status} />
                    </div>

                    <div role="cell" className="flex w-45 shrink-0 gap-2">
                        <AdminButton
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(employer)}
                        >
                            Edit
                        </AdminButton>
                        <AdminButton
                            variant="destructive"
                            size="sm"
                            onClick={() => onSuspend(employer)}
                            disabled={isSuspending}
                        >
                            Suspend
                        </AdminButton>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EmployersTable;
