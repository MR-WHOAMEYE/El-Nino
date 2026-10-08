import React from 'react';
import { useSimStore } from '../store/useSimStore.js';
import { Layers, Eye, Camera } from 'lucide-react';

export default function Legend() {
  const cameraPreset = useSimStore((state) => state.cameraPreset);
  const setCameraPreset = useSimStore((state) => state.setCameraPreset);
  const colorBlindMode = useSimStore((state) => state.colorBlindMode);

  return (
    <div className="bg-slate-900/90 backdrop-blur rounded-lg border border-slate-800 p-3 text-xs space-y-3 shadow-lg select-none">
      <div className="flex items-center space-x-1.5 text-slate-300 font-semibold border-b border-slate-800 pb-1.5">
        <Layers className="w-3.5 h-3.5 text-sky-400" />
        <span>3D Scene Legend</span>
      </div>

      {/* Rainfall Anomaly Columns */}
      <div className="space-y-1.5">
        <div className="text-[11px] text-slate-400 font-medium">District Rainfall Anomaly (Column Height):</div>
        <div className="flex items-center space-x-2 text-[11px]">
          <span className={`w-3 h-3 rounded-sm ${colorBlindMode ? 'bg-amber-600' : 'bg-rose-500'}`} />
          <span className="text-slate-300">Deficit / Drought Risk (&lt; -10%)</span>
        </div>
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="w-3 h-3 rounded-sm bg-sky-400" />
          <span className="text-slate-300">Surplus / Heavy Monsoon (&gt; +15%)</span>
        </div>
      </div>

      {/* SST Ocean Anomaly Gradient */}
      <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
        <div className="text-[11px] text-slate-400 font-medium">Ocean SST Anomaly:</div>
        <div className="h-2 w-full rounded bg-gradient-to-r from-blue-700 via-slate-800 to-rose-600 border border-slate-700" />
        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>-3.0°C (Cold Tongue)</span>
          <span>0.0°C</span>
          <span>+3.0°C (Warm Pool)</span>
        </div>
      </div>

      {/* Quick Camera Preset Switcher */}
      <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
        <div className="text-[11px] text-slate-400 font-medium flex items-center space-x-1">
          <Camera className="w-3 h-3 text-slate-400" />
          <span>Camera Perspectives (Keys 1-5):</span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-[11px]">
          {[
            { id: 'overview', label: '1. World Overview' },
            { id: 'indiaFocus', label: '2. India & Ocean' },
            { id: 'southeastAsiaFocus', label: '3. SE Asia / Aus' },
            { id: 'southAmericaFocus', label: '4. Americas / Peru' },
            { id: 'africaFocus', label: '5. Africa Corridor' },
            { id: 'walker', label: '6. Walker Loop' },
            { id: 'crossSection', label: '7. Thermocline Tilt' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCameraPreset(item.id)}
              className={`px-2 py-1 rounded text-left truncate transition-colors ${
                cameraPreset === item.id
                  ? 'bg-sky-950 text-sky-300 border border-sky-800 font-semibold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
