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

    const handleEdit = (users : AdminUser) => {
        //Open edit modal/drawer once the flow is ready
        console.log("Edit user", users.id);
    }

    
}