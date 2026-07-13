import { useEffect, useState } from "react";
import { Sun, Cloud, CloudRain, Wind, Droplet, Leaf, AlertTriangle, User } from "lucide-react";
import { HealthScoreGauge } from "../components/HealthScoreGauge";
import { SectionCard, RiskChip, MetricTile } from "../components/Shared";
import { engine } from "../data/dataEngine";

const WEATHER_ICON = { sunny: Sun, cloudy: Cloud, rainy: CloudRain, windy: Wind };

export default function DashboardScreen({ data }) {
  const [weather, setWeather] = useState(null);
  const { devices, prediction, alerts } = data;

  useEffect(() => {
    engine.fetchWeather().then(setWeather);
  }, []);

  const activeAlerts = alerts.filter((a) => a.severity !== "info").slice(0, 3);
  const online = devices.filter((d) => d.status === "online").length;
  const avgMoisture = devices.length
    ? Math.round(devices.reduce((s, d) => s + d.soilMoisture, 0) / devices.length)
    : 0;
  const WeatherIcon = weather ? WEATHER_ICON[weather.condition] : Sun;

  return (
    <div className="px-5 pt-4 pb-28 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display text-xl font-extrabold text-stone-900">AgriGuard</h1>
          <p className="text-xs text-stone-500 font-medium">Green Valley Farm</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
          <User size={18} className="text-emerald-700" />
        </div>
      </div>

      <div className="rounded-3xl p-5 bg-gradient-to-br from-emerald-900 to-emerald-700 flex items-center gap-4">
        <HealthScoreGauge score={prediction.farmHealthScore} />
        <div className="min-w-0">
          <div className="text-[11px] text-emerald-200 font-semibold">Farm Health Score</div>
          <div className="text-white font-bold text-[15px] leading-snug mt-1">{prediction.cropHealthSummary}</div>
          {weather && (
            <div className="flex items-center gap-1.5 mt-3">
              <WeatherIcon size={16} className="text-amber-300" />
              <span className="text-white text-xs font-semibold">
                {weather.tempC}°C · {weather.humidity}% humidity
              </span>
            </div>
          )}
        </div>
      </div>

      {activeAlerts.length > 0 && (
        <div className="mt-4">
          <SectionCard title="Active Alerts">
            <div className="space-y-2.5">
              {activeAlerts.map((a) => {
                const critical = a.severity === "critical";
                return (
                  <div
                    key={a.id}
                    className={`rounded-xl p-3 flex items-start gap-2.5 ${critical ? "bg-red-50" : "bg-amber-50"}`}
                  >
                    <AlertTriangle size={18} className={critical ? "text-red-600" : "text-amber-600"} />
                    <div className="min-w-0">
                      <div className={`text-[13px] font-extrabold ${critical ? "text-red-700" : "text-amber-800"}`}>{a.title}</div>
                      <div className={`text-xs ${critical ? "text-red-600" : "text-amber-700"}`}>{a.message}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      )}

      <div className="mt-4">
        <SectionCard title="AI Prediction" trailing={<RiskChip risk={prediction.diseaseRisk} />}>
          <div className="space-y-2.5">
            <MetricTile icon={Droplet} label="Irrigation" value={prediction.irrigationRecommendation} accent="text-teal-600" />
            <MetricTile icon={Leaf} label="Fertilizer" value={prediction.fertilizerRecommendation} accent="text-emerald-600" />
          </div>
        </SectionCard>
      </div>

      <div className="mt-4">
        <SectionCard title="Field Devices">
          <div className="flex items-center">
            <div className="flex-1 text-center">
              <div className="text-xl font-extrabold text-emerald-700">{online}/{devices.length}</div>
              <div className="text-[11px] font-semibold text-stone-500 mt-0.5">Online</div>
            </div>
            <div className="w-px h-9 bg-stone-200" />
            <div className="flex-1 text-center">
              <div className="text-xl font-extrabold text-teal-600">{avgMoisture}%</div>
              <div className="text-[11px] font-semibold text-stone-500 mt-0.5">Avg. Soil Moisture</div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
