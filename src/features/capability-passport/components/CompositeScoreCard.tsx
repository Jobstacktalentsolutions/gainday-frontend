import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatShortDate } from "@/lib/formatDate";
import ScoreHistoryBars from "./ScoreHistoryBars";
import { PASSPORT_MAX_SCORE } from "../utils/passport";
import type { CapabilityPassportSummary } from "../types/passport";

const RING_SIZE = 160;
const RING_STROKE = 8;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

type CompositeScoreCardProps = Pick<
    CapabilityPassportSummary,
    "compositeScore" | "compositeDelta" | "verifiedSimulationCount" | "lastUpdated" | "history"
>;

const CompositeScoreCard = ({
    compositeScore,
    compositeDelta,
    verifiedSimulationCount,
    lastUpdated,
    history,
}: CompositeScoreCardProps) => {
    const ratio = Math.min(1, Math.max(0, compositeScore / PASSPORT_MAX_SCORE));

    return (
        <section className="flex w-full flex-col items-center gap-8 rounded-xl bg-white p-6">
            <div className="flex w-full items-center gap-2">
                <ShieldCheck className="size-6 shrink-0 text-primary-500" aria-hidden="true" />
                <p className="text-sm uppercase text-neutral-700">
                    Verified · {verifiedSimulationCount} {verifiedSimulationCount === 1 ? "simulation" : "simulations"}
                </p>
            </div>

            <div className="flex w-full flex-col items-center gap-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative" style={{ width: RING_SIZE, height: RING_SIZE }}>
                        <svg
                            width={RING_SIZE}
                            height={RING_SIZE}
                            viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
                            className="-rotate-90"
                            role="img"
                            aria-label={`Composite capability score ${compositeScore} out of ${PASSPORT_MAX_SCORE}`}
                        >
                            <circle
                                cx={RING_SIZE / 2}
                                cy={RING_SIZE / 2}
                                r={RING_RADIUS}
                                fill="none"
                                strokeWidth={RING_STROKE}
                                className="stroke-primary-50"
                            />
                            <circle
                                cx={RING_SIZE / 2}
                                cy={RING_SIZE / 2}
                                r={RING_RADIUS}
                                fill="none"
                                strokeWidth={RING_STROKE}
                                strokeLinecap="round"
                                strokeDasharray={RING_CIRCUMFERENCE}
                                strokeDashoffset={RING_CIRCUMFERENCE * (1 - ratio)}
                                className="stroke-primary-500"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                            <p className="text-[32px] leading-9.5 tracking-[-0.32px] text-primary-950">{compositeScore}</p>
                            <p className="text-xs text-neutral-700">COMPOSITE CAPABILITY SCORE</p>
                        </div>
                    </div>

                    {history.length > 1 && (
                        <p className="text-xs text-neutral-400">
                            <span
                                className={cn(
                                    compositeDelta > 0 && "text-success-500",
                                    compositeDelta < 0 && "text-error-500",
                                )}
                            >
                                {compositeDelta > 0 ? `+${compositeDelta}` : compositeDelta}
                            </span>{" "}
                            since last simulation
                        </p>
                    )}
                </div>

                <ScoreHistoryBars history={history} />

                <p className="text-center text-xs text-neutral-300">Last updated {formatShortDate(lastUpdated)}</p>
            </div>
        </section>
    );
};

export default CompositeScoreCard;