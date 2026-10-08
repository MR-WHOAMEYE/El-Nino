/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useSimStore, getSeasonLabel, formatMonthLabel } from '../store/useSimStore.js';
import { useLiveStore } from '../store/liveStore.js';
import DistrictPanel from './DistrictPanel.jsx';
import { SCENARIO_PRESETS } from '../simulation/scenarios.js';
import { Flame, Wind, Layers, Eye, EyeOff, Radio, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MainHUD({ isVisible = true }) {
  const nino34 = useSimStore((state) => state.nino34);
  const phase = useSimStore((state) => state.phase);
  const month = useSimStore((state) => state.month);
  const elapsedMonths = useSimStore((state) => state.elapsedMonths);
  const activeScenarioId = useSimStore((state) => state.activeScenarioId);
  const colorBlindMode = useSimStore((state) => state.colorBlindMode);
  const selectedDistrictId = useSimStore((state) => state.selectedDistrictId);
  const mainConnected = useLiveStore((state) => state.mainConnected);

  if (!isVisible) {
    return (
      <div className="absolute top-3 right-3 z-30 pointer-events-auto">
        <span className="text-[10px] font-mono bg-slate-900/60 backdrop-blur px-2 py-1 rounded text-slate-500 border border-slate-800">
          HUD Hidden (Press H)
        </span>
      </div>
    );
  }

  const activeScenario = SCENARIO_PRESETS.find((p) => p.id === activeScenarioId) || {
    name: 'Climatological Baseline'
  };

  const getPhaseBadge = () => {
    const formattedVal = (nino34 >= 0 ? `+${nino34.toFixed(2)}` : nino34.toFixed(2)) + '°C';
    if (phase === 'el_nino' || nino34 > 0.5) {
      return {
        text: `El Niño (${formattedVal})`,
        cls: 'bg-rose-950/90 text-rose-300 border-rose-700 shadow-rose-950/50'
      };
    }
    if (phase === 'la_nina' || nino34 < -0.5) {
      return {
        text: `La Niña (${formattedVal})`,
        cls: 'bg-sky-950/90 text-sky-300 border-sky-700 shadow-sky-950/50'
      };
    }
    if (phase === 'modoki') {
      return {
        text: `Modoki (${formattedVal})`,
        cls: 'bg-amber-950/90 text-amber-300 border-amber-700 shadow-amber-950/50'
      };
    }
    return {
      text: `Neutral (${formattedVal})`,
      cls: 'bg-emerald-950/90 text-emerald-300 border-emerald-700 shadow-emerald-950/50'
    };
  };

  const phaseBadge = getPhaseBadge();

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-6 select-none font-sans text-slate-100">
      {/* 1. TOP BAR */}
      <div className="flex items-start justify-between">
        {/* Top-Left: Project Title, Scenario, and Phase Badge */}
        <div className="pointer-events-auto flex flex-col space-y-1.5 bg-slate-950/80 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 shadow-2xl max-w-sm">
          <div className="flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">ENSO Climate Engine</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <h1 className="text-sm sm:text-base font-bold text-slate-100">{activeScenario.name}</h1>
          </div>

          <div className="flex items-center space-x-2 pt-0.5">
            <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-md border shadow-sm ${phaseBadge.cls}`}>
              {phaseBadge.text}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Niño 3.4 SST</span>
          </div>
        </div>

        {/* Top-Right: Season Label & Month Indicator */}
        <div className="pointer-events-auto flex flex-col items-end bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-2xl text-right">
          <div className="text-xs font-bold text-sky-300">
            {getSeasonLabel(month)}
          </div>
          <div className="text-sm sm:text-base font-mono font-bold text-slate-100">
            {formatMonthLabel(elapsedMonths || 0)}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Month {Math.floor(elapsedMonths || 0) % 12 + 1} of 12
          </div>
        </div>
      </div>

      {/* Floating District Readout Card if Selected */}
      {selectedDistrictId && (
        <div className="pointer-events-auto absolute top-28 left-6 z-30">
          <DistrictPanel />
        </div>
      )}

      {/* 2. BOTTOM BAR */}
      <div className="flex items-end justify-between pt-4">
        {/* Bottom-Left: Color Legend */}
        <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-2xl space-y-2 text-xs max-w-xs">
          <div className="flex items-center justify-between text-slate-300 font-semibold border-b border-slate-800/80 pb-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">3D Climate Legend</span>
            <span className="text-[10px] font-mono text-slate-500">Key H to toggle</span>
          </div>

          {/* Rainfall Anomaly */}
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400">Regional Rainfall Anomaly:</div>
            <div className="flex items-center space-x-3 text-[11px]">
              <div className="flex items-center space-x-1.5">
                <span className={`w-2.5 h-2.5 rounded-sm ${colorBlindMode ? 'bg-amber-600' : 'bg-rose-500'}`} />
                <span className="text-slate-300">Drought (&lt; -10%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" />
                <span className="text-slate-300">Surplus (&gt; +15%)</span>
              </div>
            </div>
          </div>

          {/* Ocean SST Anomaly Gradient */}
          <div className="space-y-1 pt-1 border-t border-slate-800/60">
            <div className="text-[10px] text-slate-400">Ocean Thermal Gradient (SST):</div>
            <div className="h-1.5 w-full rounded bg-gradient-to-r from-blue-700 via-slate-800 to-rose-600 border border-slate-700" />
            <div className="flex justify-between text-[9px] font-mono text-slate-400">
              <span>-3°C (Cold Tongue)</span>
              <span>0°C</span>
              <span>+3°C (Warm Pool)</span>
            </div>
          </div>
        </div>

        {/* Bottom-Right: Controller Connection Chip & Link */}
        <div className="pointer-events-auto flex flex-col items-end space-y-1.5 bg-slate-950/85 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-2xl">
          <div className="flex items-center space-x-2">
            <span className={`h-2 w-2 rounded-full ${mainConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className="text-xs font-semibold text-slate-200">
              {mainConnected ? 'Controller connected (LAN / Local)' : 'No controller connected'}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
            <span>Open</span>
            <Link
              to="/control"
              target="_blank"
              className="font-mono text-sky-400 hover:text-sky-300 underline font-semibold flex items-center space-x-0.5"
            >
              <span>/control</span>
              <ExternalLink className="w-2.5 h-2.5 inline" />
            </Link>
            <span>or on mobile / tablet Wi-Fi</span>
          </div>

          <div className="text-[10px] text-slate-500 font-mono pt-0.5">
            Shortcuts: [H] HUD &bull; [F] Fullscreen &bull; [C] Cloud X-Ray
          </div>
        </div>
      </div>
    </div>
  );
}
