import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SectionCard } from "../components/Shared";

const CHARTS = [
  { key: "soilMoisture", title: "Soil Moisture History", color: "#2EB89E" },
  { key: "temperature", title: "Temperature History", color: "#E0A233" },
  { key: "humidity", title: "Humidity History", color: "#13543E" },
  { key: "waterUsage", title: "Water Usage", color: "#1F9D63" },
  { key: "uptime", title: "Device Uptime", color: "#1F9D63" },
];

function fmtHour(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit" });
}

export default function AnalyticsScreen({ data }) {
  return (
    <div className="px-5 pt-4 pb-28 max-w-lg mx-auto">
      <h1 className="font-display text-lg font-extrabold text-stone-900 mb-4">Analytics</h1>
      <div className="space-y-4">
        {CHARTS.map(({ key, title, color }) => {
          const points = data.history[key] || [];
          const chartData = points.map((p) => ({ time: fmtHour(p.time), value: Math.round(p.value) }));
          return (
            <SectionCard key={key} title={title}>
              <div style={{ width: "100%", height: 160 }}>
                <ResponsiveContainer>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E3E8E2" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 10.5, fill: "#667A6E" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10.5, fill: "#667A6E" }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E3E8E2", fontSize: 12.5 }} />
                    <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.15} strokeWidth={2.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
}
