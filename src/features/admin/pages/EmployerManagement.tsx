import { useMemo, useState } from "react";
import { useEmployers, useSuspendEmployer, useUpdateEmployer } from "../hooks/useEmployers";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import EmployersTable from "../components/EmployersTable";
import SuspendUserDialog from "../components/SuspendUserDialog";
import EditEmployerDialog from "../components/EditEmployerDialog";
import type { AdminEmployer, AdminAccount } from "../types/user";
import type { EmployerEditFormValues } from "../schemas/employerEditSchema";

const EmployerManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebouncedValue(searchTerm, 200);
    const [pendingSuspend, setPendingSuspend] = useState<AdminAccount | null>(null);
    const [editingEmployer, setEditingEmployer] = useState<AdminEmployer | null>(null);

    const { data: employers, isLoading, isError } = useEmployers();
    const suspendMutation = useSuspendEmployer();
    const updateMutation = useUpdateEmployer();

    const filteredEmployers = useMemo(() => {
        if (!employers) return [];
        const query = debouncedSearch.trim().toLowerCase();
        if (!query) return employers;
        return employers.filter(
            (employer) =>
                employer.name.toLowerCase().includes(query) ||
                employer.email.toLowerCase().includes(query) ||
                employer.employerProfile.companyName.toLowerCase().includes(query)
        );
    }, [employers, debouncedSearch]);

    const handleConfirmSuspend = (account: AdminAccount) => {
        suspendMutation.mutate(account.id, {
            onSuccess: () => setPendingSuspend(null),
        });
    };

    const handleSaveEmployer = (userId: string, values: EmployerEditFormValues) => {
        updateMutation.mutate(
            { userId, values },
            { onSuccess: () => setEditingEmployer(null) }
        );
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

            {isLoading && (
                <div className="w-full rounded-[10px] border border-neutral-200 bg-white px-5 py-10 text-center text-sm text-neutral-500">
                    Loading employers...
                </div>
            )}

            {isError && (
                <div className="w-full rounded-[10px] border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
                    Something went wrong loading employers.
                </div>
            )}

            {!isLoading && !isError && (
                <EmployersTable
                    employers={filteredEmployers}
                    onEdit={setEditingEmployer}
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

            <EditEmployerDialog
                user={editingEmployer}
                open={editingEmployer !== null}
                onOpenChange={(open) => !open && setEditingEmployer(null)}
                onSave={handleSaveEmployer}
                isSaving={updateMutation.isPending}
            />
        </>
    );
};

export default EmployerManagement;
