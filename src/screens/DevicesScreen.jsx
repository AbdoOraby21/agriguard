import { Radio, RadioTower, Sprout, Thermometer, Sun, Droplet, Zap, BatteryFull, AlertCircle } from "lucide-react";
import { StatusChip, MetricTile } from "../components/Shared";
import { npkLabelKey, vocLabelKey } from "../i18n/contentHelpers";
import { useLang } from "../i18n/LanguageContext";

function timeAgo(ts, t) {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return t("justNow");
  if (mins < 60) return t("minsAgo", mins);
  const hrs = Math.round(mins / 60);
  return t("hoursAgo", hrs);
}

function BatteryBar({ percent, t }) {
  const color = percent < 20 ? "text-red-600" : percent < 50 ? "text-amber-600" : "text-emerald-600";
  const barColor = percent < 20 ? "bg-red-500" : percent < 50 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="flex-1">
      <div className={`text-[11px] font-bold mb-1 flex items-center gap-1 ${color}`}>
        <BatteryFull size={13} /> {t("battery", percent)}
      </div>
      <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function DeviceCard({ device, t }) {
  const offline = device.status === "offline";
  const name = t(device.nameKey);

  return (
    <div className={`bg-white rounded-2xl p-4 border ${offline ? "border-red-300" : "border-stone-200"}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${offline ? "bg-red-100" : "bg-emerald-100"}`}>
          {offline ? <RadioTower size={18} className="text-red-600" /> : <Radio size={18} className="text-emerald-700" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-extrabold text-[14.5px] text-stone-900 truncate">{name}</div>
          <div className="text-[11.5px] text-stone-500">{t("deviceIdLabel")}: {device.id}</div>
        </div>
        <StatusChip status={device.status} />
      </div>

      {offline && (
        <div className="mt-3 bg-red-50 rounded-xl px-3 py-2.5 flex items-center gap-2">
          <AlertCircle size={16} className="text-red-600" />
          <span className="text-red-700 font-extrabold text-xs">{t("deviceDisconnected")}</span>
        </div>
      )}

      <div className="flex items-center gap-3 mt-3.5">
        <BatteryBar percent={device.battery} t={t} />
        <span className="text-[11px] text-stone-400 whitespace-nowrap">{t("updatedAgo", timeAgo(device.lastUpdate, t))}</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mt-3.5">
        <MetricTile icon={Sprout} label={t("soilMoisture")} value={offline ? "—" : `${device.soilMoisture}%`} accent="text-teal-600" />
        <MetricTile icon={Thermometer} label={t("soilTemp")} value={offline ? "—" : `${device.soilTemp}°C`} accent="text-amber-600" />
        <MetricTile icon={Sun} label={t("airTemp")} value={offline ? "—" : `${device.airTemp}°C`} accent="text-amber-600" />
        <MetricTile icon={Droplet} label={t("airHumidity")} value={offline ? "—" : `${device.airHum}%`} accent="text-emerald-700" />
        <MetricTile icon={Zap} label={t("soilEc")} value={offline ? "—" : `${device.ec.toFixed(1)} dS/m`} accent="text-emerald-600" />
        <MetricTile icon={BatteryFull} label={t("batteryMetric")} value={`${device.battery}%`} accent={device.battery < 20 ? "text-red-600" : "text-emerald-600"} />
      </div>

      {!offline && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[["npkN", device.n], ["npkP", device.p], ["npkK", device.k]].map(([labelKey, val]) => (
            <div key={labelKey} className="bg-stone-50 border border-stone-200 rounded-xl p-2 text-center">
              <div className="text-[10px] font-bold text-stone-500">{t(labelKey)}</div>
              <div className={`text-[12.5px] font-extrabold mt-0.5 ${val === "low" ? "text-red-600" : "text-emerald-700"}`}>
                {t(npkLabelKey(val))}
              </div>
            </div>
          ))}
          <div className="col-span-3 text-center text-[11px] text-stone-400 mt-0.5">
            {t("vocsLabel", t(vocLabelKey(device.voc)))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DevicesScreen({ data }) {
  const { t } = useLang();
  return (
    <div className="px-5 pt-4 pb-28 max-w-lg mx-auto">
      <h1 className="font-display text-lg font-extrabold text-stone-900 mb-4">{t("devicesTitle")}</h1>
      <div className="space-y-3.5">
        {data.devices.map((d) => (
          <DeviceCard key={d.id} device={d} t={t} />
        ))}
      </div>
    </div>
  );
}
