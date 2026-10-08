import React, { useMemo } from 'react';
import { useSimStore } from '../store/useSimStore.js';
import { computeAllRegionDistances } from '../utils/teleconnectionsDistance.js';
import { Globe, MapPin, Clock, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export default function FarReachPanel() {
  const warmPoolX = useSimStore((state) => state.warmPoolX);
  const nino34 = useSimStore((state) => state.nino34);
  const month = useSimStore((state) => state.month);
  const selectedRegionId = useSimStore((state) => state.selectedRegionId);
  const setSelectedRegion = useSimStore((state) => state.setSelectedRegion);
  const setCameraPreset = useSimStore((state) => state.setCameraPreset);
  const colorBlindMode = useSimStore((state) => state.colorBlindMode);

  // All regions sorted by distance from the warm pool
  const regionDistances = useMemo(() => {
    return computeAllRegionDistances(warmPoolX, nino34, month);
  }, [warmPoolX, nino34, month]);

  const handleRegionClick = (reg) => {
    setSelectedRegion(reg.id);

    // Fly camera smoothly to corresponding regional perspective
    if (reg.id.includes('india') || reg.id === 'south-asia-other') {
      setCameraPreset('indiaFocus');
    } else if (reg.id.includes('africa')) {
      setCameraPreset('africaFocus');
    } else if (reg.id.includes('brazil') || reg.id.includes('peru') || reg.id.includes('us-southwest')) {
      setCameraPreset('southAmericaFocus');
    } else if (reg.id.includes('australia') || reg.id === 'indonesia' || reg.id === 'philippines') {
      setCameraPreset('southeastAsiaFocus');
    } else {
      setCameraPreset('overview');
    }
  };

  return (
    <div className="space-y-3.5 text-xs select-none">
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-slate-200 font-semibold">
          <span className="flex items-center space-x-1.5">
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>Teleconnection Distance & Lag</span>
          </span>
          <span className="text-[10px] text-sky-400 font-mono">Sorted by Distance</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-normal">
          Atmospheric Rossby waves and Walker overturning transport ENSO anomalies thousands of kilometers away, with characteristic seasonal arrival lags.
        </p>
      </div>

      {/* Ranked Region Cards */}
      <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
        {regionDistances.map((reg) => {
          const isSelected = selectedRegionId === reg.id;
          const isDrought = reg.rainfallAnomaly < 0;

          return (
            <div
              key={reg.id}
              onClick={() => handleRegionClick(reg)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-sky-950/90 border-sky-500 ring-1 ring-sky-500/40 shadow-md'
                  : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800/80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-100 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>{reg.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center space-x-2 mt-0.5">
                    <span className="font-mono text-sky-300 font-medium">{reg.distanceKm.toLocaleString()} km away</span>
                    <span>•</span>
                    <span className="flex items-center space-x-0.5 font-mono text-slate-300">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{reg.lagMonths}mo lag</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-mono font-bold block text-sm ${
                      isDrought
                        ? colorBlindMode ? 'text-amber-400' : 'text-rose-400'
                        : reg.rainfallAnomaly > 0
                        ? 'text-sky-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {reg.rainfallAnomaly > 0 ? `+${reg.rainfallAnomaly}%` : `${reg.rainfallAnomaly}%`}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono capitalize">
                    {reg.hazard} ({reg.confidence})
                  </span>
                </div>
              </div>

              <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 text-[10px] text-slate-400 line-clamp-1 flex items-center justify-between">
                <span className="truncate pr-2">{reg.note}</span>
                <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
