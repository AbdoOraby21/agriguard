import { useLang } from "../i18n/LanguageContext";

export function SectionCard({ title, trailing, children, className = "" }) {
  return (
    <div className={`bg-white border border-stone-200 rounded-2xl p-5 ${className}`}>
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="font-display text-sm font-bold text-emerald-900">{title}</h2>
        {trailing}
      </div>
      {children}
    </div>
  );
}

const STATUS_STYLE = {
  online: { bg: "bg-emerald-100", fg: "text-emerald-700", labelKey: "statusOnline", dot: "bg-emerald-600" },
  warning: { bg: "bg-amber-100", fg: "text-amber-700", labelKey: "statusWarning", dot: "bg-amber-600" },
  offline: { bg: "bg-red-100", fg: "text-red-700", labelKey: "statusOffline", dot: "bg-red-600" },
};

export function StatusChip({ status }) {
  const { t } = useLang();
  const s = STATUS_STYLE[status] || STATUS_STYLE.offline;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${s.bg} ${s.fg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {t(s.labelKey)}
    </span>
  );
}

const RISK_STYLE = {
  low: { bg: "bg-emerald-100", fg: "text-emerald-700", labelKey: "riskLow" },
  medium: { bg: "bg-amber-100", fg: "text-amber-800", labelKey: "riskMedium" },
  high: { bg: "bg-red-100", fg: "text-red-700", labelKey: "riskHigh" },
};

export function RiskChip({ risk }) {
  const { t } = useLang();
  const s = RISK_STYLE[risk] || RISK_STYLE.low;
  return (
    <span className={`text-xs font-extrabold px-3 py-1.5 rounded-full ${s.bg} ${s.fg}`}>
      {t(s.labelKey)}
    </span>
  );
}

export function MetricTile({ icon: Icon, label, value, accent = "text-emerald-700" }) {
  return (
    <div className="flex items-center gap-2.5 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5">
      {Icon && <Icon size={16} className={accent} />}
      <div className="min-w-0">
        <div className="text-[10.5px] font-semibold text-stone-500 leading-tight">{label}</div>
        <div className="text-[13.5px] font-extrabold text-stone-900 leading-tight truncate">{value}</div>
      </div>
    </div>
  );
}
