import { AdminButton } from "@/components/ui/AdminButton";
import StatusBadge from "./StatusBadge";
import type { AdminCandidate } from "../types/user";

interface CandidatesTableProps {
    candidates: AdminCandidate[];
    onSuspend: (candidate: AdminCandidate) => void;
    isSuspending: boolean;
}

const CandidatesTable = ({ candidates, onSuspend, isSuspending }: CandidatesTableProps) => {
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
            className="flex w-full flex-col overflow-clip rounded-[10px] border border-neutral-200 bg-white px-5 py-2"
        >
            <div
                role="row"
                className="flex w-full items-center gap-4 py-3 text-xs font-medium text-neutral-500"
            >
                <span role="columnheader" className="min-w-0 flex-1">
                    NAME / EMAIL
                </span>
                <span role="columnheader" className="w-22.5 shrink-0">
                    STATUS
                </span>
                <span role="columnheader" className="w-25 shrink-0">
                    ACTIONS
                </span>
            </div>

            {candidates.map((candidate) => (
                <div
                    key={candidate.id}
                    role="row"
                    className="flex w-full items-center gap-4 border-t border-neutral-100 py-3.5 first:border-t-0"
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

                    <div role="cell" className="flex w-25 shrink-0 gap-2">
                        <AdminButton
                            variant="destructive"
                            size="sm"
                            onClick={() => onSuspend(candidate)}
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

export default CandidatesTable;
