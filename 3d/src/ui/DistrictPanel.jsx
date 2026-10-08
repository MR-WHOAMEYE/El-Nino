import React from 'react';
import { useSimStore } from '../store/useSimStore.js';
import { generateAnnualProfile } from '../simulation/teleconnections.js';
import { MapPin, Droplets, Thermometer, ShieldAlert, BarChart3, Info, X } from 'lucide-react';

export default function DistrictPanel() {
  const selectedDistrictId = useSimStore((state) => state.selectedDistrictId);
  const setSelectedDistrict = useSimStore((state) => state.setSelectedDistrict);
  const evaluatedDistricts = useSimStore((state) => state.evaluatedDistricts);
  const nino34 = useSimStore((state) => state.nino34);
  const colorBlindMode = useSimStore((state) => state.colorBlindMode);

  const district = evaluatedDistricts.find((d) => d.id === selectedDistrictId);

  if (!district) return null;

  const annualProfile = generateAnnualProfile(district.id, nino34);

  return (
    <div className="bg-slate-900/95 backdrop-blur rounded-lg border border-slate-800 p-4 text-xs shadow-xl space-y-3.5 select-none max-w-sm">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-sky-950 border border-sky-800/60 text-sky-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">{district.name}</h3>
            <span className="text-[11px] text-slate-400">{district.country} • Pop: {(district.population / 1000000).toFixed(1)}M</span>
          </div>
        </div>

        <button
          onClick={() => setSelectedDistrict(null)}
          className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Hazard Status & Anomaly Numbers */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block">Rainfall Anomaly</span>
            <span
              className={`font-mono font-bold text-sm ${
                district.rainfallAnomaly < 0 ? 'text-rose-400' : 'text-sky-400'
              }`}
            >
              {district.rainfallAnomaly > 0 ? `+${district.rainfallAnomaly}%` : `${district.rainfallAnomaly}%`}
            </span>
          </div>
        </div>

        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center space-x-2">
          <Thermometer className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block">Temp Anomaly</span>
            <span className="font-mono font-bold text-sm text-amber-300">
              {district.temperatureAnomaly > 0 ? `+${district.temperatureAnomaly}°C` : `${district.temperatureAnomaly}°C`}
            </span>
          </div>
        </div>
      </div>

      {/* Hazard Classification & Teleconnection Confidence */}
      <div className="flex items-center justify-between bg-slate-950/80 px-2.5 py-1.5 rounded border border-slate-800 text-[11px]">
        <span className="text-slate-400">Hazard Status:</span>
        <span
          className={`font-semibold ${
            district.hazardType.includes('Drought')
              ? 'text-rose-400'
              : district.hazardType.includes('Flood') || district.hazardType.includes('Excess')
              ? 'text-sky-300'
              : 'text-emerald-400'
          }`}
        >
          {district.hazardType}
        </span>
        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
          Conf: {district.confidence}
        </span>
      </div>

      {/* 12-Month Teleconnection Annual Profile with Pure SVG Bars */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span className="flex items-center space-x-1">
            <BarChart3 className="w-3 h-3 text-sky-400" />
            <span>12-Month Rainfall Anomaly (%)</span>
          </span>
          <span className="text-[10px] font-mono">Under {nino34 > 0 ? `+${nino34.toFixed(1)}` : nino34.toFixed(1)}°C Nino</span>
        </div>
        <div className="h-24 w-full bg-slate-950 rounded border border-slate-800 p-2 flex flex-col justify-end">
          <svg viewBox="0 0 240 60" className="w-full h-full">
            {/* Zero line */}
            <line x1="0" y1="30" x2="240" y2="30" stroke="#334155" strokeWidth="1" />
            {annualProfile.map((item, idx) => {
              const barWidth = 14;
              const x = idx * 20 + 2;
              const val = Math.max(-40, Math.min(40, item.rainfallAnomaly || 0));
              const barHeight = (Math.abs(val) / 40) * 26;
              const y = val >= 0 ? 30 - barHeight : 30;
              const color = val < 0 ? (colorBlindMode ? '#d97706' : '#f43f5e') : '#38bdf8';

              return (
                <g key={item.monthName}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={Math.max(1, barHeight)}
                    fill={color}
                    rx="1.5"
                  />
                  <text x={x + barWidth / 2} y="58" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="sans-serif">
                    {item.monthName}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>


      {/* Socioeconomic Vulnerability Breakdown */}
      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
          <span className="flex items-center space-x-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Vulnerability Index:</span>
          </span>
          <span className="font-mono text-amber-300">{(district.vulnerabilityScore * 100).toFixed(0)}/100</span>
        </div>

        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-400">
          <div>Poverty Rate: <span className="text-slate-200 font-mono">{(district.povertyRate * 100).toFixed(0)}%</span></div>
          <div>Irrigation Cover: <span className="text-slate-200 font-mono">{(district.irrigationCoverage * 100).toFixed(0)}%</span></div>
          <div>Crop Dependence: <span className="text-slate-200 font-mono">{(district.cropDependence * 100).toFixed(0)}%</span></div>
          <div>Housing Fragility: <span className="text-slate-200 font-mono">{(district.housingFragility * 100).toFixed(0)}%</span></div>
        </div>
      </div>

      {/* Plain Language Teleconnection Summary */}
      <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed flex items-start space-x-2">
        <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
        <p>{district.mechanism}</p>
      </div>
    </div>
  );
}
