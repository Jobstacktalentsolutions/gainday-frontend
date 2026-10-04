import { AdminButton } from "@/components/ui/AdminButton";
import StatusBadge from "./StatusBadge";
import type { AdminEmployer } from "../types/user";

interface EmployersTableProps {
    employers: AdminEmployer[];
    onView: (employer: AdminEmployer) => void;
    onEdit: (employer: AdminEmployer) => void;
    onSuspend: (employer: AdminEmployer) => void;
    isSuspending: boolean;
}

const EmployersTable = ({
    employers,
    onView,
    onEdit,
    onSuspend,
    isSuspending,
}: EmployersTableProps) => {
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
            className="flex w-full flex-col overflow-clip rounded-[10px] border border-neutral-200 bg-white px-5 py-2 shadow-xs"
        >
            <div
                role="row"
                className="flex w-full items-center gap-4 py-3 text-xs font-medium text-neutral-500 border-b border-neutral-100"
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
                <span role="columnheader" className="w-36 shrink-0 text-right">
                    ACTIONS
                </span>
            </div>

            {employers.map((employer) => (
                <div
                    key={employer.id}
                    role="row"
                    onClick={() => onView(employer)}
                    className="flex w-full items-center gap-4 border-b border-neutral-100 last:border-b-0 py-3.5 hover:bg-neutral-50/80 cursor-pointer transition-colors px-2 -mx-2 rounded-lg"
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

                    <div
                        role="cell"
                        className="flex w-36 shrink-0 items-center justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AdminButton
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(employer);
                            }}
                            className="h-8 px-2.5 text-xs cursor-pointer text-neutral-700 hover:text-primary-600 hover:bg-neutral-50"
                        >
                            Edit
                        </AdminButton>
                        <AdminButton
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSuspend(employer);
                            }}
                            disabled={isSuspending}
                            className="h-8 px-2.5 text-xs cursor-pointer"
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
