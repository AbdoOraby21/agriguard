import { Droplet, Bug, RadioTower, BatteryWarning, X } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import { alertTitle, alertMessage } from "../i18n/contentHelpers";

const ICON = { lowMoisture: Droplet, diseaseRisk: Bug, deviceOffline: RadioTower, lowBattery: BatteryWarning };

function timeAgo(ts, t) {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return t("justNow");
  if (mins < 60) return t("minsAgo", mins);
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return t("hoursAgo", hrs);
  return t("daysAgo", Math.round(hrs / 24));
}

export default function NotificationsScreen({ data, onClose }) {
  const { t } = useLang();
  const alerts = data.alerts;

  return (
    <div className="fixed inset-0 z-50 bg-stone-100">
      <div className="max-w-lg mx-auto h-full flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-stone-200">
          <h1 className="font-display text-lg font-extrabold text-stone-900">{t("notificationsTitle")}</h1>
          <button onClick={onClose} className="text-stone-400"><X size={22} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {alerts.length === 0 && (
            <p className="text-center text-stone-400 mt-10">{t("noNotifications")}</p>
          )}
          {alerts.map((a) => {
            const Icon = ICON[a.type] || Droplet;
            const critical = a.severity === "critical";
            const warn = a.severity === "warning";
            const bg = critical ? "bg-red-100" : warn ? "bg-amber-100" : "bg-emerald-100";
            const fg = critical ? "text-red-600" : warn ? "text-amber-600" : "text-emerald-700";

            return (
              <div key={a.id} className="bg-white rounded-2xl border border-stone-200 p-3.5 flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                  <Icon size={18} className={fg} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-[13.5px] text-stone-900 truncate">{alertTitle(t, a)}</span>
                    <span className="text-[11px] text-stone-400 whitespace-nowrap">{timeAgo(a.time, t)}</span>
                  </div>
                  <p className="text-[12.5px] text-stone-500 mt-0.5">{alertMessage(t, a)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
