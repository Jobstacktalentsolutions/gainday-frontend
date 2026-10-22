import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { ROLE_DASHBOARD_PATHS } from "@/features/auth/utils/roleDashboard";
import { actionButtonVariants } from "@/components/ui/ActionButton";
import { cn } from "@/lib/utils";

// Navigates to the signed-in user's role dashboard. Renders nothing for unknown roles.
export const ViewDashboardButton = () => {
    const { user } = useCurrentUser();
    const navigate = useNavigate();
    const dashboardPath = user ? ROLE_DASHBOARD_PATHS[user.role] : undefined;

    if (!dashboardPath) return null;

    return (
        <button
            type="button"
            onClick={() => navigate(dashboardPath)}
            className={cn(
                actionButtonVariants({ variant: "outline", size: "sm" }),
                "w-auto rounded-xl px-4"
            )}
        >
            <LayoutDashboard className="size-4" aria-hidden="true" />
            View dashboard
        </button>
    );
};
