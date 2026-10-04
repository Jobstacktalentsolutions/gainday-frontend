import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  Shield,
  Layers,
  ShieldAlert,
  CheckSquare,
  Bot,
  ChevronDown,
  LogOut,
} from "lucide-react";
import SidebarNavItem from "./SidebarNavItem";
import { useAuthStore } from "@/features/auth/store/authStore";
import { apiClient } from "@/lib/api/client";
import { cn } from "@/lib/utils";

interface NavGroup {
  id: string;
  label: string;
  icon: typeof Users;
  items: {
    to: string;
    label: string;
    icon: typeof Building2;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: "user-management",
    label: "User Management",
    icon: Users,
    items: [
      { to: "/admin/employer-management", label: "Employer Management", icon: Building2 },
      { to: "/admin/candidate-management", label: "Candidate Management", icon: UserCheck },
      { to: "/admin/admin-management", label: "Admin Management", icon: Shield },
    ],
  },
  {
    id: "content-operations",
    label: "Content & Operations",
    icon: Layers,
    items: [
      { to: "/admin/content-moderation", label: "Content Moderation", icon: ShieldAlert },
      { to: "/admin/generation-reviews", label: "Generation Reviews", icon: CheckSquare },
      { to: "/admin/ai-oversight", label: "AI Oversight", icon: Bot },
    ],
  },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  // Determine initial open groups based on current path
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {
      "user-management": true,
      "content-operations": true,
    };
    return initialState;
  });

  // Auto-expand group if child path is active
  useEffect(() => {
    NAV_GROUPS.forEach((group) => {
      const hasActiveChild = group.items.some((item) =>
        location.pathname.startsWith(item.to)
      );
      if (hasActiveChild) {
        setOpenGroups((prev) => ({ ...prev, [group.id]: true }));
      }
    });
  }, [location.pathname]);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Ignore error and proceed with clearing local auth
    } finally {
      clearAuth();
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <nav className="sticky top-0 flex h-screen w-64 shrink-0 flex-col justify-between overflow-y-auto bg-neutral-900 px-3 py-5 select-none">
      <div className="flex flex-col gap-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-3 py-1">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary-500/20 text-primary-400">
              <Shield className="size-4 text-primary-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-wide">Gainday Admin</p>
              <p className="text-[10px] font-medium text-neutral-400">Control Console</p>
            </div>
          </div>
          <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-[10px] font-semibold text-primary-400 border border-neutral-700">
            PROD
          </span>
        </div>

        <div className="h-px w-full bg-neutral-800" />

        {/* Navigation Sections */}
        <div className="flex flex-col gap-1.5">
          {/* Direct Dashboard Link */}
          <SidebarNavItem
            to="/admin/dashboard"
            label="Dashboard"
            icon={LayoutDashboard}
          />

          {/* Grouped Accordion Sections */}
          {NAV_GROUPS.map((group) => {
            const isOpen = !!openGroups[group.id];
            const hasActiveChild = group.items.some((item) =>
              location.pathname.startsWith(item.to)
            );
            const GroupIcon = group.icon;

            return (
              <div key={group.id} className="flex flex-col">
                {/* Accordion Group Header */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  className={cn(
                    "group flex h-9.5 w-full items-center justify-between rounded-lg px-3.5 text-xs font-semibold uppercase tracking-wider transition-colors outline-none cursor-pointer",
                    hasActiveChild
                      ? "text-neutral-200"
                      : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-300"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <GroupIcon className="size-4 text-neutral-400 transition-colors group-hover:text-neutral-300" />
                    <span>{group.label}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "size-3.5 text-neutral-500 transition-transform duration-200 group-hover:text-neutral-300",
                      isOpen ? "rotate-0" : "-rotate-90"
                    )}
                  />
                </button>

                {/* Collapsible Children */}
                {isOpen && (
                  <div className="mt-1 flex flex-col gap-1 pl-1">
                    {group.items.map((item) => (
                      <SidebarNavItem
                        key={item.to}
                        to={item.to}
                        label={item.label}
                        icon={item.icon}
                        nested
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* User Footer / Logout */}
      <div className="mt-4 border-t border-neutral-800 pt-3 space-y-2">
        <div className="flex items-center gap-3 px-3 py-1">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-neutral-200 border border-neutral-700">
            {user?.fullName?.slice(0, 2).toUpperCase() || "AD"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-neutral-200">
              {user?.fullName || "Gainday Admin"}
            </p>
            <p className="truncate text-[11px] text-neutral-400">{user?.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300 cursor-pointer"
        >
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminSidebar;