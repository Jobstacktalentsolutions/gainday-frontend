import { useState } from "react";
import { Menu, Bell } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import EmployerNavDrawer from "./EmployerNavDrawer";
import BrandLogo from "@/assets/gainday icon.svg";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

const DESKTOP_NAV_ITEMS = [
    { to: "/employer/dashboard", label: "Dashboard" },
    { to: "/employer/jobs", label: "Your jobs" },
];

const EmployerTopNav = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { user } = useCurrentUser();

    return (
        <>
            <header className="fixed left-0 top-0 z-40 flex w-full items-center justify-between border-t border-t-white/25 border-b border-b-white/15 bg-white/70 px-6 py-3.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_-1px_0_0_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.06)] backdrop-blur-xs lg:px-12 xl:px-20">
                {/* Left: Brand logo */}
                <span>
                    <img
                        src={BrandLogo}
                        alt="Brand logo"
                    />
                </span>

                {/* Center: Desktop navigation links */}
                <nav className="hidden items-center gap-6 lg:flex">
                    {DESKTOP_NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                cn(
                                    "text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-950",
                                    isActive && "text-neutral-950"
                                )
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Right: employer name + bell + hamburger (mobile) */}
                <div className="flex items-center gap-3">
                    {user?.companyName && (
                        <div className="flex items-center gap-1.5">
                            <div className="size-4 rounded-sm border-[3px] border-neutral-950" aria-hidden="true" />
                            <span className="text-sm font-bold text-neutral-950">
                                {user.companyName}
                            </span>
                        </div>
                    )}
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary-50">
                        <Bell className="size-4 text-primary-500" aria-hidden="true" />
                    </span>
                    {/* Hamburger: mobile only */}
                    <button
                        type="button"
                        onClick={() => setIsDrawerOpen(true)}
                        aria-label="Open menu"
                        className="flex size-6 items-center justify-center lg:hidden"
                    >
                        <Menu className="size-6 text-neutral-950" aria-hidden="true" />
                    </button>
                </div>
            </header>
            <EmployerNavDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
        </>
    );
}

export default EmployerTopNav;