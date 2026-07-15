const TITLE_KEY = {
  lowMoisture: "alertLowMoistureTitle",
  deviceOffline: "alertDeviceOfflineTitle",
  lowBattery: "alertLowBatteryTitle",
  diseaseRisk: "alertDiseaseRiskTitle",
};

export function alertTitle(t, alert) {
  return t(TITLE_KEY[alert.type] || alert.type);
}

export function alertMessage(t, alert) {
  const p = alert.params || {};
  switch (alert.type) {
    case "lowMoisture":
      return t("alertLowMoistureMsg", t(p.deviceNameKey), p.pct);
    case "deviceOffline":
      return t("alertDeviceOfflineMsg", t(p.deviceNameKey));
    case "lowBattery":
      return t("alertLowBatteryMsg", t(p.deviceNameKey), p.pct);
    case "diseaseRisk":
      return t("alertDiseaseRiskMsg");
    default:
      return "";
  }
}

export function npkLabelKey(value) {
  if (value === "low") return "npkLow";
  if (value === "high") return "npkHigh";
  return "npkNormal";
}

export function vocLabelKey(value) {
  if (value === "low") return "vocLow";
  if (value === "high") return "vocHigh";
  return "vocMedium";
}
