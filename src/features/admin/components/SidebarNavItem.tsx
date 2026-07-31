import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";


interface SidebarNavItemProps {
    to : string;
    label : string;
}

const SidebarNavItem = ({to, label} : SidebarNavItemProps) => {
    return(
        <NavLink
        to = {to}
        className={({isActive}) => cn(
            "flex h-10 w-full items-center gap-2.5 rounded-md px-4 py-2.5 text-sm",
            isActive 
            ? "bg-neutral-800 font-semibold text-neutral-100"
            : "font-medium text-neutral-400 hover:text-neutral"
        )}
        >
            {({ isActive }) => (
                <>
                <span
                className = {cn (
                    "size-1.5 shrink-0 rounded-full",
                    isActive ? "bg-primary-500" : "bg-neutral-400"
                )}
                />
                {label}
                </>
            )}

        </NavLink>
    );
}

export default SidebarNavItem;