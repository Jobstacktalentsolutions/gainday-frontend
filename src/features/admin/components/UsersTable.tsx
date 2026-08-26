import { AdminButton } from "@/components/ui/AdminButton";
import StatusBadge from "./StatusBadge";
import type { AdminUser } from "../types/user";

interface UsersTableProps {
    users: AdminUser[];
    onEdit: (user: AdminUser) => void;
    onSuspend: (user: AdminUser) => void;
    isSuspending: boolean;
}