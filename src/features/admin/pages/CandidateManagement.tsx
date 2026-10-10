import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCandidates, useSuspendCandidate, useUnsuspendCandidate } from "../hooks/useCandidates";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import CandidatesTable from "../components/CandidatesTable";
import SuspendUserDialog from "../components/SuspendUserDialog";
import UnsuspendUserDialog from "../components/UnsuspendUserDialog";
import { TableLoadMore } from "../components/TableLoadMore";
import type { AdminAccount, AdminCandidate } from "../types/user";
import { TableSkeleton } from "../components/skeletons";

const CandidateManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebouncedValue(searchTerm, 300);
    const [pendingSuspend, setPendingSuspend] = useState<AdminAccount | null>(null);
    const [pendingUnsuspend, setPendingUnsuspend] = useState<AdminAccount | null>(null);

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useCandidates({ search: debouncedSearch, limit: 10 });

    const suspendMutation = useSuspendCandidate();
    const unsuspendMutation = useUnsuspendCandidate();

    const allCandidates = useMemo(
        () => data?.pages.flatMap((page) => page.items) ?? [],
        [data]
    );
    const totalCount = data?.pages[0]?.pagination.total ?? 0;

    const handleConfirmSuspend = (account: AdminAccount, reason: string) => {
        suspendMutation.mutate(
            { id: account.id, reason },
            {
                onSuccess: () => setPendingSuspend(null),
            }
        );
    };

    const handleConfirmUnsuspend = (account: AdminAccount) => {
        unsuspendMutation.mutate(account.id, {
            onSuccess: () => setPendingUnsuspend(null),
        });
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
                <div className="flex flex-col gap-3">
                    <CandidatesTable
                        candidates={allCandidates}
                        onView={handleViewCandidate}
                        onSuspend={setPendingSuspend}
                        onUnsuspend={setPendingUnsuspend}
                        isSuspending={suspendMutation.isPending}
                        isUnsuspending={unsuspendMutation.isPending}
                    />

                    <TableLoadMore
                        currentCount={allCandidates.length}
                        totalCount={totalCount}
                        hasNextPage={hasNextPage}
                        isLoading={isFetchingNextPage}
                        onLoadMore={() => fetchNextPage()}
                    />
                </div>
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

            <UnsuspendUserDialog
                user={pendingUnsuspend}
                open={pendingUnsuspend !== null}
                onOpenChange={(open) => {
                    if (!open) setPendingUnsuspend(null);
                }}
                onConfirm={handleConfirmUnsuspend}
                isPending={unsuspendMutation.isPending}
            />
        </>
    );
};

export default CandidateManagement;
