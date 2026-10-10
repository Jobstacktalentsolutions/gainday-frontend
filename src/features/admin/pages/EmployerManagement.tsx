import { useMemo, useState } from "react";
import { useEmployers, useSuspendEmployer, useUnsuspendEmployer, useUpdateEmployer } from "../hooks/useEmployers";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import EmployersTable from "../components/EmployersTable";
import SuspendUserDialog from "../components/SuspendUserDialog";
import UnsuspendUserDialog from "../components/UnsuspendUserDialog";
import EditEmployerDialog from "../components/EditEmployerDialog";
import { TableLoadMore } from "../components/TableLoadMore";
import type { AdminEmployer, AdminAccount } from "../types/user";
import type { EmployerEditFormValues } from "../schemas/employerEditSchema";
import { TableSkeleton } from "../components/skeletons";

const EmployerManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebouncedValue(searchTerm, 300);
    const [pendingSuspend, setPendingSuspend] = useState<AdminAccount | null>(null);
    const [pendingUnsuspend, setPendingUnsuspend] = useState<AdminAccount | null>(null);
    const [dialogEmployer, setDialogEmployer] = useState<AdminEmployer | null>(null);
    const [dialogMode, setDialogMode] = useState<"view" | "edit">("view");

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useEmployers({ search: debouncedSearch, limit: 10 });

    const suspendMutation = useSuspendEmployer();
    const unsuspendMutation = useUnsuspendEmployer();
    const updateMutation = useUpdateEmployer();

    const allEmployers = useMemo(
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

    const handleSaveEmployer = (userId: string, values: EmployerEditFormValues) => {
        updateMutation.mutate(
            { userId, values },
            { onSuccess: () => setDialogEmployer(null) }
        );
    };

    const handleViewEmployer = (employer: AdminEmployer) => {
        setDialogEmployer(employer);
        setDialogMode("view");
    };

    const handleEditEmployer = (employer: AdminEmployer) => {
        setDialogEmployer(employer);
        setDialogMode("edit");
    };

    return (
        <>
            <h1 className="text-2xl font-semibold text-neutral-900">
                Employer Management
            </h1>

            <div className="w-full">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, email, or company..."
                    className="h-10 w-full rounded-[6px] border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>

            {isLoading && <TableSkeleton rows={6} columns={5} showHeader={false} />}

            {isError && (
                <div className="w-full rounded-[10px] border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
                    Something went wrong loading employers.
                </div>
            )}

            {!isLoading && !isError && (
                <div className="flex flex-col gap-3">
                    <EmployersTable
                        employers={allEmployers}
                        onView={handleViewEmployer}
                        onEdit={handleEditEmployer}
                        onSuspend={setPendingSuspend}
                        onUnsuspend={setPendingUnsuspend}
                        isSuspending={suspendMutation.isPending}
                        isUnsuspending={unsuspendMutation.isPending}
                    />

                    <TableLoadMore
                        currentCount={allEmployers.length}
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

            <EditEmployerDialog
                user={dialogEmployer}
                open={dialogEmployer !== null}
                onOpenChange={(open) => !open && setDialogEmployer(null)}
                onSave={handleSaveEmployer}
                isSaving={updateMutation.isPending}
                initialMode={dialogMode}
            />
        </>
    );
};

export default EmployerManagement;
