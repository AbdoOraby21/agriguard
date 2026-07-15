import { localDb } from "./localDb";

// ---------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------

export const VOC_LEVELS = ["low", "medium", "high"];
const VOC_SCORE = { low: 0, medium: 15, high: 30 };

// nameKey points at a translation key in src/i18n/translations.js —
// this is what makes device names bilingual instead of hardcoded English.
const DEVICE_SEEDS = [
  {
    id: "AG-1001",
    nameKey: "deviceNorthFieldA",
    lat: 0.2,
    lng: 0.25,
    base: { battery: 87, status: "online", soilMoisture: 52, soilTemp: 24, airTemp: 29, airHum: 58, ec: 1.2, voc: "low", n: "normal", p: "normal", k: "normal" },
  },
  {
    id: "AG-1002",
    nameKey: "deviceNorthFieldB",
    lat: 0.35,
    lng: 0.3,
    base: { battery: 63, status: "online", soilMoisture: 31, soilTemp: 26, airTemp: 31, airHum: 49, ec: 1.6, voc: "medium", n: "low", p: "normal", k: "normal" },
  },
  {
    id: "AG-1003",
    nameKey: "deviceSouthFieldA",
    lat: 0.55,
    lng: 0.62,
    base: { battery: 18, status: "warning", soilMoisture: 22, soilTemp: 28, airTemp: 33, airHum: 40, ec: 2.1, voc: "high", n: "low", p: "low", k: "normal" },
  },
  {
    id: "AG-1004",
    nameKey: "deviceSouthFieldB",
    lat: 0.68,
    lng: 0.4,
    base: { battery: 5, status: "offline", soilMoisture: 0, soilTemp: 0, airTemp: 0, airHum: 0, ec: 0, voc: "low", n: "normal", p: "normal", k: "normal" },
  },
  {
    id: "AG-1005",
    nameKey: "deviceGreenhouse",
    lat: 0.8,
    lng: 0.75,
    base: { battery: 95, status: "online", soilMoisture: 60, soilTemp: 23, airTemp: 27, airHum: 70, ec: 1.0, voc: "low", n: "normal", p: "normal", k: "normal" },
  },
];

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function drift(prev, maxDelta, min, max) {
  return clamp(prev + (Math.random() - 0.5) * 2 * maxDelta, min, max);
}

function driftVoc(prev) {
  if (Math.random() < 0.85) return prev;
  const idx = VOC_LEVELS.indexOf(prev);
  const dir = Math.random() < 0.5 ? -1 : 1;
  return VOC_LEVELS[clamp(idx + dir, 0, VOC_LEVELS.length - 1)];
}

function driftNpk(prev) {
  if (Math.random() < 0.94) return prev;
  const levels = ["low", "normal", "high"];
  return levels[Math.floor(Math.random() * levels.length)];
}

function tickDevice(device) {
  if (device.status === "offline") return device;
  const battery = clamp(device.battery - (Math.random() < 0.25 ? 1 : 0), 0, 100);
  return {
    ...device,
    battery,
    status: battery < 15 ? "warning" : device.status,
    lastUpdate: Date.now(),
    soilMoisture: Math.round(drift(device.soilMoisture, 3, 5, 95)),
    soilTemp: Math.round(drift(device.soilTemp, 1, 10, 42)),
    airTemp: Math.round(drift(device.airTemp, 1.2, 14, 46)),
    airHum: Math.round(drift(device.airHum, 2, 15, 100)),
    voc: driftVoc(device.voc),
    n: driftNpk(device.n),
    p: driftNpk(device.p),
    k: driftNpk(device.k),
  };
}

export function computeDerived(device) {
  const heatDelta = device.airTemp ? device.soilTemp - device.airTemp : 0;
  const humidity = device.airHum;
  let risk = 0;
  risk += clamp((humidity - 50) * 0.6, 0, 30);
  risk += VOC_SCORE[device.voc] || 0;
  risk += device.airTemp > 30 ? 15 : 0;
  risk = Math.round(clamp(risk, 2, 97));

  const deficient = device.n === "low" || device.p === "low" || device.k === "low";
  let overall = "good";
  if (device.status === "offline") overall = "offline";
  else if (risk >= 65) overall = "danger";
  else if (risk >= 35 || deficient) overall = "warn";

  return { risk, overall, deficient, heatDelta };
}

function seedDevices() {
  const now = Date.now();
  return DEVICE_SEEDS.map((s) => ({
    id: s.id,
    nameKey: s.nameKey,
    lat: s.lat,
    lng: s.lng,
    lastUpdate: now,
    ...s.base,
  }));
}

// Alerts carry a `type`, structured `params`, and no text — the UI layer
// (src/i18n/alertText.js) turns type + params into a localized title and
// message via the current language's translation dictionary.
function seedAlerts() {
  const now = Date.now();
  return [
    {
      id: "seed-1",
      type: "deviceOffline",
      severity: "critical",
      params: { deviceNameKey: "deviceSouthFieldB" },
      time: now - 3 * 60 * 60 * 1000,
    },
    {
      id: "seed-2",
      type: "lowBattery",
      severity: "warning",
      params: { deviceNameKey: "deviceSouthFieldA", pct: 18 },
      time: now - 60 * 60 * 1000,
    },
    {
      id: "seed-3",
      type: "diseaseRisk",
      severity: "warning",
      params: {},
      time: now - 40 * 60 * 1000,
    },
  ];
}

function computePrediction(devices) {
  const active = devices.filter((d) => d.status !== "offline");
  const avgMoisture = active.length
    ? active.reduce((sum, d) => sum + d.soilMoisture, 0) / active.length
    : 0;
  const offlineCount = devices.filter((d) => d.status === "offline").length;

  const diseaseProb = clamp(30 + clamp(65 - avgMoisture, 0, 40) + offlineCount * 5, 4, 96);
  const risk = diseaseProb >= 65 ? "high" : diseaseProb >= 35 ? "medium" : "low";
  const healthScore = Math.round(clamp(100 - diseaseProb * 0.6 - offlineCount * 4, 10, 99));
  const lowMoisture = avgMoisture < 35;

  return {
    farmHealthScore: healthScore,
    diseaseRisk: risk,
    diseaseProbabilityPercent: Math.round(diseaseProb),
    irrigationCode: lowMoisture ? "irrigateSoon" : "noIrrigationNeeded",
    expectedIrrigationTime: Date.now() + 6 * 60 * 60 * 1000,
    fertilizerCode: lowMoisture ? "applyNitrogen" : "levelsAdequate",
    cropHealthCode: risk === "high" ? "cropStressSigns" : risk === "medium" ? "cropStableMonitor" : "cropHealthy",
    predictedWaterUsageLiters: Math.round(850 + (65 - avgMoisture) * 8),
    suggestedActionCodes: [
      ...(risk !== "low" ? ["actionInspectZones"] : []),
      ...(lowMoisture ? ["actionScheduleIrrigation"] : []),
      ...(offlineCount > 0 ? ["actionCheckOffline"] : []),
      "actionReviewAnalytics",
    ],
  };
}

function seedHistory(baseValue, amplitude, points = 24) {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => {
    const t = now - (points - i) * 60 * 60 * 1000;
    const wave = Math.sin(i / 3) * (amplitude / 2);
    const noise = (Math.random() - 0.5) * amplitude;
    return { time: t, value: Math.max(0, baseValue + wave + noise) };
  });
}

// ---------------------------------------------------------------------
// The engine: a tiny pub/sub store the React hooks subscribe to
// ---------------------------------------------------------------------

const STORAGE_KEY = "agriguard-state-v2";
const HISTORY_KEY = "agriguard-history-v2";

class DataEngine {
  constructor() {
    const saved = localDb.get(STORAGE_KEY);
    this.devices = saved?.devices || seedDevices();
    this.alerts = saved?.alerts || seedAlerts();
    this.listeners = new Set();

    this.history =
      localDb.get(HISTORY_KEY) ||
      {
        soilMoisture: seedHistory(45, 20),
        temperature: seedHistory(28, 10),
        humidity: seedHistory(60, 25),
        waterUsage: seedHistory(120, 60),
        uptime: seedHistory(92, 10),
      };

    this._persist();
    this.timer = setInterval(() => this._tick(), 5000);
  }

  subscribe(fn) {
    this.listeners.add(fn);
    fn(this._snapshot());
    return () => this.listeners.delete(fn);
  }

  _snapshot() {
    return {
      devices: this.devices,
      alerts: this.alerts,
      prediction: computePrediction(this.devices),
      history: this.history,
      lastUpdate: this.lastUpdate || Date.now(),
    };
  }

  _notify() {
    const snap = this._snapshot();
    this.listeners.forEach((fn) => fn(snap));
  }

  _persist() {
    localDb.set(STORAGE_KEY, { devices: this.devices, alerts: this.alerts });
    localDb.set(HISTORY_KEY, this.history);
  }

  _tick() {
    this.devices = this.devices.map(tickDevice);
    this.lastUpdate = Date.now();

    const activeDevices = this.devices.filter((d) => d.status !== "offline");
    const avg = (fn) => (activeDevices.length ? activeDevices.reduce((s, d) => s + fn(d), 0) / activeDevices.length : 0);
    const uptimePct = Math.round((activeDevices.length / this.devices.length) * 100);

    const push = (key, value) => {
      const arr = [...this.history[key], { time: Date.now(), value }].slice(-24);
      this.history = { ...this.history, [key]: arr };
    };
    push("soilMoisture", avg((d) => d.soilMoisture));
    push("temperature", avg((d) => d.airTemp));
    push("humidity", avg((d) => d.airHum));
    push("waterUsage", 100 + Math.random() * 60);
    push("uptime", uptimePct);

    const lowDevice = this.devices.find((d) => d.status !== "offline" && d.soilMoisture < 25);
    if (lowDevice && Math.random() < 0.2) {
      this.alerts = [
        {
          id: `a-${Date.now()}`,
          type: "lowMoisture",
          severity: "warning",
          params: { deviceNameKey: lowDevice.nameKey, pct: lowDevice.soilMoisture },
          time: Date.now(),
        },
        ...this.alerts,
      ].slice(0, 50);
    }

    this._persist();
    this._notify();
  }

  async fetchWeather() {
    await new Promise((r) => setTimeout(r, 150));
    return { tempC: 29, condition: "sunny", humidity: 61, windKph: 14 };
  }

  dispose() {
    clearInterval(this.timer);
  }
}

export const engine = new DataEngine();
