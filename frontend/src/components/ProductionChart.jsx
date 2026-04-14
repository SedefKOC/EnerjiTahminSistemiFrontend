import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

/* ── Theme palette ─────────────────────── */
const THEMES = {
  GES: {
    accentCore:   "#16a34a",
    accentBright: "#4ade80",
    gridColor:    "#142010",
    fillId:       "gesAreaFill",
    bgSurface:    "#0d1610",
  },
  HES: {
    accentCore:   "#1d6fa4",
    accentBright: "#38bdf8",
    gridColor:    "#151e35",
    fillId:       "hesAreaFill",
    bgSurface:    "#0d1220",
  },
};

const TOOLTIP_STYLE = {
  background: "#161b22",
  border: "0.5px solid #30363d",
  borderRadius: "7px",
  color: "#e6edf3",
  fontSize: "12px",
  padding: "8px 12px",
};

const LEGEND_STYLE = {
  fontSize: "11px",
  color: "#8b949e",
};

function ProductionChart({ data, plantType = "GES" }) {
  const theme = THEMES[plantType] || THEMES.GES;

  const safeData = (data || []).map((item) => ({
    date:      item.date      || item.recordDate    || "",
    predicted: Number(item.predicted  ?? item.predictedEnergy) || 0,
    actual:    Number(item.actual     ?? item.actualEnergy)     || 0,
  }));
  console.log("raw data:", data);
console.log("safeData:", safeData);

  return (
    <div style={{ display: "block", width: "100%", height: "320px", minWidth: 0, minHeight: 320, overflow: "hidden" }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={safeData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id={theme.fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={theme.accentCore} stopOpacity={0.26} />
              <stop offset="95%" stopColor={theme.accentCore} stopOpacity={0}    />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke={theme.gridColor}
            strokeWidth={1}
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tick={{ fill: "#484f58", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: "#484f58", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            cursor={{ stroke: "#30363d", strokeWidth: 1 }}
          />

          <Legend
            wrapperStyle={LEGEND_STYLE}
            iconType="plainline"
          />

          {/* Actual — area with fill */}
          <Area
            type="linear"
            dataKey="actual"
            name="Gerçek Üretim"
            stroke={theme.accentCore}
            strokeWidth={2.5}
            fill={`url(#${theme.fillId})`}
            dot={{ r: 4, fill: theme.accentCore, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: theme.accentBright, strokeWidth: 0 }}
          />

          {/* Predicted — dashed line only */}
          <Line
            type="linear"
            dataKey="predicted"
            name="Tahmin"
            stroke="#484f58"
            strokeWidth={1.5}
            strokeDasharray="5 4"
            dot={false}
            activeDot={{ r: 4, fill: "#484f58", strokeWidth: 0 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProductionChart;
