import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

function ProductionChart({ data }) {
  const safeData = (data || []).map((item) => ({
    date: item.date || item.recordDate || "",
    predicted: Number(item.predicted ?? item.predictedEnergy) || 0,
    actual: Number(item.actual ?? item.actualEnergy) || 0,
  }));

  return (
    <div
      style={{
        width: "100%",
        height: "320px",
        minWidth: 0,
        minHeight: 320,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={safeData}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />

          {/* noktanın ğstünde durunca sayısal veri görünür oluyor.*/}
          <Tooltip />
          <Legend />

          <Line
            type="linear"
            dataKey="actual"
            name="Gerçek Üretim"
            stroke="#16a34a"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

          <Line
            type="linear"
            dataKey="predicted"
            name="Tahmin"
            stroke="#9ca3af"
            strokeWidth={3}
            strokeDasharray="6 6"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProductionChart;