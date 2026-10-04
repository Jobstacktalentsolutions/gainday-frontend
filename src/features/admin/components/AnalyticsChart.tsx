import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { TrendingUp, Users, Award, Calendar } from "lucide-react";
import type { AnalyticsDataPoint, Timeframe } from "../hooks/useDashboardStats";

interface AnalyticsChartProps {
  data: AnalyticsDataPoint[];
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  isLoading?: boolean;
}

const TIMEFRAME_OPTIONS: { value: Timeframe; label: string }[] = [
  { value: "day", label: "24 Hours" },
  { value: "week", label: "7 Days" },
  { value: "month", label: "30 Days" },
  { value: "year", label: "12 Months" },
  { value: "all", label: "All Time" },
];

export const AnalyticsChart = ({
  data,
  timeframe,
  onTimeframeChange,
  isLoading,
}: AnalyticsChartProps) => {
  const totalApps = data.reduce((acc, curr) => acc + curr.applications, 0);
  const totalSubs = data.reduce((acc, curr) => acc + curr.submissions, 0);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/95 p-3.5 shadow-xl backdrop-blur-md text-white text-xs">
          <p className="font-semibold text-neutral-300 mb-2">{label}</p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Applications:
              </span>
              <span className="font-bold text-white">{payload[0]?.value ?? 0}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Submissions:
              </span>
              <span className="font-bold text-white">{payload[1]?.value ?? 0}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex w-full flex-col rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
      {/* Header & Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-neutral-900">
              Platform Throughput & Velocity
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
              <TrendingUp className="w-3 h-3" /> Live
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time candidate registrations vs completed work simulation attempts
          </p>
        </div>

        {/* Timeframe Filter Pills */}
        <div className="flex items-center gap-1 rounded-lg bg-neutral-100 p-1 self-start sm:self-auto">
          {TIMEFRAME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onTimeframeChange(opt.value)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                timeframe === opt.value
                  ? "bg-white text-neutral-900 shadow-xs font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Counters for Period */}
      <div className="grid grid-cols-2 gap-4 my-4 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-lg bg-blue-50/60 p-3 border border-blue-100">
          <div className="p-2 rounded-md bg-blue-100 text-blue-700">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-blue-700 uppercase tracking-wider">
              Applications
            </p>
            <p className="text-lg font-bold text-blue-950">{totalApps}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-purple-50/60 p-3 border border-purple-100">
          <div className="p-2 rounded-md bg-purple-100 text-purple-700">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-purple-700 uppercase tracking-wider">
              Submissions
            </p>
            <p className="text-lg font-bold text-purple-950">{totalSubs}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3 border border-neutral-100">
          <div className="p-2 rounded-md bg-neutral-200/70 text-neutral-700">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
              Data Points
            </p>
            <p className="text-lg font-bold text-neutral-800">{data.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3 border border-neutral-100">
          <div className="p-2 rounded-md bg-neutral-200/70 text-neutral-700">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
              Period
            </p>
            <p className="text-sm font-semibold text-neutral-800 capitalize">
              {TIMEFRAME_OPTIONS.find((t) => t.value === timeframe)?.label}
            </p>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[280px] w-full pt-2">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
            Updating chart data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="label"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="applications"
                name="Applications"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorApplications)"
              />
              <Area
                type="monotone"
                dataKey="submissions"
                name="Submissions"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorSubmissions)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
