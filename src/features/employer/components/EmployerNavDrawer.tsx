import * as Dialog from "@radix-ui/react-dialog";
import { X, LogOut, User, Coins } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useCreditBalance } from "../hooks/useCreditBalance";
import { EMPLOYER_NAV_LINKS } from "../utils/employerNavLinks";
import { formatShortDate } from "@/lib/formatDate";
import { cn } from "@/lib/utils";

interface EmployerNavDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const EmployerNavDrawer = ({ open, onOpenChange }: EmployerNavDrawerProps) => {
    const { user } = useCurrentUser();
    const { logout } = useLogout();
    const { data: creditData, isLoading: isCreditLoading } = useCreditBalance();

    const lastRecharged = creditData?.lastRechargedAt ? formatShortDate(creditData.lastRechargedAt) : "Never";

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
                <Dialog.Content
                    className="fixed inset-y-0 right-0 z-50 flex h-full w-72 flex-col justify-between bg-white px-6 py-6 shadow-xl data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right"
                    aria-describedby={undefined}
                >
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <Dialog.Title className="text-lg font-bold text-black">Menu</Dialog.Title>
                            <Dialog.Close asChild>
                                <button type="button" aria-label="Close menu" className="flex size-6 cursor-pointer items-center justify-center">
                                    <X className="size-5 text-neutral-950" aria-hidden="true" />
                                </button>
                            </Dialog.Close>
                        </div>

                        {/* Navigation links */}
                        <nav aria-label="Employer" className="flex flex-col gap-1">
                            {EMPLOYER_NAV_LINKS.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => onOpenChange(false)}
                                    className={({ isActive }) =>
                                        cn(
                                            "rounded-lg px-3 py-2.5 text-base font-medium transition-colors hover:bg-neutral-50",
                                            isActive ? "bg-primary-50 text-primary-600" : "text-neutral-700",
                                        )
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </nav>

                        {/* Credit balance card (from CreditIndicator) */}
                        <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-3.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Coins className="size-4 text-primary-600" aria-hidden="true" />
                                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Credit balance</span>
                                </div>
                                <span className="text-[11px] text-neutral-400">Recharged: {lastRecharged}</span>
                            </div>
                            <p className="mt-1 text-2xl font-bold tracking-tight text-neutral-950">
                                {isCreditLoading ? "–" : (creditData?.balance ?? 0)}
                            </p>
                        </div>
                    </div>

                    {/* Account section (from UserAvatarMenu) */}
                    <div className="border-t border-neutral-200 pt-4 flex flex-col gap-2">
                        <div className="px-3 py-2">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Account</p>
                                <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-semibold text-primary-600 uppercase tracking-wider">
                                    {user?.role || "Employer"}
                                </span>
                            </div>
                            <p className="mt-1.5 truncate text-sm font-semibold text-black">{user?.fullName || user?.companyName}</p>
                            <p className="truncate text-xs text-neutral-500">{user?.email}</p>
                        </div>

                        <Link
                            to="/employer/profile"
                            onClick={() => onOpenChange(false)}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
                        >
                            <User className="size-4 text-neutral-500" aria-hidden="true" />
                            Profile
                        </Link>

                        <button
                            type="button"
                            onClick={() => {
                                onOpenChange(false);
                                void logout();
                            }}
                            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-base font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                            <LogOut className="size-4 text-red-500" aria-hidden="true" />
                            Log out
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default EmployerNavDrawer;
