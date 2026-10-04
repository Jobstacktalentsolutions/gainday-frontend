import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCandidates, useSuspendCandidate } from "../hooks/useCandidates";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import CandidatesTable from "../components/CandidatesTable";
import SuspendUserDialog from "../components/SuspendUserDialog";
import type { AdminAccount, AdminCandidate } from "../types/user";

import { TableSkeleton } from "../components/skeletons";

const CandidateManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebouncedValue(searchTerm, 200);
    const [pendingSuspend, setPendingSuspend] = useState<AdminAccount | null>(null);

    const { data: candidates, isLoading, isError } = useCandidates();
    const suspendMutation = useSuspendCandidate();

    const filteredCandidates = useMemo(() => {
        if (!candidates) return [];
        const query = debouncedSearch.trim().toLowerCase();
        if (!query) return candidates;
        return candidates.filter(
            (candidate) =>
                candidate.name.toLowerCase().includes(query) ||
                candidate.email.toLowerCase().includes(query)
        );
    }, [candidates, debouncedSearch]);

    const handleConfirmSuspend = (account: AdminAccount, reason: string) => {
        suspendMutation.mutate(
            { id: account.id, reason },
            {
                onSuccess: () => setPendingSuspend(null),
            }
        );
    };

    const handleViewCandidate = (candidate: AdminCandidate) => {
        navigate(`/admin/candidate-management/${candidate.id}`);
    };

    return (
        <>
            <h1 className="text-2xl font-semibold text-neutral-900">
                Candidate Management
            </h1>

            <div className="w-full">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or email..."
                    className="h-10 w-full rounded-[6px] border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>

            {isLoading && <TableSkeleton rows={6} columns={4} showHeader={false} />}

            {isError && (
                <div className="w-full rounded-[10px] border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
                    Something went wrong loading candidates.
                </div>
            )}

            {!isLoading && !isError && (
                <CandidatesTable
                    candidates={filteredCandidates}
                    onView={handleViewCandidate}
                    onSuspend={setPendingSuspend}
                    isSuspending={suspendMutation.isPending}
                />
            )}

            <SuspendUserDialog
                user={pendingSuspend}
                open={pendingSuspend !== null}
                onOpenChange={(open) => {
                    if (!open) setPendingSuspend(null);
                }}
                onConfirm={handleConfirmSuspend}
                isPending={suspendMutation.isPending}
            />
        </>
    );
};

export default CandidateManagement;
