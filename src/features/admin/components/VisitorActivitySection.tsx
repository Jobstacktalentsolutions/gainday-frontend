import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity } from "lucide-react";
import { useVisitorActivity, type VisitorActivity } from "../hooks/useVisitorActivity";
import type { Timeframe } from "../hooks/useDashboardStats";
import StatCard from "./StatCard";

interface VisitorActivitySectionProps {
  timeframe: Timeframe;
}

const PERIOD_LABELS: Record<Timeframe, string> = {
  day: "last 7 days",
  week: "last 7 days",
  month: "last 30 days",
  year: "last 12 months",
  all: "all time",
};

const tooltipStyle = {
  background: "rgba(23, 23, 23, 0.95)",
  border: "none",
  borderRadius: 8,
  color: "#fff",
  fontSize: 12,
};

const VisitorActivitySection = ({ timeframe }: VisitorActivitySectionProps) => {
  const { data, isLoading, isError } = useVisitorActivity(timeframe);

  return (
    <section className="flex flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
      <div>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-sky-50 p-2 text-sky-600">
            <Activity className="size-4" />
          </div>
          <h2 className="text-sm font-semibold text-neutral-900">Visitors</h2>
        </div>
        <p className="mt-1 text-xs text-neutral-500">Everyone who used the platform, {PERIOD_LABELS[timeframe]}</p>
      </div>

      {isLoading && <div className="h-64 animate-pulse rounded-lg bg-neutral-100" />}
      {isError && <p className="py-12 text-center text-sm text-error-600">Couldn't load visitor activity.</p>}
      {data && <VisitorContent data={data} />}
    </section>
  );
};

const VisitorContent = ({ data }: { data: VisitorActivity }) => {
  const { kpis, series } = data;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Daily active" value={kpis.dau} hint={`${kpis.signedInDau} signed in`} />
        <StatCard label="Monthly active" value={kpis.mau} hint={`${Math.round(kpis.stickiness * 100)}% came back today`} />
        <StatCard label="New visitors" value={kpis.newVisitors} hint={`${kpis.totalVisitors.toLocaleString()} all time`} />
        <StatCard label="Sessions" value={kpis.sessions} hint={`${kpis.pageViews.toLocaleString()} page views`} />
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#a3a3a3" }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="visitors" name="Visitors" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="signedInUsers" name="Signed in" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="mau" name="Monthly active" stroke="#10b981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default VisitorActivitySection;
