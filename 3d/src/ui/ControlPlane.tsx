import React, { useState } from 'react';
import { useSimStore } from '../store/useSimStore.js';
import Scene from '../components/Scene.jsx';
import ScenarioBar from './ScenarioBar.jsx';
import EquityPanel from './EquityPanel.jsx';
import FarReachPanel from './FarReachPanel.jsx';
import DistrictListTab from './DistrictListTab.jsx';
import {
  Sliders,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Wind,
  Flame,
  Waves,
  Layers,
  Eye,
  EyeOff,
  Globe,
  Compass,
  Scale,
  MapPin,
  Camera,
  Zap,
  ArrowLeft,
  Calendar,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface ControlPlaneProps {
  onNavigateToGlobe?: () => void;
}

export default function ControlPlane({ onNavigateToGlobe }: ControlPlaneProps) {
  const store = useSimStore();
  const [activeSection, setActiveSection] = useState<'simulation' | 'scenarios' | 'equity' | 'teleconnections' | 'districts' | 'visuals'>('simulation');

  const getPhaseBadge = (phase: string) => {
    switch (phase) {
      case 'el_nino':
        return 'bg-rose-950 text-rose-300 border-rose-700';
      case 'la_nina':
        return 'bg-sky-950 text-sky-300 border-sky-700';
      case 'modoki':
        return 'bg-amber-950 text-amber-300 border-amber-700';
      default:
        return 'bg-emerald-950 text-emerald-300 border-emerald-700';
    }
  };

  const navTabs = [
    { id: 'simulation', label: 'Engine & Physics', icon: Sliders },
    { id: 'scenarios', label: 'Scenarios & Tour', icon: Compass },
    { id: 'equity', label: 'Equity & Policy', icon: Scale },
    { id: 'teleconnections', label: 'Far-Reach Impacts', icon: Globe },
    { id: 'districts', label: 'Communities & Districts', icon: MapPin },
    { id: 'visuals', label: '3D Layers & Camera', icon: Layers }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 shadow-xl">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              if (onNavigateToGlobe) {
                onNavigateToGlobe();
              } else {
                window.location.pathname = '/';
              }
            }}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold shadow-sm transition-all hover:border-sky-500/50"
          >
            <ArrowLeft className="w-4 h-4 text-sky-400" />
            <span>Full-Screen 3D Globe</span>
          </button>

          <div className="h-5 w-px bg-slate-800" />

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold text-slate-100 tracking-tight">ENSO Simulation Control Center</h1>
              <span className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded-full border ${getPhaseBadge(store.phase)}`}>
                {store.phase ? store.phase.toUpperCase().replace('_', ' ') : 'NEUTRAL'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Complete web control station with live 3D hydrodynamic feedback</p>
          </div>
        </div>

        {/* Global Playback Quick Controls */}
        <div className="flex items-center space-x-3 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="flex items-center space-x-2">
            <button
              onClick={store.togglePlay}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                store.isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {store.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{store.isPlaying ? 'PAUSE' : 'RUN'}</span>
            </button>

            <button
              onClick={() => store.stepSim(0.5)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
              title="Advance 0.5 months"
            >
              +0.5 Mo
            </button>

            <button
              onClick={store.resetSim}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
              title="Reset simulation"
            >
              Reset
            </button>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <div className="text-xs font-mono text-slate-300">
            <span className="text-slate-500">Timeline:</span>{' '}
            <span className="text-sky-400 font-bold">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][store.month % 12]} (Mo {Math.floor(store.elapsedMonths || 0)})
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto space-y-6">
        {/* Top Split View: Embedded Live 3D Viewport + Real-Time Telemetry HUD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Live 3D Simulation Viewport (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[380px] lg:h-[440px] relative">
            <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between z-10">
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Live 3D Simulation Viewport</span>
                <span className="text-[10px] text-slate-500 font-mono">(Updates in real-time)</span>
              </div>

              {/* Camera Presets Mini Toolbar */}
              <div className="flex items-center space-x-1">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'walker', label: 'Walker' },
                  { id: 'crossSection', label: 'Tilt' },
                  { id: 'indiaFocus', label: 'India' },
                  { id: 'southeastAsiaFocus', label: 'SE Asia' }
                ].map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => store.setCameraPreset(cam.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                      store.cameraPreset === cam.id
                        ? 'bg-sky-950 border-sky-500 text-sky-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cam.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Embedded 3D Canvas */}
            <div className="relative flex-1 w-full h-full bg-slate-950">
              <Scene />
            </div>
          </div>

          {/* Real-time Telemetry & Quick Physics Actuators (5 cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {/* Telemetry Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Niño 3.4 SST Index</span>
                </div>
                <div className={`text-2xl font-bold font-mono ${store.nino34 > 0.5 ? 'text-rose-400' : store.nino34 < -0.5 ? 'text-sky-400' : 'text-emerald-400'}`}>
                  {store.nino34 >= 0 ? `+${store.nino34.toFixed(2)}` : store.nino34.toFixed(2)}°C
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Thermal Anomaly</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
                  <Wind className="w-4 h-4 text-sky-400" />
                  <span>Trade Wind Stress</span>
                </div>
                <div className="text-2xl font-bold font-mono text-sky-300">
                  {(store.tradeWind * 100).toFixed(0)}%
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Normal: 60%</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
                  <Waves className="w-4 h-4 text-teal-400" />
                  <span>Subsurface Heat</span>
                </div>
                <div className="text-2xl font-bold font-mono text-teal-300">
                  {store.heatContent >= 0 ? `+${store.heatContent.toFixed(2)}` : store.heatContent.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">20°C Isotherm Depth</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>Month & Speed</span>
                </div>
                <div className="text-xl font-bold font-mono text-indigo-300">
                  Mo {Math.floor(store.elapsedMonths || 0)} ({store.playbackSpeed}x)
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][store.month % 12]}
                </div>
              </div>
            </div>

            {/* Quick Physics Forcings */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Quick Hydrodynamic Forcings</span>
                <button
                  onClick={store.triggerWesterlyBurst}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 text-[11px] font-semibold transition-colors"
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Pulse Kelvin Wave</span>
                </button>
              </div>

              {/* Trade Wind Slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Trade Wind Strength:</span>
                  <span className="font-mono text-sky-400 font-bold bg-sky-950 px-2 py-0.5 rounded border border-sky-800 text-[11px]">
                    {(store.tradeWind * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.02"
                  value={store.tradeWind}
                  onChange={(e) => store.setTradeWind(parseFloat(e.target.value))}
                  className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Warm Pool Slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Warm Pool Centroid:</span>
                  <span className="font-mono text-amber-400 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-800 text-[11px]">
                    {(store.warmPoolX * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.95"
                  step="0.02"
                  value={store.warmPoolX}
                  onChange={(e) => store.setWarmPoolX(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation for Detailed Control Suites */}
        <div className="border-b border-slate-800 bg-slate-900/60 p-2 rounded-xl flex items-center space-x-2 overflow-x-auto scrollbar-none">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-900/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/70'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Cards */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          {/* SECTION 1: Engine & Physical Forcings Details */}
          {activeSection === 'simulation' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-base font-bold text-slate-100">Equatorial Atmosphere-Ocean Coupling Engine</h2>
                <p className="text-xs text-slate-400">Control physical atmospheric forcings and observe real-time 3D wave response</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Trade Wind Slider */}
                <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-200 font-semibold">Equatorial Easterly Trade Wind Velocity:</span>
                    <span className="font-mono text-sky-400 font-bold bg-sky-950 border border-sky-800 px-2.5 py-1 rounded">
                      {(store.tradeWind * 100).toFixed(0)}% (τ: {store.tradeWind.toFixed(2)})
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.02"
                    value={store.tradeWind}
                    onChange={(e) => store.setTradeWind(parseFloat(e.target.value))}
                    className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>Weak / Relaxed (0.10)</span>
                    <span>Normal Baseline (0.60)</span>
                    <span>Strong Upwelling (1.00)</span>
                  </div>
                </div>

                {/* Warm Pool Zonal Position */}
                <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-200 font-semibold">Warm Pool Centroid Zonal Placement:</span>
                    <span className="font-mono text-amber-400 font-bold bg-amber-950 border border-amber-800 px-2.5 py-1 rounded">
                      {(store.warmPoolX * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.95"
                    step="0.02"
                    value={store.warmPoolX}
                    onChange={(e) => store.setWarmPoolX(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>West Pacific (130°E)</span>
                    <span>Date Line (180°)</span>
                    <span>East Pacific (90°W)</span>
                  </div>
                </div>
              </div>

              {/* Simulation Clock & Playback Rate */}
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={store.togglePlay}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md ${
                      store.isPlaying
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/40'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
                    }`}
                  >
                    {store.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{store.isPlaying ? 'PAUSE SIMULATION' : 'RUN SIMULATION'}</span>
                  </button>

                  <button
                    onClick={() => store.stepSim(0.5)}
                    className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
                  >
                    <FastForward className="w-3.5 h-3.5 text-sky-400" />
                    <span>Advance +0.5 Month</span>
                  </button>

                  <button
                    onClick={store.resetSim}
                    className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reset Simulation</span>
                  </button>
                </div>

                {/* Speed Multiplier */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400 font-medium">Playback Speed:</span>
                  <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    {[0.25, 0.5, 1.0, 2.0, 4.0].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => store.setPlaybackSpeed(spd)}
                        className={`px-3 py-1 text-xs font-mono font-bold rounded ${
                          store.playbackSpeed === spd
                            ? 'bg-sky-600 text-white'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: Scenarios & Climate Tour */}
          {activeSection === 'scenarios' && <ScenarioBar />}

          {/* SECTION 3: Equity & Policy Interventions */}
          {activeSection === 'equity' && <EquityPanel />}

          {/* SECTION 4: Far-Reach Teleconnections */}
          {activeSection === 'teleconnections' && <FarReachPanel />}

          {/* SECTION 5: Districts & Vulnerabilities */}
          {activeSection === 'districts' && <DistrictListTab />}

          {/* SECTION 6: 3D Layers & Camera */}
          {activeSection === 'visuals' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-base font-bold text-slate-100">3D Atmospheric & Oceanic Visual Layers</h2>
                <p className="text-xs text-slate-400">Toggle visual elements rendered in the 3D simulation canvas</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'showClouds', label: 'Atmospheric Cloud Decks', active: store.showClouds, onToggle: store.toggleShowClouds },
                  { key: 'cloudXRay', label: 'Cloud X-Ray Translucency', active: store.cloudXRay, onToggle: store.toggleCloudXRay },
                  { key: 'showRainField', label: 'Monsoonal Rain Shafts', active: store.showRainField, onToggle: () => store.toggleLayer('showRainField') },
                  { key: 'showWindField', label: 'Equatorial Trade Wind Vectors', active: store.showWindField, onToggle: () => store.toggleLayer('showWindField') },
                  { key: 'showThermocline', label: 'Subsurface Thermocline Tilt', active: store.showThermocline, onToggle: () => store.toggleLayer('showThermocline') },
                  { key: 'showTeleconnections', label: 'Teleconnection Rossby Arcs', active: store.showTeleconnections ?? true, onToggle: () => store.toggleLayer('showTeleconnections') },
                  { key: 'showDistanceRings', label: 'Impact Distance Rings', active: store.showDistanceRings ?? true, onToggle: () => store.toggleLayer('showDistanceRings') }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={item.onToggle}
                    className="flex items-center justify-between p-3.5 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-left transition-all"
                  >
                    <span className="text-xs font-semibold text-slate-200">{item.label}</span>
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center border ${
                        item.active
                          ? 'bg-sky-600 border-sky-500 text-white'
                          : 'bg-slate-800 border-slate-700'
                      }`}
                    >
                      {item.active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
