import { useState } from "react";
import { cn } from "@/lib/utils";
import StatCard from "../components/StatCard";
import ReviewTrendChart from "../components/reviews/ReviewTrendChart";
import ExperienceReviewsTable from "../components/reviews/ExperienceReviewsTable";
import { useExperienceReviewSummary } from "../hooks/useExperienceReviews";
import type { Timeframe } from "../hooks/useDashboardStats";

const TIMEFRAME_TABS: { id: Timeframe; label: string }[] = [
  { id: "day", label: "24h" },
  { id: "week", label: "7 days" },
  { id: "month", label: "30 days" },
  { id: "year", label: "12 months" },
  { id: "all", label: "All" },
];

const formatAverage = (average: number | null) => (average === null ? "—" : average.toFixed(2));

const pluralize = (count: number, noun: string) => `${count} ${noun}${count === 1 ? "" : "s"}`;

const ExperienceReviews = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>("month");
  const { data, isLoading, isError } = useExperienceReviewSummary(timeframe);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Experience reviews</h1>
        <p className="mt-0.5 text-xs text-neutral-500">
          How candidates and employers rate their experience on Gainday
        </p>
      </div>

      {isError && <p className="py-8 text-center text-sm text-error-600">Couldn't load review stats.</p>}

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-24 animate-pulse rounded-xl bg-neutral-100" />
          ))}
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Average rating (all time)"
            value={formatAverage(data.totals.allTimeAverage)}
            hint={pluralize(data.totals.allTimeCount, "review")}
          />
          <StatCard
            label="Average rating (selected period)"
            value={formatAverage(data.totals.periodAverage)}
            hint={pluralize(data.totals.periodCount, "review")}
          />
          <StatCard label="Reviews in selected period" value={data.totals.periodCount} />
        </div>
      )}

      <section className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900">Average rating over time</h2>
            <p className="text-xs text-neutral-500">Scroll sideways to see earlier periods</p>
          </div>
          <div role="tablist" className="flex flex-wrap gap-1 rounded-lg bg-neutral-100 p-1">
            {TIMEFRAME_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={timeframe === tab.id}
                onClick={() => setTimeframe(tab.id)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  timeframe === tab.id ? "bg-white text-neutral-900 shadow-xs" : "text-neutral-500 hover:text-neutral-800",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading && <div className="h-64 animate-pulse rounded-lg bg-neutral-100" />}
        {data && <ReviewTrendChart series={data.series} />}
      </section>

      <ExperienceReviewsTable />
    </div>
  );
};

export default ExperienceReviews;
