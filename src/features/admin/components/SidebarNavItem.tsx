import { NavLink } from "react-router-dom";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  to: string;
  label: string;
  icon?: LucideIcon;
  nested?: boolean;
}

const SidebarNavItem = ({ to, label, icon: Icon, nested = false }: SidebarNavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "group relative flex h-9.5 w-full items-center gap-2.5 rounded-lg text-sm font-medium transition-all duration-200 outline-none",
          nested ? "pl-9 pr-3 text-[13px]" : "px-3.5",
          isActive
            ? "bg-neutral-800 text-white font-semibold shadow-xs"
            : "text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span
              className="absolute left-1 top-2 bottom-2 w-1 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
              aria-hidden="true"
            />
          )}

          {Icon ? (
            <Icon
              className={cn(
                "size-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-primary-400" : "text-neutral-400 group-hover:text-neutral-300"
              )}
            />
          ) : (
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full transition-transform duration-200 group-hover:scale-125",
                isActive ? "bg-primary-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]" : "bg-neutral-500 group-hover:bg-neutral-400"
              )}
            />
          )}

          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
};

export default SidebarNavItem;