import { Clock, Droplets, CheckCircle2 } from "lucide-react";
import { RiskChip } from "../components/Shared";
import { SectionCard } from "../components/Shared";

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
}

export default function AiPredictionScreen({ data }) {
  const p = data.prediction;

  return (
    <div className="px-5 pt-4 pb-28 max-w-lg mx-auto">
      <h1 className="font-display text-lg font-extrabold text-stone-900 mb-4">AI Prediction</h1>

      <div className="rounded-3xl p-5 bg-gradient-to-br from-emerald-900 to-emerald-700">
        <div className="flex items-center justify-between">
          <span className="text-emerald-200 text-xs font-semibold">Crop Health</span>
          <RiskChip risk={p.diseaseRisk} />
        </div>
        <div className="text-white font-extrabold text-[17px] mt-2">{p.cropHealthSummary}</div>
        <div className="flex gap-2.5 mt-4">
          <div className="flex-1 bg-white/10 rounded-2xl p-3">
            <div className="text-emerald-200 text-[10.5px] font-semibold">Disease Probability</div>
            <div className="text-white text-xl font-extrabold mt-0.5">{p.diseaseProbabilityPercent}%</div>
          </div>
          <div className="flex-1 bg-white/10 rounded-2xl p-3">
            <div className="text-emerald-200 text-[10.5px] font-semibold">Farm Health Score</div>
            <div className="text-white text-xl font-extrabold mt-0.5">{p.farmHealthScore}</div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <SectionCard title="Irrigation Forecast">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5">
              <Clock size={16} className="text-teal-600" />
              <div>
                <div className="text-[10.5px] font-semibold text-stone-500">Expected irrigation time</div>
                <div className="text-[13.5px] font-extrabold text-stone-900">{fmtTime(p.expectedIrrigationTime)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5">
              <Droplets size={16} className="text-emerald-700" />
              <div>
                <div className="text-[10.5px] font-semibold text-stone-500">Predicted water usage</div>
                <div className="text-[13.5px] font-extrabold text-stone-900">{p.predictedWaterUsageLiters} L</div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="mt-4">
        <SectionCard title="Suggested Actions">
          <div className="space-y-2.5">
            {p.suggestedActions.map((a, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 size={17} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <span className="text-[13.5px] text-stone-700">{a}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
