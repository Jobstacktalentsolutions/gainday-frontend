import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";


/* ────────────────────────────────────────────────────────────
   Variant × Size matrix  (arrows omitted per design spec)
   ──────────────────────────────────────────────────────────── */

const actionButtonVariants = cva(
    // base — shared across every variant & size
    [
        "inline-flex items-center justify-center gap-2 font-medium select-none",
        "rounded-lg transition-all duration-200 outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        "cursor-pointer",
    ].join(" "),
    {
        variants: {
            variant: {
                /* ── 1. Primary  ─────────────────────────────── */
                primary: [
                    "bg-primary-500 text-white",
                    "hover:bg-primary-600",
                    "active:bg-primary-700 active:scale-[0.97]",
                    "focus-visible:ring-3 focus-visible:ring-primary-500/30",
                ].join(" "),

                /* ── 2. Outline  ─────────────────────────────── */
                outline: [
                    "border border-neutral-300 bg-white text-neutral-800",
                    "hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50",
                    "active:bg-primary-100 active:scale-[0.97]",
                    "focus-visible:ring-3 focus-visible:ring-primary-500/30",
                ].join(" "),

                /* ── 3. Ghost / dotted  ──────────────────────── */
                ghost: [
                    "border border-dashed border-neutral-300 bg-transparent text-neutral-700",
                    "hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50",
                    "active:bg-primary-100 active:scale-[0.97]",
                    "focus-visible:ring-3 focus-visible:ring-primary-500/30",
                ].join(" "),

                /* ── 4. Secondary (light purple fill)  ───────── */
                secondary: [
                    "bg-primary-100 text-primary-700",
                    "hover:bg-primary-200",
                    "active:bg-primary-300 active:scale-[0.97]",
                    "focus-visible:ring-3 focus-visible:ring-primary-500/30",
                ].join(" "),
            },

            size: {
                sm: "h-9 px-4 text-sm",
                md: "h-10 px-5 text-sm",
                lg: "h-12 px-6 text-base w-full",
            },
        },

        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);


/* ────────────────────────────────────────────────────────────
   Component
   ──────────────────────────────────────────────────────────── */

export interface ActionButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof actionButtonVariants> {
    /** Optional icon rendered before the label */
    startIcon?: ReactNode;
    /** Optional icon rendered after the label */
    endIcon?: ReactNode;
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
    ({ className, variant, size, startIcon, endIcon, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(actionButtonVariants({ variant, size }), className)}
                {...props}
            >
                {startIcon && (
                    <span className="flex shrink-0 items-center">{startIcon}</span>
                )}
                {children}
                {endIcon && (
                    <span className="flex shrink-0 items-center">{endIcon}</span>
                )}
            </button>
        );
    }
);

ActionButton.displayName = "ActionButton";
