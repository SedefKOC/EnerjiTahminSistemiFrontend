import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function ProductionChart({ data }) {
  const safeData = (data || []).map((item) => ({
    date: item.recordDate || "",
    predicted: Number(item.predictedEnergy) || 0,
    actual: Number(item.actualEnergy) || 0,
  }));

  return (
    <div
      style={{
        width: "100%",
        height: "320px",
        minWidth: 0,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={safeData}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#16a34a"
            strokeWidth={3}
          />
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#9ca3af"
            strokeWidth={3}
            strokeDasharray="6 6"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProductionChart;