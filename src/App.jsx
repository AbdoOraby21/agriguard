import { useState } from "react";
import { useAgriGuardData } from "./data/useAgriGuardData";
import { BottomNav } from "./components/BottomNav";
import { Bell } from "lucide-react";
import DashboardScreen from "./screens/DashboardScreen";
import DevicesScreen from "./screens/DevicesScreen";
import FieldMapScreen from "./screens/FieldMapScreen";
import AiPredictionScreen from "./screens/AiPredictionScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import NotificationsScreen from "./screens/NotificationsScreen";

export default function App() {
  const data = useAgriGuardData();
  const [tab, setTab] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="text-emerald-800 font-bold">Loading sensor data...</div>
      </div>
    );
  }

  const screens = {
    dashboard: <DashboardScreen data={data} />,
    devices: <DevicesScreen data={data} />,
    map: <FieldMapScreen data={data} />,
    ai: <AiPredictionScreen data={data} />,
    analytics: <AnalyticsScreen data={data} />,
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {screens[tab]}

      {tab === "dashboard" && (
        <button
          onClick={() => setShowNotifications(true)}
          className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-emerald-800 shadow-lg flex items-center justify-center z-30"
        >
          <Bell size={22} className="text-white" />
          {data.alerts.length > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-emerald-800" />
          )}
        </button>
      )}

      <BottomNav active={tab} onChange={setTab} />

      {showNotifications && (
        <NotificationsScreen data={data} onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
}
