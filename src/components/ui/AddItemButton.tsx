import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AddItemButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode;
    icon?: ReactNode;
}

const AddItemButton = forwardRef<HTMLButtonElement, AddItemButtonProps>(
    ({ className, children = "Add item", icon, type = "button", ...props }, ref) => {
        return (
            <button
                ref={ref}
                type={type}
                className={cn(
                    "group inline-flex h-10 items-center gap-2 rounded-lg bg-primary-500 py-1 pl-4 pr-1 text-base font-medium text-neutral-50 select-none cursor-pointer outline-none",
                    "shadow-md transition-all duration-200 ease-out",
                    "enabled:hover:bg-primary-600 enabled:hover:shadow-md",
                    "enabled:active:scale-[0.96] enabled:active:translate-y-px enabled:active:bg-primary-700",
                    "focus-visible:ring-3 focus-visible:ring-primary-500/30",
                    "disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none",
                    className
                )}
                {...props}
            >
                <span>{children}</span>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-secondary-500 text-white transition-colors duration-200 group-enabled:group-hover:bg-secondary-600 group-enabled:group-active:bg-secondary-700">
                    <span className="flex items-center justify-center group-hover-spiral will-change-transform">
                        {icon ?? <Plus className="size-4" aria-hidden="true" />}
                    </span>
                </span>
            </button>
        );
    }
);

AddItemButton.displayName = "AddItemButton";

export default AddItemButton;
