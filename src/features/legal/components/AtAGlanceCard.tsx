import { Check, ShieldCheck } from "lucide-react";
import { WHAT_GAINDAY_IS } from "../content/shared";

export const AtAGlanceCard = () => (
    <section
        aria-labelledby="at-a-glance-title"
        className="rounded-2xl border border-primary-100 bg-primary-50/60 p-6 sm:p-8"
    >
        <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-xs">
                <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <h2
                id="at-a-glance-title"
                className="text-xl font-bold tracking-tight text-neutral-900 lg:text-2xl"
            >
                What Gainday is, and what it is not
            </h2>
        </div>

        <ul className="mt-6 flex flex-col gap-3">
            {WHAT_GAINDAY_IS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-7 text-neutral-700">
                    <Check className="mt-1 size-5 shrink-0 text-primary-500" aria-hidden="true" />
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    </section>
);