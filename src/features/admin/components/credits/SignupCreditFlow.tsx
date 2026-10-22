import { ChevronRight, Gift, LockOpen, SlidersHorizontal, UserPlus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignupCreditFlowProps {
  enabled: boolean;
  creditAmount: number;
}

interface FlowStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

const SignupCreditFlow = ({ enabled, creditAmount }: SignupCreditFlowProps) => {
  const steps: FlowStep[] = [
    {
      icon: SlidersHorizontal,
      title: "You set the bonus",
      description: enabled ? `${creditAmount} credits per employer` : "Bonus is off",
    },
    {
      icon: UserPlus,
      title: "Employer signs up",
      description: "Email or Google account",
    },
    {
      icon: Gift,
      title: "Credits granted once",
      description: enabled ? `${creditAmount} added to their balance` : "Nothing granted",
    },
    {
      icon: LockOpen,
      title: "Unlock candidates",
      description: "1 credit per unlock",
    },
  ];

  return (
    <section className="rounded-lg border border-neutral-200 bg-white px-4 py-3 shadow-xs">
      <div className="mb-3 flex items-baseline gap-2">
        <h2 className="text-xs font-semibold text-neutral-900">How signup credits work</h2>
        <p className="text-[11px] text-neutral-500">Changes apply to employers who sign up after you save</p>
      </div>

      <ol className={cn("grid grid-cols-1 gap-2 md:grid-cols-4", !enabled && "opacity-60")}>
        {steps.map((step, index) => (
          <li key={step.title} className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md bg-neutral-50 px-2.5 py-2">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-[10px] font-semibold text-white">
                {index + 1}
              </span>
              <step.icon className="size-3.5 shrink-0 text-primary-600" aria-hidden="true" />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-neutral-900">{step.title}</p>
                <p className="truncate text-[11px] text-neutral-500">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="hidden size-3.5 shrink-0 text-neutral-300 md:block" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
};

export default SignupCreditFlow;
