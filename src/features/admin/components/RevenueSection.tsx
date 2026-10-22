import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Coins } from "lucide-react";
import { useCreditRevenue } from "../hooks/useCreditRevenue";
import type { Timeframe } from "../hooks/useDashboardStats";
import { formatAmountForCurrency, formatRevenue } from "../utils/money";
import type { CreditRevenue, CreditRevenueSeriesPoint } from "../types/credits";

interface RevenueSectionProps {
  timeframe: Timeframe;
}

const PERIOD_LABELS: Record<Timeframe, string> = {
  day: "last 24 hours",
  week: "last 7 days",
  month: "last 30 days",
  year: "last 12 months",
  all: "last 12 months",
};

// The chart plots USD when a rate is configured, otherwise GBP. `usd` is null exactly when no
// rate is configured, so the same check picks the value and the currency.
const chartValue = (pence: number, usd: number | null) => (usd === null ? pence / 100 : usd);

const RevenueSection = ({ timeframe }: RevenueSectionProps) => {
  const { data, isLoading, isError } = useCreditRevenue(timeframe);

  return (
    <section className="flex flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Coins className="size-4" />
            </div>
            <h2 className="text-sm font-semibold text-neutral-900">Revenue</h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">Collected from credit packs, {PERIOD_LABELS[timeframe]}</p>
        </div>
        {data && <RevenueKpi data={data} />}
      </div>

      {isLoading && <div className="h-64 animate-pulse rounded-lg bg-neutral-100" />}
      {isError && <p className="py-12 text-center text-sm text-error-600">Couldn't load revenue.</p>}
      {data && (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.series.map((point) => ({ ...point, value: chartValue(point.pence, point.usd) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                width={64}
                tickFormatter={(value: number) =>
                  formatAmountForCurrency(value, data.usdRate === null ? "GBP" : "USD")
                }
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                formatter={(value, _name, item) => {
                  const { purchases } = item.payload as CreditRevenueSeriesPoint;
                  return [
                    formatAmountForCurrency(Number(value), data.usdRate === null ? "GBP" : "USD"),
                    `${purchases} purchase${purchases === 1 ? "" : "s"}`,
                  ];
                }}
              />
              <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

const RevenueKpi = ({ data }: { data: CreditRevenue }) => {
  const period = formatRevenue(data.totals.periodPence, data.totals.periodUsd);
  const allTime = formatRevenue(data.totals.allTimePence, data.totals.allTimeUsd);

  return (
    <div className="flex flex-col gap-1 sm:items-end">
      <p className="text-2xl font-bold tabular-nums text-neutral-900">{period.primary}</p>
      <p className="text-xs text-neutral-500">{period.secondary}</p>
      <p className="text-xs text-neutral-500">
        {data.totals.periodPurchases} purchase{data.totals.periodPurchases === 1 ? "" : "s"} · All time {allTime.primary}
      </p>
    </div>
  );
};

export default RevenueSection;
