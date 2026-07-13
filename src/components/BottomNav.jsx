import { LayoutDashboard, Radio, Map, Sparkles, BarChart3 } from "lucide-react";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "devices", label: "Devices", icon: Radio },
  { id: "map", label: "Field Map", icon: Map },
  { id: "ai", label: "AI", icon: Sparkles },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export function BottomNav({ active, onChange }) {
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
            <span className={`text-[10px] font-bold ${isActive ? "text-emerald-800" : "text-stone-400"}`}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
