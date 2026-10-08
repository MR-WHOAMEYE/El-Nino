import React from 'react';
import { useSimStore } from '../store/useSimStore.js';
import { Sliders, Eye, Zap, Layers, Palette, Monitor } from 'lucide-react';

export default function ControlPanel() {
  const tradeWind = useSimStore((state) => state.tradeWind);
  const setTradeWind = useSimStore((state) => state.setTradeWind);
  const warmPoolX = useSimStore((state) => state.warmPoolX);
  const setWarmPoolX = useSimStore((state) => state.setWarmPoolX);
  const playbackSpeed = useSimStore((state) => state.playbackSpeed);
  const setPlaybackSpeed = useSimStore((state) => state.setPlaybackSpeed);

  // Layer toggles
  const showWindField = useSimStore((state) => state.showWindField);
  const showRainField = useSimStore((state) => state.showRainField);
  const showClouds = useSimStore((state) => state.showClouds);
  const toggleShowClouds = useSimStore((state) => state.toggleShowClouds);
  const cloudXRay = useSimStore((state) => state.cloudXRay);
  const toggleCloudXRay = useSimStore((state) => state.toggleCloudXRay);
  const showThermocline = useSimStore((state) => state.showThermocline);
  const showTeleconnections = useSimStore((state) => state.showTeleconnections ?? true);
  const showDistanceRings = useSimStore((state) => state.showDistanceRings ?? true);
  const toggleLayer = useSimStore((state) => state.toggleLayer);

  // Performance & Accessibility
  const autoRotate = useSimStore((state) => state.autoRotate);
  const toggleAutoRotate = useSimStore((state) => state.toggleAutoRotate);
  const lowGraphicsMode = useSimStore((state) => state.lowGraphicsMode);
  const setLowGraphicsMode = useSimStore((state) => state.setLowGraphicsMode);
  const colorBlindMode = useSimStore((state) => state.colorBlindMode);
  const setColorBlindMode = useSimStore((state) => state.setColorBlindMode);

  return (
    <div className="space-y-4 text-xs select-none">
      {/* Physical Forcing Manual Sliders */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-slate-200 font-semibold">
          <span className="flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            <span>Interactive Ocean-Atmosphere Sliders</span>
          </span>
        </div>

        {/* Trade Wind Strength */}
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Trade Wind Strength:</span>
            <span className="font-mono text-sky-400 font-bold">{(tradeWind * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.02"
            value={tradeWind}
            onChange={(e) => setTradeWind(parseFloat(e.target.value))}
            className="w-full accent-sky-500 h-1.5 bg-slate-800 rounded cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
            <span>Weak (El Niño onset)</span>
            <span>0.6 Baseline</span>
            <span>Strong (La Niña)</span>
          </div>
        </div>

        {/* Warm Pool Zonal Position */}
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Warm Pool Center Position:</span>
            <span className="font-mono text-amber-400 font-bold">{(warmPoolX * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.05"
            max="0.95"
            step="0.02"
            value={warmPoolX}
            onChange={(e) => setWarmPoolX(parseFloat(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
            <span>Western Pacific (130°E)</span>
            <span>Date Line</span>
            <span>Eastern Pacific (90°W)</span>
          </div>
        </div>
      </div>

      {/* Layer Visibility Toggles */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-slate-200 font-semibold">
          <span className="flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>3D Visual Layers</span>
          </span>
        </div>

        <div className="space-y-1.5">
          {[
            { key: 'showClouds', label: 'Atmospheric Cloud Decks', active: showClouds, onToggle: toggleShowClouds },
            { key: 'cloudXRay', label: 'Cloud X-Ray Translucency (Key C)', active: cloudXRay, onToggle: toggleCloudXRay },
            { key: 'showRainField', label: 'Monsoon & Convective Rain Shafts', active: showRainField, onToggle: () => toggleLayer('showRainField') },
            { key: 'showWindField', label: 'Equatorial Trade Winds & Walker Loop', active: showWindField, onToggle: () => toggleLayer('showWindField') },
            { key: 'showThermocline', label: 'Subsurface Thermocline Tilt (20°C Isotherm)', active: showThermocline, onToggle: () => toggleLayer('showThermocline') },
            { key: 'showTeleconnections', label: 'Teleconnection Rossby Arcs', active: showTeleconnections, onToggle: () => toggleLayer('showTeleconnections') },
            { key: 'showDistanceRings', label: 'Distance from Source Concentric Rings', active: showDistanceRings, onToggle: () => toggleLayer('showDistanceRings') }
          ].map((item) => (
            <button
              key={item.key}
              onClick={item.onToggle}
              className="w-full flex items-center justify-between p-2 rounded bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 text-left transition-colors"
            >
              <span className="text-slate-300 text-[11px]">{item.label}</span>
              <span
                className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                  item.active
                    ? 'bg-sky-600 border-sky-500 text-white'
                    : 'bg-slate-800 border-slate-700'
                }`}
              >
                {item.active && <Eye className="w-2.5 h-2.5" />}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Performance & Accessibility Toggles */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-slate-200 font-semibold">
          <span className="flex items-center space-x-1.5">
            <Monitor className="w-3.5 h-3.5 text-amber-400" />
            <span>Hardware & Accessibility</span>
          </span>
        </div>

        <div className="space-y-1.5">
          {/* Auto-rotate Camera Toggle (defaults to OFF) */}
          <button
            onClick={toggleAutoRotate}
            className="w-full flex items-center justify-between p-2 rounded bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 text-left transition-colors"
          >
            <div>
              <span className="text-slate-300 text-[11px] block font-medium">Auto-rotate Camera</span>
              <span className="text-slate-500 text-[10px]">Slow continuous panoramic rotation</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                autoRotate ? 'bg-sky-950 text-sky-400 border border-sky-800' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {autoRotate ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Low Graphics Mode */}
          <button
            onClick={() => setLowGraphicsMode(!lowGraphicsMode)}
            className="w-full flex items-center justify-between p-2 rounded bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 text-left transition-colors"
          >
            <div>
              <span className="text-slate-300 text-[11px] block font-medium">Low Graphics Mode</span>
              <span className="text-slate-500 text-[10px]">Halves particles & ocean mesh for projectors</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                lowGraphicsMode ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {lowGraphicsMode ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Color-blind Safe Palette */}
          <button
            onClick={() => setColorBlindMode(!colorBlindMode)}
            className="w-full flex items-center justify-between p-2 rounded bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 text-left transition-colors"
          >
            <div>
              <span className="text-slate-300 text-[11px] block font-medium">Color-Blind Safe Palette</span>
              <span className="text-slate-500 text-[10px]">Blue-Amber diverging colormap</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                colorBlindMode ? 'bg-sky-950 text-sky-400 border border-sky-800' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {colorBlindMode ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
