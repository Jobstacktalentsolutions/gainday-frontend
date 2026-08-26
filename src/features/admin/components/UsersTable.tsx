import { AdminButton } from "@/components/ui/AdminButton";
import StatusBadge from "./StatusBadge";
import type { AdminUser } from "../types/user";

interface UsersTableProps {
    users: AdminUser[];
    onEdit: (user: AdminUser) => void;
    onSuspend: (user: AdminUser) => void;
    isSuspending: boolean;
}

const UsersTable = ({ users, onEdit, onSuspend, isSuspending }: UsersTableProps) => {
    if (users.length === 0) {
        return (
            <div className="w-full rounded-[10px] border border-neutral-200 bg-white px-5 py-10 text-center text-sm text-neutral-500">
                No users match your search.
            </div>
        );
    }

    
}