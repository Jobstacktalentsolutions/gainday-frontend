import { useEffect, useRef } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ExperienceReviewSeriesPoint } from "../../types/reviews";

// Width of one bar's slot. The chart grows past the container so long timeframes scroll sideways.
const BAR_SLOT_PX = 56;

interface ReviewTrendChartProps {
  series: ExperienceReviewSeriesPoint[];
}

const ReviewTrendChart = ({ series }: ReviewTrendChartProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Start on the most recent bars.
  useEffect(() => {
    const element = scrollRef.current;
    if (element) element.scrollLeft = element.scrollWidth;
  }, [series]);

  return (
    <div ref={scrollRef} className="overflow-x-auto">
      <div className="h-64" style={{ minWidth: "100%", width: series.length * BAR_SLOT_PX }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={series}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} interval={0} />
            <YAxis
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              width={32}
            />
            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              formatter={(value, _name, item) => {
                const { count } = item.payload as ExperienceReviewSeriesPoint;
                return [`${Number(value).toFixed(2)} / 5`, `${count} review${count === 1 ? "" : "s"}`];
              }}
            />
            <Bar dataKey="average" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReviewTrendChart;
