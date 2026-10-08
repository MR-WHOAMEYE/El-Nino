import React from 'react';
import { useSimStore } from '../store/useSimStore.js';
import { Activity, Wind, Waves, Flame, AlertCircle, ChevronRight } from 'lucide-react';

export default function ENSOReadout() {
  const nino34 = useSimStore((state) => state.nino34);
  const phase = useSimStore((state) => state.phase);
  const tradeWind = useSimStore((state) => state.tradeWind);
  const heatContent = useSimStore((state) => state.heatContent);
  const evaluatedDistricts = useSimStore((state) => state.evaluatedDistricts);
  const colorBlindMode = useSimStore((state) => state.colorBlindMode);

  // Top 3 vulnerable/at-risk locations right now
  const top3 = evaluatedDistricts.slice(0, 3);

  // Determine color styling for ENSO phase
  let phaseBadgeColor = 'bg-slate-800 text-slate-300 border-slate-700';
  if (phase.includes('El Niño')) {
    phaseBadgeColor = colorBlindMode
      ? 'bg-amber-950/80 text-amber-300 border-amber-600'
      : 'bg-rose-950/80 text-rose-300 border-rose-600';
  } else if (phase.includes('La Niña')) {
    phaseBadgeColor = 'bg-sky-950/80 text-sky-300 border-sky-600';
  }

  // Active step in ENSO physical causal chain:
  // Step 1: Weakening Trade Winds
  // Step 2: Warm Pool Migration
  // Step 3: Thermocline Tilt Collapse
  // Step 4: Convective Cloud Shift
  // Step 5: Regional Teleconnection Rainfall
  let activeStep = 1;
  if (tradeWind < 0.55 || tradeWind > 0.65) activeStep = 1;
  if (Math.abs(nino34) >= 0.5) activeStep = 2;
  if (Math.abs(nino34) >= 1.0) activeStep = 3;
  if (Math.abs(nino34) >= 1.5) activeStep = 4;
  if (Math.abs(nino34) >= 1.8) activeStep = 5;

  const chainSteps = [
    { num: 1, label: 'Trade Winds Relax' },
    { num: 2, label: 'Warm Pool Migrates' },
    { num: 3, label: 'Thermocline Flattens' },
    { num: 4, label: 'Convection Shifts' },
    { num: 5, label: 'Rainfall & Heat Disrupted' }
  ];

  return (
    <div className="bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs select-none">
      {/* Phase Badge & Nino 3.4 Metric */}
      <div className="flex items-center space-x-3">
        <div className={`px-2.5 py-1 rounded font-semibold border flex items-center space-x-1.5 shadow-sm ${phaseBadgeColor}`}>
          <Activity className="w-3.5 h-3.5" />
          <span>{phase}</span>
        </div>

        <div className="flex items-baseline space-x-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
          <span className="text-slate-400 font-mono text-[11px]">Niño 3.4 SST:</span>
          <span className={`font-mono font-bold text-sm ${nino34 >= 0 ? 'text-amber-400' : 'text-sky-400'}`}>
            {nino34 > 0 ? `+${nino34.toFixed(2)}` : nino34.toFixed(2)}°C
          </span>
        </div>

        <div className="hidden sm:flex items-center space-x-2 bg-slate-950 px-2 py-1 rounded border border-slate-800 text-[11px] font-mono text-slate-300">
          <Wind className="w-3.5 h-3.5 text-slate-400" />
          <span>Trade: {(tradeWind * 100).toFixed(0)}%</span>
          <span className="text-slate-600">|</span>
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>Heat: {heatContent > 0 ? `+${heatContent.toFixed(2)}` : heatContent.toFixed(2)}</span>
        </div>
      </div>

      {/* Causal Chain Progress */}
      <div className="hidden xl:flex items-center space-x-1 bg-slate-950/70 px-3 py-1 rounded-full border border-slate-800 text-[11px]">
        <span className="text-slate-400 font-medium mr-1">Physical Chain:</span>
        {chainSteps.map((step, idx) => (
          <React.Fragment key={step.num}>
            <span
              className={`px-1.5 py-0.5 rounded transition-colors ${
                activeStep >= step.num
                  ? 'text-sky-300 font-semibold bg-sky-950/60 border border-sky-800/60'
                  : 'text-slate-500'
              }`}
            >
              {step.num}. {step.label}
            </span>
            {idx < chainSteps.length - 1 && <ChevronRight className="w-3 h-3 text-slate-600" />}
          </React.Fragment>
        ))}
      </div>

      {/* Top 3 Highest Risk Communities */}
      <div className="flex items-center space-x-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
        <span className="text-slate-400 text-[11px]">Highest Risk:</span>
        <div className="flex items-center space-x-1 font-semibold">
          {top3.map((d, i) => (
            <span key={d.id} className="text-rose-300 text-[11px]">
              {d.name}{i < top3.length - 1 ? ',' : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
