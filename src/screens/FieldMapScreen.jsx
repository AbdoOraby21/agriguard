import { useState } from "react";
import { Radio, X } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";

const STATUS_COLOR = { online: "#1F9D63", warning: "#E0A233", offline: "#D9483D" };

function Legend({ t }) {
  const items = [
    ["#1F9D63", t("legendWorking")],
    ["#E0A233", t("legendWarning")],
    ["#D9483D", t("legendOffline")],
  ];
  return (
    <div className="flex items-center justify-evenly mb-4">
      {items.map(([color, label]) => (
        <div key={label} className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
          <span className="text-[12.5px] font-semibold text-stone-500">{label}</span>
        </div>
      ))}
    </div>
  );
}

function DeviceSheet({ device, onClose, t }) {
  if (!device) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative bg-white w-full rounded-t-3xl p-6 max-w-lg mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="font-extrabold text-lg text-stone-900">{t(device.nameKey)}</div>
            <div className="text-stone-500 text-xs mt-0.5">{t("deviceIdLabel")}: {device.id}</div>
          </div>
          <button onClick={onClose} className="text-stone-400"><X size={20} /></button>
        </div>
        <div className="mt-4">
          {device.status === "offline" ? (
            <span className="text-red-600 font-bold">{t("deviceDisconnected")}</span>
          ) : (
            <span className="text-stone-700 font-semibold text-sm">
              {t("deviceSheetStatusLine", device.soilMoisture, device.battery)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FieldMapScreen({ data }) {
  const { t } = useLang();
  const [selected, setSelected] = useState(null);

  return (
    <div className="px-5 pt-4 pb-28 max-w-lg mx-auto">
      <h1 className="font-display text-lg font-extrabold text-stone-900 mb-4">{t("fieldMapTitle")}</h1>
      <Legend t={t} />
      <div
        className="relative rounded-3xl border border-stone-200 overflow-hidden"
        style={{
          height: "60vh",
          backgroundImage:
            "linear-gradient(135deg, #E7F2E9, #D3EADA), repeating-linear-gradient(0deg, rgba(27,107,79,0.06) 0 1px, transparent 1px 36px), repeating-linear-gradient(90deg, rgba(27,107,79,0.06) 0 1px, transparent 1px 36px)",
        }}
      >
        {data.devices.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelected(d)}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: `${d.lng * 100}%`, top: `${d.lat * 100}%` }}
          >
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center border-[2.5px] border-white shadow-lg"
              style={{ background: STATUS_COLOR[d.status] }}
            >
              <Radio size={13} className="text-white" />
            </span>
          </button>
        ))}
      </div>
      <DeviceSheet device={selected} onClose={() => setSelected(null)} t={t} />
    </div>
  );
}
