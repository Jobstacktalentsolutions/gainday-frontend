import { AdminButton } from "@/components/ui/AdminButton";
import StatusBadge from "./StatusBadge";
import type { AdminCandidate } from "../types/user";

interface CandidatesTableProps {
    candidates: AdminCandidate[];
    onView: (candidate: AdminCandidate) => void;
    onSuspend: (candidate: AdminCandidate) => void;
    isSuspending: boolean;
}

const CandidatesTable = ({
    candidates,
    onView,
    onSuspend,
    isSuspending,
}: CandidatesTableProps) => {
    if (candidates.length === 0) {
        return (
            <div className="w-full rounded-[10px] border border-neutral-200 bg-white px-5 py-10 text-center text-sm text-neutral-500">
                No candidates match your search.
            </div>
        );
    }

    return (
        <div
            role="table"
            aria-label="Candidates"
            className="flex w-full flex-col overflow-clip rounded-[10px] border border-neutral-200 bg-white px-5 py-2 shadow-xs"
        >
            <div
                role="row"
                className="flex w-full items-center gap-4 py-3 text-xs font-medium text-neutral-500 border-b border-neutral-100"
            >
                <span role="columnheader" className="min-w-0 flex-1">
                    NAME / EMAIL
                </span>
                <span role="columnheader" className="w-22.5 shrink-0">
                    STATUS
                </span>
                <span role="columnheader" className="w-36 shrink-0 text-right">
                    ACTIONS
                </span>
            </div>

            {candidates.map((candidate) => (
                <div
                    key={candidate.id}
                    role="row"
                    onClick={() => onView(candidate)}
                    className="flex w-full items-center gap-4 border-b border-neutral-100 last:border-b-0 py-3.5 hover:bg-neutral-50/80 cursor-pointer transition-colors px-2 -mx-2 rounded-lg"
                >
                    <div role="cell" className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <p className="truncate text-sm font-medium text-neutral-900">
                            {candidate.name}
                        </p>
                        <p className="truncate text-xs text-neutral-500">{candidate.email}</p>
                    </div>

                    <div role="cell" className="w-22.5 shrink-0">
                        <StatusBadge status={candidate.status} />
                    </div>

                    <div role="cell" className="flex w-36 shrink-0 items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <AdminButton
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onView(candidate);
                            }}
                            className="h-8 px-2.5 text-xs cursor-pointer text-neutral-700 hover:text-primary-600 hover:bg-neutral-50"
                        >
                            View
                        </AdminButton>
                        <AdminButton
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSuspend(candidate);
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

export default CandidatesTable;
