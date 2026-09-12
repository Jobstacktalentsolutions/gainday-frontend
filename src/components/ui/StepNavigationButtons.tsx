import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";



export interface StepSecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export const StepSecondaryButton = forwardRef<HTMLButtonElement, StepSecondaryButtonProps>(
  ({ className, children = "Save and exit", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-lg border border-neutral-200 bg-white px-4 text-base font-medium text-neutral-600 select-none cursor-pointer outline-none",
          "transition-all duration-200 ease-out",
          // Dark neutral on hover (only when enabled)
          "enabled:hover:border-neutral-900 enabled:hover:bg-neutral-900 enabled:hover:text-white enabled:hover:shadow-sm",
          // Subtle click animation
          "enabled:active:scale-[0.96] enabled:active:translate-y-px enabled:active:bg-neutral-950",
          "focus-visible:ring-2 focus-visible:ring-neutral-400/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

StepSecondaryButton.displayName = "StepSecondaryButton";




const stepContinueButtonVariants = cva(
  [
    "group inline-flex items-center gap-2 rounded-lg bg-primary-500 text-neutral-50 select-none cursor-pointer outline-none",
    "shadow-sm transition-all duration-200 ease-out font-medium",
    "enabled:hover:bg-primary-600 enabled:hover:shadow-md",
    "enabled:active:scale-[0.96] enabled:active:translate-y-px enabled:active:bg-primary-700",
    "focus-visible:ring-3 focus-visible:ring-primary-500/30",
    "disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none",
  ].join(" "),
  {
    variants: {
      size: {
        md: "h-10 py-1 pl-4 pr-1 text-base",
        lg: "h-[52px] py-1 pl-6 pr-1 text-base",
      },
    },
    defaultVariants: { size: "md" },
  }
);

const iconWrapperSize = { md: "size-8", lg: "size-11" } as const;

export interface StepContinueButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof stepContinueButtonVariants> {
  children?: ReactNode;
  icon?: ReactNode;
}

export const StepContinueButton = forwardRef<HTMLButtonElement, StepContinueButtonProps>(
  ({ className, children = "Continue", icon, size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(stepContinueButtonVariants({ size }), className)}
        {...props}
      >
        <span>{children}</span>
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-[8px] bg-secondary-500 text-white transition-colors duration-200 group-enabled:group-hover:bg-secondary-600 group-enabled:group-active:bg-secondary-700",
            iconWrapperSize[size ?? "md"],
          )}
        >
          <span className="flex items-center justify-center group-hover-spiral will-change-transform">
            {icon ?? <ArrowUpRight className="size-5" aria-hidden="true" />}
          </span>
        </span>
      </button>
    );
  }
);

StepContinueButton.displayName = "StepContinueButton";