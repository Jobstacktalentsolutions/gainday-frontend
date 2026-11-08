import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ScoreBar from "@/components/ui/ScoreBar";
import type { PassportDomain } from "../types/passport";

interface ParsedDomain {
    id: string;
    category: string;
    subCategory: string;
    simulationCount: number;
    score: number;
}

const INITIAL_DISPLAY_COUNT = 4;

function parseDomain(domain: PassportDomain): ParsedDomain {
    const parts = domain.name.split(/\s*>\s*/);
    if (parts.length >= 2) {
        return {
            id: domain.id,
            category: parts[0].trim(),
            subCategory: parts.slice(1).join(" > ").trim(),
            simulationCount: domain.simulationCount,
            score: domain.score,
        };
    }
    return {
        id: domain.id,
        category: "",
        subCategory: domain.name.trim(),
        simulationCount: domain.simulationCount,
        score: domain.score,
    };
}

const DomainBreakdownCard = ({ domains }: { domains: PassportDomain[] }) => {
    const [expanded, setExpanded] = useState(false);

    // Ranked leaderboard: sorted by score descending, then by simulationCount descending
    const sorted = [...domains]
        .map(parseDomain)
        .sort((a, b) => b.score - a.score || b.simulationCount - a.simulationCount);

    const displayed = expanded ? sorted : sorted.slice(0, INITIAL_DISPLAY_COUNT);

    return (
        <section className="flex w-full flex-col gap-5 rounded-xl bg-white px-6 py-6 sm:py-8">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-primary-500">
                    Domain breakdown
                </h2>
                {domains.length > 0 && (
                    <span className="text-xs font-medium text-neutral-400">
                        Ranked by score
                    </span>
                )}
            </div>

            {sorted.length === 0 ? (
                <p className="text-base text-neutral-500">No domain results yet.</p>
            ) : (
                <>
                    <div className="flex flex-col divide-y divide-neutral-100">
                        {displayed.map((item, index) => (
                            <div
                                key={item.id}
                                className="flex flex-col justify-between gap-3 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                            >
                                {/* Left: Rank, Sub-domain name, Category tag, Simulation count */}
                                <div className="flex min-w-0 items-center gap-3">
                                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-500">
                                        {index + 1}
                                    </span>
                                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                                        <p className="truncate text-base font-semibold text-neutral-900">
                                            {item.subCategory}
                                        </p>
                                        {item.category && (
                                            <span className="inline-flex items-center rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                                                {item.category}
                                            </span>
                                        )}
                                        <span className="text-xs text-neutral-400">
                                            • {item.simulationCount} {item.simulationCount === 1 ? "simulation" : "simulations"}
                                        </span>
                                    </div>
                                </div>

                                {/* Right: Score Progress Bar + Score Value */}
                                <div className="flex w-full shrink-0 items-center justify-between gap-3 self-end sm:w-auto sm:justify-end sm:self-auto">
                                    <div className="w-28 sm:w-36">
                                        <ScoreBar score={item.score} label={`${item.subCategory} score`} />
                                    </div>
                                    <div className="w-14 text-right">
                                        <span className="text-base font-bold text-neutral-900">{item.score}</span>
                                        <span className="text-xs text-neutral-400">/100</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {sorted.length > INITIAL_DISPLAY_COUNT && (
                        <div className="flex justify-center border-t border-neutral-100 pt-3">
                            <button
                                type="button"
                                onClick={() => setExpanded((prev) => !prev)}
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                            >
                                <span>
                                    {expanded
                                        ? "Show less"
                                        : `Show all ${sorted.length} domains`}
                                </span>
                                {expanded ? (
                                    <ChevronUp className="size-3.5 text-neutral-500" />
                                ) : (
                                    <ChevronDown className="size-3.5 text-neutral-500" />
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default DomainBreakdownCard;
