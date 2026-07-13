import { Radio, RadioTower, Sprout, Thermometer, Sun, Droplet, Zap, BatteryFull, AlertCircle } from "lucide-react";
import { StatusChip, MetricTile } from "../components/Shared";
import { NPK_LABEL, VOC_LABEL } from "../data/dataEngine";

function timeAgo(ts) {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  return `${hrs}h ago`;
}

function BatteryBar({ percent }) {
  const color = percent < 20 ? "text-red-600" : percent < 50 ? "text-amber-600" : "text-emerald-600";
  const barColor = percent < 20 ? "bg-red-500" : percent < 50 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="flex-1">
      <div className={`text-[11px] font-bold mb-1 flex items-center gap-1 ${color}`}>
        <BatteryFull size={13} /> Battery {percent}%
      </div>
      <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function DeviceCard({ device }) {
  const offline = device.status === "offline";

  return (
    <div className={`bg-white rounded-2xl p-4 border ${offline ? "border-red-300" : "border-stone-200"}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${offline ? "bg-red-100" : "bg-emerald-100"}`}>
          {offline ? <RadioTower size={18} className="text-red-600" /> : <Radio size={18} className="text-emerald-700" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-extrabold text-[14.5px] text-stone-900 truncate">{device.name}</div>
          <div className="text-[11.5px] text-stone-500">ID: {device.id}</div>
        </div>
        <StatusChip status={device.status} />
      </div>

      {offline && (
        <div className="mt-3 bg-red-50 rounded-xl px-3 py-2.5 flex items-center gap-2">
          <AlertCircle size={16} className="text-red-600" />
          <span className="text-red-700 font-extrabold text-xs">Device Disconnected</span>
        </div>
      )}

      <div className="flex items-center gap-3 mt-3.5">
        <BatteryBar percent={device.battery} />
        <span className="text-[11px] text-stone-400 whitespace-nowrap">Updated {timeAgo(device.lastUpdate)}</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mt-3.5">
        <MetricTile icon={Sprout} label="Soil Moisture" value={offline ? "—" : `${device.soilMoisture}%`} accent="text-teal-600" />
        <MetricTile icon={Thermometer} label="Soil Temp" value={offline ? "—" : `${device.soilTemp}°C`} accent="text-amber-600" />
        <MetricTile icon={Sun} label="Air Temp" value={offline ? "—" : `${device.airTemp}°C`} accent="text-amber-600" />
        <MetricTile icon={Droplet} label="Air Humidity" value={offline ? "—" : `${device.airHum}%`} accent="text-emerald-700" />
        <MetricTile icon={Zap} label="Soil EC" value={offline ? "—" : `${device.ec.toFixed(1)} dS/m`} accent="text-emerald-600" />
        <MetricTile icon={BatteryFull} label="Battery" value={`${device.battery}%`} accent={device.battery < 20 ? "text-red-600" : "text-emerald-600"} />
      </div>

      {!offline && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[["N", device.n], ["P", device.p], ["K", device.k]].map(([label, val]) => (
            <div key={label} className="bg-stone-50 border border-stone-200 rounded-xl p-2 text-center">
              <div className="text-[10px] font-bold text-stone-500">{label}</div>
              <div className={`text-[12.5px] font-extrabold mt-0.5 ${val === "low" ? "text-red-600" : "text-emerald-700"}`}>
                {NPK_LABEL[val]}
              </div>
            </div>
          ))}
          <div className="col-span-3 text-center text-[11px] text-stone-400 mt-0.5">
            VOCs: <span className="font-bold text-stone-600">{VOC_LABEL[device.voc]}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DevicesScreen({ data }) {
  return (
    <div className="px-5 pt-4 pb-28 max-w-lg mx-auto">
      <h1 className="font-display text-lg font-extrabold text-stone-900 mb-4">Devices</h1>
      <div className="space-y-3.5">
        {data.devices.map((d) => (
          <DeviceCard key={d.id} device={d} />
        ))}
      </div>
    </div>
  );
}
