import { useMemo, useState } from "react";
import { useAdmins, useSuspendAdmin } from "../hooks/useAdmins";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import CandidatesTable from "../components/CandidatesTable";
import SuspendUserDialog from "../components/SuspendUserDialog";
import type { AdminAccount } from "../types/user";

const AdminManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebouncedValue(searchTerm, 200);
    const [pendingSuspend, setPendingSuspend] = useState<AdminAccount | null>(null);

    const { data: admins, isLoading, isError } = useAdmins();
    const suspendMutation = useSuspendAdmin();

    const filteredAdmins = useMemo(() => {
        if (!admins) return [];
        const query = debouncedSearch.trim().toLowerCase();
        if (!query) return admins;
        return admins.filter(
            (admin) =>
                admin.name.toLowerCase().includes(query) ||
                admin.email.toLowerCase().includes(query)
        );
    }, [admins, debouncedSearch]);

    const handleConfirmSuspend = (account: AdminAccount) => {
        suspendMutation.mutate(account.id, {
            onSuccess: () => setPendingSuspend(null),
        });
    };

    return (
        <>
            <h1 className="text-2xl font-semibold text-neutral-900">
                Admin Management
            </h1>

            <div className="w-full">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search admins by name or email..."
                    className="h-10 w-full rounded-[6px] border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>

            {isLoading && (
                <div className="w-full rounded-[10px] border border-neutral-200 bg-white px-5 py-10 text-center text-sm text-neutral-500">
                    Loading admins...
                </div>
            )}

            {isError && (
                <div className="w-full rounded-[10px] border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
                    Something went wrong loading admins.
                </div>
            )}

            {!isLoading && !isError && (
                <CandidatesTable
                    candidates={filteredAdmins}
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

export default AdminManagement;
