import {
    Bar,
    BarChart,
    Cell,
    ComposedChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { ChartPayload } from "../types";
import { waterfallSteps } from "./chartData";

// Colours cycle by series position, so the same series keeps its colour across the chart.
const SERIES_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706"];
const WATERFALL_COLORS = { total: "#475569", increase: "#059669", decrease: "#dc2626" } as const;

// Recharts draws one object per category, keyed by series name.
function toRows(categories: string[], series: { name: string; values: number[] }[]) {
    return categories.map((category, index) =>
        Object.fromEntries([["category", category], ...series.map((s) => [s.name, s.values[index]])]),
    );
}

/** A read-only chart of a task's figures. The backend builds it from the same numbers as the table
 *  beside it, so the two cannot disagree. */
const TaskChart = ({ chart }: { chart: ChartPayload }) => (
    <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
            {renderChart(chart)}
        </ResponsiveContainer>
    </div>
);

function renderChart(chart: ChartPayload) {
    switch (chart.type) {
        case "bar":
        case "line":
            return simpleChart(chart);
        case "combo":
            return comboChart(chart);
        case "waterfall":
            return waterfallChart(chart);
    }
}

function simpleChart(chart: Extract<ChartPayload, { type: "bar" | "line" }>) {
    const rows = toRows(chart.categories, chart.series);
    const axes = (
        <>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
        </>
    );
    if (chart.type === "bar") {
        return (
            <BarChart data={rows}>
                {axes}
                {chart.series.map((series, index) => (
                    <Bar key={series.name} dataKey={series.name} fill={SERIES_COLORS[index % SERIES_COLORS.length]} />
                ))}
            </BarChart>
        );
    }
    return (
        <LineChart data={rows}>
            {axes}
            {chart.series.map((series, index) => (
                <Line
                    key={series.name}
                    type="monotone"
                    dataKey={series.name}
                    stroke={SERIES_COLORS[index % SERIES_COLORS.length]}
                />
            ))}
        </LineChart>
    );
}

// Bars and a line on two axes: each series names its own axis, so a percentage and an amount can share a chart.
function comboChart(chart: Extract<ChartPayload, { type: "combo" }>) {
    const rows = toRows(chart.categories, chart.series);
    return (
        <ComposedChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="primary" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="secondary" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {chart.series.map((series, index) => {
                const color = SERIES_COLORS[index % SERIES_COLORS.length];
                return series.kind === "bar" ? (
                    <Bar key={series.name} yAxisId={series.axis} dataKey={series.name} fill={color} />
                ) : (
                    <Line key={series.name} yAxisId={series.axis} type="monotone" dataKey={series.name} stroke={color} />
                );
            })}
        </ComposedChart>
    );
}

// A bridge from a budget to an actual: floating bars for the drivers, solid bars for the two totals.
function waterfallChart(chart: Extract<ChartPayload, { type: "waterfall" }>) {
    const steps = waterfallSteps(chart.categories, chart.values, chart.totals);
    const rows = steps.map((step) => ({ category: step.category, base: step.base, height: step.height }));
    return (
        <BarChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            {/* The base is invisible: it only lifts each driver to where it starts. */}
            <Bar dataKey="base" stackId="bridge" fill="transparent" isAnimationActive={false} />
            <Bar dataKey="height" stackId="bridge" isAnimationActive={false}>
                {steps.map((step) => (
                    <Cell key={step.category} fill={WATERFALL_COLORS[step.kind]} />
                ))}
            </Bar>
        </BarChart>
    );
}

export default TaskChart;
