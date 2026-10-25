import {
    Bar,
    BarChart,
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

// Colours cycle by series position, so the same series keeps its colour across the chart.
const SERIES_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706"];

// Recharts draws one object per category, keyed by series name.
function toRows(chart: ChartPayload) {
    return chart.categories.map((category, index) =>
        Object.fromEntries([
            ["category", category],
            ...chart.series.map((series) => [series.name, series.values[index]]),
        ]),
    );
}

/** A read-only chart of a task's figures. The backend builds it from the same numbers as the table
 *  beside it, so the two cannot disagree. */
const TaskChart = ({ chart }: { chart: ChartPayload }) => {
    const rows = toRows(chart);
    const axes = (
        <>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
        </>
    );

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                {chart.type === "bar" ? (
                    <BarChart data={rows}>
                        {axes}
                        {chart.series.map((series, index) => (
                            <Bar key={series.name} dataKey={series.name} fill={SERIES_COLORS[index % SERIES_COLORS.length]} />
                        ))}
                    </BarChart>
                ) : (
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
                )}
            </ResponsiveContainer>
        </div>
    );
};

export default TaskChart;
