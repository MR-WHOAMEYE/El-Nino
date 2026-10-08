import React from 'react';
import { useSimStore } from '../store/useSimStore.js';
import { MapPin, Droplets, Thermometer, ChevronRight } from 'lucide-react';

export default function DistrictListTab() {
  const evaluatedDistricts = useSimStore((state) => state.evaluatedDistricts);
  const selectedDistrictId = useSimStore((state) => state.selectedDistrictId);
  const setSelectedDistrict = useSimStore((state) => state.setSelectedDistrict);
  const setCameraPreset = useSimStore((state) => state.setCameraPreset);
  const colorBlindMode = useSimStore((state) => state.colorBlindMode);

  return (
    <div className="space-y-2 text-xs select-none">
      <div className="text-[11px] text-slate-400 mb-2">
        Click any community to view local teleconnection mechanics, seasonal breakdown, and vulnerability scores:
      </div>

      <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
        {evaluatedDistricts.map((d) => {
          const isSelected = selectedDistrictId === d.id;
          const isDeficit = d.rainfallAnomaly < 0;

          return (
            <button
              key={d.id}
              onClick={() => {
                setSelectedDistrict(d.id);
                if (d.country === 'India' || d.country === 'Bangladesh' || d.country === 'Sri Lanka') {
                  setCameraPreset('indiaFocus');
                } else if (d.country === 'Peru') {
                  setCameraPreset('overview');
                } else {
                  setCameraPreset('southeastAsiaFocus');
                }
              }}
              className={`w-full text-left p-2.5 rounded-lg transition-all border flex items-center justify-between ${
                isSelected
                  ? 'bg-sky-950/90 border-sky-600 ring-1 ring-sky-500/40'
                  : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800/80'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span className="font-semibold text-slate-100 text-[11px]">{d.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({d.country})</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                  <span>Vuln: {(d.vulnerabilityScore * 100).toFixed(0)}</span>
                  <span>•</span>
                  <span>Risk: {d.effectiveRisk}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <span
                    className={`font-mono font-bold block text-[11px] ${
                      isDeficit
                        ? colorBlindMode ? 'text-amber-400' : 'text-rose-400'
                        : 'text-sky-400'
                    }`}
                  >
                    {d.rainfallAnomaly > 0 ? `+${d.rainfallAnomaly}%` : `${d.rainfallAnomaly}%`}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">rain anomaly</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
