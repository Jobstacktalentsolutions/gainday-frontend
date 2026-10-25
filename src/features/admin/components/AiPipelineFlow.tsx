import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  SlidersHorizontal,
  Bot,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PipelineStep {
  icon: LucideIcon;
  stepNumber: number;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    stepNumber: 1,
    icon: Sparkles,
    title: "Role Synthesis",
    badge: "Auto-Generate",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    description: "AI extracts skills & requirements from employer jobs to synthesize realistic workplace task drafts.",
  },
  {
    stepNumber: 2,
    icon: ShieldCheck,
    title: "Critic & Validation",
    badge: "Automated QA",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    description: "Evaluator models grade drafted tasks. Slots failing automated rubrics escalate to Human Review.",
  },
  {
    stepNumber: 3,
    icon: SlidersHorizontal,
    title: "Simulation Registry",
    badge: "Live Governance",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "Verified simulations go live for candidate testing. Admins can override task counts or force regeneration.",
  },
  {
    stepNumber: 4,
    icon: Bot,
    title: "Candidate Scoring",
    badge: "Telemetry & Retry",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    description: "Completed simulations are scored by AI. Timeouts, rate limits, or errors route to the Scoring Fallback queue.",
  },
];

interface AiPipelineFlowProps {
  className?: string;
  defaultExpanded?: boolean;
}

export const AiPipelineFlow = ({
  className,
  defaultExpanded = true,
}: AiPipelineFlowProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <section
      className={cn(
        "rounded-xl border border-neutral-200 bg-white p-4.5 shadow-xs transition-all",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
            <Sparkles className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-neutral-900">
                AI Engine Architecture & Lifecycle
              </h2>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                Pipeline Guide
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              How simulations are auto-generated, validated by critic models, deployed to candidates, and scored
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          {isExpanded ? (
            <>
              <span>Collapse guide</span>
              <ChevronUp className="size-3.5 text-neutral-400" />
            </>
          ) : (
            <>
              <span>Show architecture</span>
              <ChevronDown className="size-3.5 text-neutral-400" />
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <ol className="mt-4 grid grid-cols-1 gap-2.5 md:grid-cols-4 pt-4 border-t border-neutral-100">
          {PIPELINE_STEPS.map((step, index) => (
            <li key={step.title} className="flex items-center gap-2">
              <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-lg border border-neutral-150 bg-neutral-50/70 p-3 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
                      {step.stepNumber}
                    </span>
                    <step.icon className="size-4 shrink-0 text-primary-600" />
                    <span className="text-xs font-bold text-neutral-900 truncate">
                      {step.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold",
                      step.badgeColor
                    )}
                  >
                    {step.badge}
                  </span>
                </div>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < PIPELINE_STEPS.length - 1 && (
                <ChevronRight
                  className="hidden size-4 shrink-0 text-neutral-300 md:block"
                  aria-hidden="true"
                />
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};

export default AiPipelineFlow;
