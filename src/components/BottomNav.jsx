import { LayoutDashboard, Radio, Map, Sparkles, BarChart3 } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";

const TABS = [
  { id: "dashboard", labelKey: "tabDashboard", icon: LayoutDashboard },
  { id: "devices", labelKey: "tabDevices", icon: Radio },
  { id: "map", labelKey: "tabMap", icon: Map },
  { id: "ai", labelKey: "tabAi", icon: Sparkles },
  { id: "analytics", labelKey: "tabAnalytics", icon: BarChart3 },
];

export function BottomNav({ active, onChange }) {
  const { t } = useLang();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 flex items-stretch z-40 pb-[env(safe-area-inset-bottom)]">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5"
          >
            <Icon size={20} className={isActive ? "text-emerald-800" : "text-stone-400"} strokeWidth={isActive ? 2.4 : 2} />
            <span className={`text-[10px] font-bold ${isActive ? "text-emerald-800" : "text-stone-400"}`}>{t(tab.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
}
