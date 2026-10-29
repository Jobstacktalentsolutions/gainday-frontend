import { useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity } from "lucide-react";
import { useVisitorActivity, type AudienceCounts, type VisitorActivity } from "../hooks/useVisitorActivity";
import type { Timeframe } from "../hooks/useDashboardStats";

interface VisitorActivitySectionProps {
  timeframe: Timeframe;
}

type Metric = "DAU" | "MAU";
type AudienceKey = keyof AudienceCounts;

const PERIOD_LABELS: Record<Timeframe, string> = {
  day: "last 7 days",
  week: "last 7 days",
  month: "last 30 days",
  year: "last 12 months",
  all: "all time",
};

const METRICS: { value: Metric; label: string }[] = [
  { value: "DAU", label: "Daily active" },
  { value: "MAU", label: "Monthly active" },
];

const AUDIENCES: { value: AudienceKey; label: string }[] = [
  { value: "total", label: "All" },
  { value: "anonymous", label: "Anonymous" },
  { value: "jobSeeker", label: "Job seekers" },
  { value: "employer", label: "Employers" },
];

// One colour per audience, shared by the filter dots and the chart lines.
const AUDIENCE_COLOURS: Record<AudienceKey, string> = {
  total: "#0f172a",
  anonymous: "#64748b",
  jobSeeker: "#8b5cf6",
  employer: "#3b82f6",
};

/** A compact figure for this section. The page-level StatCard is sized for the main KPI row. */
const MiniStat = ({ label, value, hint }: { label: string; value: number; hint: string }) => (
  <div className="flex flex-col gap-0.5 rounded-lg border border-neutral-200 px-3 py-2">
    <span className="text-[11px] font-medium text-neutral-500">{label}</span>
    <span className="text-lg font-semibold tabular-nums text-neutral-900">{value.toLocaleString()}</span>
    <span className="text-[11px] text-neutral-500">{hint}</span>
  </div>
);

const tooltipStyle = {
  background: "rgba(23, 23, 23, 0.95)",
  border: "none",
  borderRadius: 8,
  color: "#fff",
  fontSize: 12,
};

const pillClass = (active: boolean) =>
  `rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
    active
      ? "border-neutral-900 bg-neutral-900 text-white"
      : "border-neutral-200 text-neutral-600 hover:bg-neutral-100"
  }`;

const VisitorActivitySection = ({ timeframe }: VisitorActivitySectionProps) => {
  const { data, isLoading, isError } = useVisitorActivity(timeframe);
  const [metric, setMetric] = useState<Metric>("DAU");
  const [audience, setAudience] = useState<AudienceKey>("total");

  // Daily numbers exist only for the short timeframes; longer ones are monthly, so DAU is unavailable.
  const dailyAvailable = timeframe === "day" || timeframe === "week" || timeframe === "month";
  const activeMetric: Metric = !dailyAvailable && metric === "DAU" ? "MAU" : metric;

  return (
    <section className="flex flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-sky-50 p-2 text-sky-600">
              <Activity className="size-4" />
            </div>
            <h2 className="text-sm font-semibold text-neutral-900">Visitors</h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">Everyone who used the platform, {PERIOD_LABELS[timeframe]}</p>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Metric">
            {METRICS.map(({ value, label }) => {
              const disabled = value === "DAU" && !dailyAvailable;
              return (
                <button
                  key={value}
                  type="button"
                  disabled={disabled}
                  title={disabled ? "Daily numbers are shown for up to 30 days" : undefined}
                  aria-pressed={activeMetric === value}
                  onClick={() => setMetric(value)}
                  className={pillClass(activeMetric === value)}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Audience">
            {AUDIENCES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                aria-pressed={audience === value}
                onClick={() => setAudience(value)}
                className={pillClass(audience === value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && <div className="h-64 animate-pulse rounded-lg bg-neutral-100" />}
      {isError && <p className="py-12 text-center text-sm text-error-600">Couldn't load visitor activity.</p>}
      {data && <VisitorContent data={data} metric={activeMetric} audience={audience} />}
    </section>
  );
};

const VisitorContent = ({
  data,
  metric,
  audience,
}: {
  data: VisitorActivity;
  metric: Metric;
  audience: AudienceKey;
}) => {
  const { kpis, series } = data;
  const audienceLabel = AUDIENCES.find((option) => option.value === audience)?.label ?? "All";
  const daily = kpis.dau[audience];
  const monthly = kpis.mau[audience];
  const comeBack = monthly === 0 ? 0 : Math.round((daily / monthly) * 100);

  // Series points hold counts for every audience; the chart draws the lines the filter asks for.
  const chartKeys: AudienceKey[] = audience === "total" ? ["total", "anonymous", "jobSeeker", "employer"] : [audience];
  const chartData = series.map((point) => {
    const counts = metric === "DAU" ? point.dau : point.mau;
    return {
      label: point.label,
      total: counts?.total,
      anonymous: counts?.anonymous,
      jobSeeker: counts?.jobSeeker,
      employer: counts?.employer,
    };
  });

  return (
    <>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <MiniStat label="Daily active" value={daily} hint={audienceLabel} />
        <MiniStat label="Monthly active" value={monthly} hint={`${comeBack}% came back today`} />
        <MiniStat label="New visitors" value={kpis.newVisitors} hint={`${kpis.totalVisitors.toLocaleString()} all time`} />
        <MiniStat label="Sessions" value={kpis.sessions} hint={`${kpis.pageViews.toLocaleString()} page views`} />
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#a3a3a3" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {chartKeys.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={AUDIENCES.find((option) => option.value === key)?.label ?? key}
                stroke={AUDIENCE_COLOURS[key]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default VisitorActivitySection;
