import * as Dialog from "@radix-ui/react-dialog"
import { X, LogOut } from "lucide-react"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser"
import { useLogout } from "@/features/auth/hooks/useLogout"


interface EmployerNavDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const NAV_ITEMS = [
    { to: "/employer/dashboard", label: "Dashboard" },
    { to: "/employer/jobs", label: "Your jobs" }
]

const EmployerNavDrawer = ({ open, onOpenChange }: EmployerNavDrawerProps) => {
    const { user } = useCurrentUser();
    const { logout } = useLogout();

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
                <Dialog.Content
                    className="fixed inset-y-0 right-0 z-50 flex h-full w-70 flex-col gap-8 bg-white px-6 py-6 shadow-xl data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right"
                    aria-describedby={undefined}
                >
                    <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-bold text-black">Menu</Dialog.Title>
                        <Dialog.Close asChild>
                            <button type="button" aria-label="Close menu" className="flex size-6 items-center justify-center">
                                <X className="size-5 text-neutral-950" aria-hidden="true" />
                            </button>
                        </Dialog.Close>
                    </div>

                    <nav className="flex flex-col gap-1 flex-1">
                        {
                            NAV_ITEMS.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => onOpenChange(false)}
                                    className={({ isActive }) =>
                                        cn("rounded-lg px-3 py-2 text-base text-neutral-700", isActive && "bg-primary-50 text-primary-500")
                                    }
                                >
                                    {item.label}
                                </NavLink>
                            ))
                        }
                    </nav>

                    <div className="border-t border-neutral-200 pt-6 flex flex-col gap-4">
                        <div className="px-3 py-2">
                            <p className="text-xs text-neutral-400 uppercase font-medium tracking-wide">Account</p>
                            <p className="text-sm font-medium text-black mt-2">{user?.fullName}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{user?.email}</p>
                        </div>

                        <button
                            onClick={() => {
                                logout();
                                onOpenChange(false);
                            }}
                            className="flex items-center gap-2 px-3 py-2 text-base text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <LogOut className="size-4" />
                            Sign out
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default EmployerNavDrawer;