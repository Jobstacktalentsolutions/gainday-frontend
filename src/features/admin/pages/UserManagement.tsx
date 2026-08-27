import { useMemo, useState } from "react";
import { useUsers, useSuspendUser } from "../hooks/useUsers";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import UsersTable from "../components/UsersTable";
import SuspendUserDialog from "../components/SuspendUserDialog";
import type { AdminUser } from "../types/user";


const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebouncedValue(searchTerm, 200);
    const [pendingSuspendUser, setPendingSuspendUser] = useState<AdminUser | null>(null);

    const { data: users, isLoading, isError } = useUsers();
    const suspendMutation = useSuspendUser();

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        const query = debouncedSearch.trim().toLowerCase();
        if (!query) return users;
        return users.filter(
            (user) =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
        );
    }, [users, debouncedSearch]);

    const handleEdit = (users: AdminUser) => {
        //Open edit modal/drawer once the flow is ready
        console.log("Edit user", users.id);
    }

    const handleConfirmSuspend = (user: AdminUser) => {
        suspendMutation.mutate(user.id, {
            onSuccess: () => setPendingSuspendUser(null),
        })
    };

    return (
        <>
            <h1 className="text-2xl font-semibold text-neutral-900">
                User Management
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
            {isLoading && (
                <div className="w-full rounded-[10px] border border-neutral-200 bg-white px-5 py-10 text-center text-sm text-neutral-500">
                    Loading users...
                </div>
            )}

            {isError && (
                <div className="w-full rounded-[10px] border border-error-200 bg-error-50 px-5 py-10 text-center text-sm text-error-600">
                    Something went wrong loading users.
                </div>
            )}


        </>
    )


}

export default UserManagement;