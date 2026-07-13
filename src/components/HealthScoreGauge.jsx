import { useEffect, useState } from "react";

export function HealthScoreGauge({ score = 0 }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(score));
    return () => cancelAnimationFrame(id);
  }, [score]);

  const color = score >= 75 ? "#3CC583" : score >= 50 ? "#E0A233" : "#D9483D";
  const label = score >= 75 ? "Healthy" : score >= 50 ? "Needs attention" : "At risk";
  const circumference = 2 * Math.PI * 46;
  const offset = circumference - (circumference * animated) / 100;

  return (
    <div className="relative w-28 h-28 flex-shrink-0">
      <svg width="112" height="112" className="-rotate-90">
        <circle cx="56" cy="56" r="46" stroke="rgba(255,255,255,0.15)" strokeWidth="10" fill="none" />
        <circle
          cx="56"
          cy="56"
          r="46"
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 900ms cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono font-extrabold text-2xl text-white">{Math.round(animated)}</span>
        <span className="text-[9px] text-emerald-200">{label}</span>
      </div>
    </div>
  );
}
