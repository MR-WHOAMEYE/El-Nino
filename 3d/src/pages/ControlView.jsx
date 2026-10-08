/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useControlStore, INITIAL_CONTROL_STATE } from '../store/controlStore.js';
import { useLiveStore } from '../store/liveStore.js';
import { useSimStore } from '../store/useSimStore.js';
import { useSyncControl } from '../sync/useSyncControl.js';
import { SCENARIO_PRESETS } from '../simulation/scenarios.js';
import { INTERVENTION_CATALOG, allocateBudgetOptimally } from '../simulation/counterfactual.js';
import { computeEquityMetrics, runRecommendationStabilityTest } from '../simulation/equity.js';
import districtsData from '../data/districts.json';
import regionsData from '../data/regions.json';
import { Link } from 'react-router-dom';
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
  ExternalLink,
  Wifi,
  WifiOff,
  Maximize,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Save,
  Download,
  Upload,
  AlertTriangle,
  Lock,
  Unlock,
  BookOpen,
  Monitor,
  Activity,
  BarChart2,
  TrendingDown,
  TrendingUp,
  Columns,
  Smartphone,
  QrCode
} from 'lucide-react';

const STORY_STEPS = [

  { step: 0, title: '1. Pacific Engine Baseline', desc: 'Trade winds blow steadily, storing warm water in the Western Pacific.', presetId: 'normal', cam: 'overview' },
  { step: 1, title: '2. Weakening Trade Winds', desc: 'Easterly winds collapse. Westerly bursts pulse across the date line.', presetId: 'weakening_winds', cam: 'walker' },
  { step: 2, title: '3. Warm Water Eastward Shift', desc: 'Warm pool migrates thousands of kilometers east, flattening thermocline slope.', presetId: 'warm_water_shift', cam: 'crossSection' },
  { step: 3, title: '4. South Asian Monsoon Deficit', desc: 'Subsidence suppresses convective rainfall over India, drying major agricultural belts.', presetId: 'strong_el_nino', cam: 'indiaFocus' },
  { step: 4, title: '5. Southeast Asia Drought', desc: 'Rain belts vanish in Indonesia and the Philippines, elevating severe drought & fire risks.', presetId: 'strong_el_nino', cam: 'southeastAsiaFocus' },
  { step: 5, title: '6. Eastern Pacific Torrential Floods', desc: 'Warm waters stack against Peru and Ecuador, triggering coastal storm surges.', presetId: 'strong_el_nino', cam: 'southAmericaFocus' },
  { step: 6, title: '7. La Niña Rebound & Surplus', desc: 'Upper-ocean heat evacuates. Ferocious upwelling swings monsoons to flood excess.', presetId: 'strong_la_nina', cam: 'overview' }
];

export default function ControlView() {
  const { sendAction } = useSyncControl();
  const control = useControlStore();
  const live = useLiveStore();
  const sim = useSimStore();

  // Collapsible cards state (remembered in localStorage)
  const [collapsedCards, setCollapsedCards] = useState(() => {
    try {
      const saved = localStorage.getItem('enso-control-collapsed-cards');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const toggleCard = (cardKey) => {
    setCollapsedCards((prev) => {
      const next = { ...prev, [cardKey]: !prev[cardKey] };
      try {
        localStorage.setItem('enso-control-collapsed-cards', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Demo mode state (locks destructive buttons)
  const [demoMode, setDemoMode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [copiedMobileLink, setCopiedMobileLink] = useState(false);

  // Region sorting & compare state
  const [sortField, setSortField] = useState('vulnerability');

  const [sortAsc, setSortAsc] = useState(false);
  const [compareA, setCompareA] = useState('mumbai');
  const [compareB, setCompareB] = useState('lima');

  // Custom Presets Slots
  const [savedPresets, setSavedPresets] = useState(() => {
    try {
      const p = localStorage.getItem('enso-user-presets-v1');
      return p ? JSON.parse(p) : [];
    } catch (e) {
      return [];
    }
  });
  const [newPresetName, setNewPresetName] = useState('');

  // Keyboard shortcut listener on ControlView
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')) return;

      if (e.code === 'Space') {
        e.preventDefault();
        control.togglePlay();
        sim.togglePlay();
      } else if (e.key === 'r' || e.key === 'R') {
        if (!demoMode) {
          control.triggerResetAll();
          sim.resetSim();
          sendAction('resetAll');
        }
      } else if (e.key === 'k' || e.key === 'K') {
        control.triggerPulseKelvinWave();
        sim.triggerWesterlyBurst();
        sendAction('pulseKelvinWave');
      } else if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const presets = ['overview', 'indiaFocus', 'southeastAsiaFocus', 'southAmericaFocus', 'africaFocus', 'walker'];
        const chosen = presets[parseInt(e.key, 10) - 1];
        if (chosen) {
          control.setCamera({ presetId: chosen });
          sim.setCameraPreset(chosen);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [demoMode, control, sim, sendAction]);

  const handleCopyMainLink = () => {
    const mainUrl = window.location.origin + '/';
    navigator.clipboard.writeText(mainUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Phase badge formatting
  const getPhaseBadge = (phase) => {
    switch (phase) {
      case 'el_nino':
        return 'bg-rose-950 text-rose-300 border-rose-700 shadow-rose-950/40';
      case 'la_nina':
        return 'bg-sky-950 text-sky-300 border-sky-700 shadow-sky-950/40';
      case 'modoki':
        return 'bg-amber-950 text-amber-300 border-amber-700 shadow-amber-950/40';
      default:
        return 'bg-emerald-950 text-emerald-300 border-emerald-700 shadow-emerald-950/40';
    }
  };

  // Evaluate districts on control page for Equity calculations
  const localEvaluated = useMemo(() => {
    return districtsData.map((d) => {
      const activeAnom = live.regionAnomalies?.[d.id]?.rainAnomalyPct ?? (d.teleconnections?.rainSensitivity * live.nino34) ?? 0;
      const povertyW = control.equity.vulnerabilityWeights.poverty;
      const cropW = control.equity.vulnerabilityWeights.cropDependence;
      const smallW = control.equity.vulnerabilityWeights.smallholderPct;
      const deficitW = control.equity.vulnerabilityWeights.baselineDeficit;

      const score = (
        (d.socioeconomic?.povertyRate || 0.3) * povertyW +
        (d.socioeconomic?.cropDependence || 0.4) * cropW +
        (d.socioeconomic?.smallholderPct || 0.5) * smallW +
        Math.max(0, -activeAnom / 50) * deficitW
      );

      return {
        ...d,
        rainAnomalyPct: Number(activeAnom.toFixed(1)),
        compositeVulnerability: Number(score.toFixed(3))
      };
    });
  }, [live.regionAnomalies, live.nino34, control.equity.vulnerabilityWeights]);

  const sortedRegions = useMemo(() => {
    return [...localEvaluated].sort((a, b) => {
      if (sortField === 'name') return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      if (sortField === 'rain') return sortAsc ? a.rainAnomalyPct - b.rainAnomalyPct : b.rainAnomalyPct - a.rainAnomalyPct;
      return sortAsc ? a.compositeVulnerability - b.compositeVulnerability : b.compositeVulnerability - a.compositeVulnerability;
    });
  }, [localEvaluated, sortField, sortAsc]);

  // Save preset to local storage
  const handleSavePreset = () => {
    if (!newPresetName.trim() || savedPresets.length >= 8) return;
    const item = {
      id: 'p_' + Date.now(),
      name: newPresetName.trim(),
      state: { ...control },
      createdAt: new Date().toLocaleTimeString()
    };
    const next = [...savedPresets, item];
    setSavedPresets(next);
    localStorage.setItem('enso-user-presets-v1', JSON.stringify(next));
    setNewPresetName('');
  };

  const handleApplyPreset = (item) => {
    control.applyPatch(item.state);
    sim.applyControlState(item.state);
  };

  const handleDeletePreset = (id) => {
    const next = savedPresets.filter(p => p.id !== id);
    setSavedPresets(next);
    localStorage.setItem('enso-user-presets-v1', JSON.stringify(next));
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(control, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `enso-control-config-${Date.now()}.json`);
    dlAnchor.click();
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        control.applyPatch(parsed);
        sim.applyControlState(parsed);
      } catch (err) {
        alert('Invalid JSON configuration file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white flex flex-col scroll-smooth">
      {/* 5.1 STICKY HEADER BAR */}
      <header className="sticky top-0 z-40 h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            to="/"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold shadow-sm transition-all hover:border-sky-500/50"
            title="Return to 3D Main Globe Presentation"
          >
            <ArrowLeft className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">3D View</span>
          </Link>

          <div className="h-5 w-px bg-slate-800" />

          {/* Connection status */}
          <div className="flex items-center space-x-2">
            <span className={`h-2.5 w-2.5 rounded-full ${live.mainConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-xs font-semibold hidden sm:inline text-slate-200">
              {live.mainConnected ? 'Connected to 3D view' : 'Waiting for 3D view'}
            </span>
          </div>

          <div className="h-5 w-px bg-slate-800 hidden md:block" />

          {/* Live Phase & Niño 3.4 Badge */}
          <div className="hidden md:flex items-center space-x-2">
            <span className={`px-2.5 py-0.5 text-xs font-mono font-bold uppercase rounded-md border shadow-sm ${getPhaseBadge(live.phase || sim.phase)}`}>
              {(live.phase || sim.phase || 'neutral').toUpperCase().replace('_', ' ')}
            </span>
            <span className="text-xs font-mono text-sky-300 font-bold">
              {live.nino34 >= 0 ? `+${live.nino34.toFixed(2)}` : live.nino34.toFixed(2)}°C
            </span>
            <span className="text-xs text-slate-400">({live.seasonLabel || 'Monsoon'})</span>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Demo Mode Toggle */}
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              demoMode
                ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Demo mode protects reset and dangerous operations"
          >
            {demoMode ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{demoMode ? 'Demo Mode: ON' : 'Demo Mode'}</span>
          </button>

          {/* Mobile Remote Connect Guide Button */}
          <button
            onClick={() => setShowMobileModal(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-700 text-xs font-semibold shadow-sm transition-all"
            title="Open on phone or tablet on the same Wi-Fi network"
          >
            <Smartphone className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Phone Remote</span>
          </button>

          {/* Copy Link to Main View */}
          <button
            onClick={handleCopyMainLink}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all"
            title="Copy URL for the 3D presentation screen"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Copy 3D Link'}</span>
          </button>


          {/* Request Fullscreen on 3D View */}
          <button
            onClick={() => sendAction('toggleFullscreen')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors"
            title="Fullscreen the 3D Main View screen"
          >
            <Maximize className="w-4 h-4" />
          </button>

          {/* Global Reset */}
          <button
            onClick={() => {
              if (demoMode) return;
              control.triggerResetAll();
              sim.resetSim();
              sendAction('resetAll');
            }}
            disabled={demoMode}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold disabled:opacity-40 transition-colors"
            title="Reset simulation parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={() => {
              control.togglePlay();
              sim.togglePlay();
            }}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md ${
              control.playback.isPlaying || sim.isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {control.playback.isPlaying || sim.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{control.playback.isPlaying || sim.isPlaying ? 'PAUSE' : 'RUN'}</span>
          </button>
        </div>
      </header>

      {/* Disconnection Banner if Main is not open */}
      {!live.mainConnected && (
        <div className="bg-amber-950/40 border-b border-amber-800/80 px-4 py-2 flex items-center justify-between text-amber-200 text-xs">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Waiting for 3D View:</strong> Open <Link to="/" target="_blank" className="underline font-bold text-amber-300 hover:text-white">http://localhost:3000/</Link> in another tab or on a projector to stream live changes.
            </span>
          </div>
          <Link
            to="/"
            target="_blank"
            className="px-2.5 py-1 rounded bg-amber-900/80 hover:bg-amber-800 text-amber-100 font-semibold text-[11px] border border-amber-700 flex items-center space-x-1 shrink-0"
          >
            <span>Launch 3D</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* 5.2 10 COLLAPSIBLE CONTROL CARDS (3-Column Desktop Grid with Full Scroll) */}
      <main className="flex-1 p-4 sm:p-6 max-w-[1700px] w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ================= COLUMN 1: Climate Physics, Scenarios & Story ================= */}
        <div className="space-y-6">
          {/* 1. SCENARIOS CARD */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
            <div
              onClick={() => toggleCard('scenarios')}
              className="p-4 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors select-none"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-purple-950/80 border border-purple-800/60 text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-100">1. Canonical Scenarios</h2>
                  <p className="text-[11px] text-slate-400">Canonical historical & synthetic climate regimes</p>
                </div>
              </div>
              {collapsedCards['scenarios'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedCards['scenarios'] && (
              <div className="p-4 space-y-2.5">
                {SCENARIO_PRESETS.map((preset) => {
                  const isActive = (control.scenarioId || sim.activeScenarioId) === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        control.setScenarioId(preset.id);
                        control.setDrivers({
                          tradeWind: preset.initialState.tradeWind,
                          warmPoolPosition: preset.initialState.warmPoolX,
                          simulationSpeed: preset.recommendedSpeed || 1.0
                        });
                        sim.loadScenario(preset.id);
                      }}
                      className={`w-full p-3 rounded-xl text-left border transition-all ${
                        isActive
                          ? 'bg-purple-950/50 border-purple-500/80 text-purple-200 ring-1 ring-purple-500/40 shadow-lg shadow-purple-950/30'
                          : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-slate-100">{preset.name}</span>
                        <span className="text-[10px] font-mono text-purple-400 font-bold">
                          {preset.initialState?.nino34 >= 0 ? `+${preset.initialState.nino34.toFixed(1)}` : preset.initialState?.nino34?.toFixed(1)}°C
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{preset.description}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* 2. CLIMATE DRIVERS CARD */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
            <div
              onClick={() => toggleCard('drivers')}
              className="p-4 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors select-none"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-sky-950/80 border border-sky-800/60 text-sky-400">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-100">2. Climate Drivers</h2>
                  <p className="text-[11px] text-slate-400">Physical wind forcing, warm pool, and wave triggers</p>
                </div>
              </div>
              {collapsedCards['drivers'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedCards['drivers'] && (
              <div className="p-4 space-y-4">
                {/* Trade Wind Strength */}
                <div className="space-y-1.5 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-semibold flex items-center space-x-1.5">
                      <Wind className="w-3.5 h-3.5 text-sky-400" />
                      <span>Trade Wind Strength:</span>
                    </span>
                    <span className="font-mono text-sky-400 font-bold bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                      {(control.drivers.tradeWind * 100).toFixed(0)}% (Live: {(live.tradeWind ?? sim.tradeWind * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.02"
                    value={control.drivers.tradeWind}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      control.setDrivers({ tradeWind: v });
                      sim.setTradeWind(v);
                    }}
                    className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Weak (0.10)</span>
                    <span>Neutral (0.60)</span>
                    <span>Strong (1.00)</span>
                  </div>
                </div>

                {/* Warm Pool Zonal Position */}
                <div className="space-y-1.5 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-semibold flex items-center space-x-1.5">
                      <Waves className="w-3.5 h-3.5 text-amber-400" />
                      <span>Warm Pool Centroid:</span>
                    </span>
                    <span className="font-mono text-amber-400 font-bold bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                      {(control.drivers.warmPoolPosition * 100).toFixed(0)}% (Live: {(live.warmPoolX ?? sim.warmPoolX * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.95"
                    step="0.02"
                    value={control.drivers.warmPoolPosition}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      control.setDrivers({ warmPoolPosition: v });
                      sim.setWarmPoolX(v);
                    }}
                    className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>West Pacific (130°E)</span>
                    <span>Date Line (180°)</span>
                    <span>East Pacific (90°W)</span>
                  </div>
                </div>

                {/* Hydrodynamic Action Triggers */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      control.triggerWesterlyWindBurst();
                      sim.triggerWesterlyBurst();
                      sendAction('westerlyWindBurst');
                    }}
                    className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 text-xs font-semibold shadow-sm transition-all"
                  >
                    <Wind className="w-3.5 h-3.5 text-amber-400" />
                    <span>Westerly Wind Burst</span>
                  </button>

                  <button
                    onClick={() => {
                      control.triggerPulseKelvinWave();
                      sim.triggerWesterlyBurst();
                      sendAction('pulseKelvinWave');
                    }}
                    className="flex items-center justify-center space-x-1.5 p-2.5 rounded-xl bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 text-xs font-semibold shadow-sm transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 text-sky-400" />
                    <span>Launch Kelvin Wave</span>
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* 8. STORY MODE CARD */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
            <div
              onClick={() => toggleCard('story')}
              className="p-4 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors select-none"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-100">8. Guided Climate Tour</h2>
                  <p className="text-[11px] text-slate-400">7-step interactive presentation walk-through</p>
                </div>
              </div>
              {collapsedCards['story'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedCards['story'] && (
              <div className="p-4 space-y-3">
                <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-sky-400 font-bold">
                    <span>{STORY_STEPS[control.story.storyStep || 0].title}</span>
                    <span className="font-mono text-[10px]">Step {(control.story.storyStep || 0) + 1} of 7</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {STORY_STEPS[control.story.storyStep || 0].desc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      const nextStep = Math.max(0, (control.story.storyStep || 0) - 1);
                      control.setStory({ storyStep: nextStep });
                      sim.setStoryStep(nextStep);
                    }}
                    disabled={(control.story.storyStep || 0) === 0}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 text-xs font-semibold border border-slate-700"
                  >
                    Previous
                  </button>

                  <button
                    onClick={() => {
                      const cur = control.story.storyStep || 0;
                      const s = STORY_STEPS[cur];
                      control.setScenarioId(s.presetId);
                      control.setCamera({ presetId: s.cam });
                      sim.loadScenario(s.presetId);
                      sim.setCameraPreset(s.cam);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm"
                  >
                    Play Step
                  </button>

                  <button
                    onClick={() => {
                      const nextStep = Math.min(6, (control.story.storyStep || 0) + 1);
                      control.setStory({ storyStep: nextStep });
                      sim.setStoryStep(nextStep);
                    }}
                    disabled={(control.story.storyStep || 0) === 6}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-40 text-xs font-bold shadow-sm"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* ================= COLUMN 2: Timeline, Layers, Camera & Performance ================= */}
        <div className="space-y-6">
          {/* 3. TIMELINE & 36-MONTH SCRUBBER */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
            <div
              onClick={() => toggleCard('timeline')}
              className="p-4 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors select-none"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-100">3. Simulation Timeline (36 Mo)</h2>
                  <p className="text-[11px] text-slate-400">Multi-year scrubber with live Niño 3.4 sparkline</p>
                </div>
              </div>
              {collapsedCards['timeline'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedCards['timeline'] && (
              <div className="p-4 space-y-4">
                {/* 36-Month Timeline Scrubber */}
                <div className="space-y-1.5 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Month Scrubber (0-36):</span>
                    <span className="text-indigo-300 font-bold">
                      {live.currentMonthLabel || `Month ${Math.floor(sim.elapsedMonths || 0)}`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="36"
                    step="0.25"
                    value={control.playback.month || sim.elapsedMonths || 0}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      control.setPlayback({ month: v });
                      sim.seekMonth(v);
                    }}
                    className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>Year 1 (Jan)</span>
                    <span>Year 2</span>
                    <span>Year 3 (Dec)</span>
                  </div>
                </div>

                {/* Speed Multipliers & Play Controls */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs text-slate-400 font-medium">Rate:</span>
                    <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                      {[0.5, 1.0, 2.0, 4.0].map((spd) => (
                        <button
                          key={spd}
                          onClick={() => {
                            control.setDrivers({ simulationSpeed: spd });
                            sim.setPlaybackSpeed(spd);
                          }}
                          className={`px-2 py-0.5 text-xs font-mono font-bold rounded ${
                            (control.drivers.simulationSpeed || sim.playbackSpeed) === spd
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      control.setPlayback({ loop: !control.playback.loop });
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-colors ${
                      control.playback.loop
                        ? 'bg-sky-950 text-sky-300 border-sky-800'
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                  >
                    Loop: {control.playback.loop ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* 4. LAYERS CARD */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
            <div
              onClick={() => toggleCard('layers')}
              className="p-4 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors select-none"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-teal-950/80 border border-teal-800/60 text-teal-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-100">4. Visual 3D Layers</h2>
                  <p className="text-[11px] text-slate-400">Toggle clouds, rain, winds, thermocline & arcs</p>
                </div>
              </div>
              {collapsedCards['layers'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedCards['layers'] && (
              <div className="p-4 space-y-2">
                {[
                  { key: 'showClouds', label: 'Atmospheric Cloud Decks', active: control.layers.showClouds },
                  { key: 'cloudXray', label: 'Cloud X-Ray Translucency (Key C)', active: control.layers.cloudXray },
                  { key: 'showRain', label: 'Monsoonal Rain Shafts', active: control.layers.showRain },
                  { key: 'showWind', label: 'Equatorial Trade Wind Vectors', active: control.layers.showWind },
                  { key: 'showThermocline', label: 'Subsurface Thermocline Tilt', active: control.layers.showThermocline },
                  { key: 'showTeleconnections', label: 'Teleconnection Rossby Arcs', active: control.layers.showTeleconnections },
                  { key: 'showDistanceRings', label: 'Impact Distance Rings', active: control.layers.showDistanceRings },
                  { key: 'showEquityOverlay', label: 'Equity Vulnerability Overlay', active: control.layers.showEquityOverlay }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      control.toggleLayer(item.key);
                      sim.toggleLayer(
                        item.key === 'showWind' ? 'showWindField' :
                        item.key === 'showRain' ? 'showRainField' :
                        item.key === 'cloudXray' ? 'cloudXRay' : item.key
                      );
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-left transition-colors"
                  >
                    <span className="text-xs font-medium text-slate-200">{item.label}</span>
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
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
            )}
          </section>

          {/* 5. CAMERA & REGION FLY-TO */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
            <div
              onClick={() => toggleCard('camera')}
              className="p-4 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors select-none"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-sky-950/80 border border-sky-800/60 text-sky-400">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-100">5. Camera & Vantage Rig</h2>
                  <p className="text-[11px] text-slate-400">Perspective presets and regional auto-focus</p>
                </div>
              </div>
              {collapsedCards['camera'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedCards['camera'] && (
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'overview', label: '1. World Overview' },
                    { id: 'indiaFocus', label: '2. India & Ocean' },
                    { id: 'southeastAsiaFocus', label: '3. SE Asia & Aus' },
                    { id: 'southAmericaFocus', label: '4. South America' },
                    { id: 'africaFocus', label: '5. Africa Corridor' },
                    { id: 'walker', label: '6. Walker Loop' },
                    { id: 'crossSection', label: '7. Thermocline Tilt' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        control.setCamera({ presetId: c.id });
                        sim.setCameraPreset(c.id);
                      }}
                      className={`p-2.5 rounded-xl text-center border text-xs font-semibold transition-all ${
                        control.camera.presetId === c.id
                          ? 'bg-sky-950 border-sky-500 text-sky-300 shadow-md'
                          : 'bg-slate-950/80 border-slate-800 hover:bg-slate-900 text-slate-300'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5 mx-auto mb-1 text-sky-400" />
                      <div className="truncate">{c.label}</div>
                    </button>
                  ))}
                </div>

                {/* Auto Rotate Toggle */}
                <button
                  onClick={() => {
                    control.setCamera({ autoRotate: !control.camera.autoRotate });
                    sim.toggleAutoRotate();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <span className="text-slate-300">Continuous Auto-Rotation:</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${control.camera.autoRotate ? 'bg-sky-950 text-sky-400 border border-sky-800' : 'bg-slate-800 text-slate-400'}`}>
                    {control.camera.autoRotate ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            )}
          </section>

          {/* 9. DISPLAY & PERFORMANCE */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
            <div
              onClick={() => toggleCard('performance')}
              className="p-4 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors select-none"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-100">9. Hardware & Accessibility</h2>
                  <p className="text-[11px] text-slate-400">Low graphics, colorblind palettes & FPS telemetry</p>
                </div>
              </div>
              {collapsedCards['performance'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedCards['performance'] && (
              <div className="p-4 space-y-3 text-xs">
                {/* Live FPS / Draw Calls */}
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">FPS</span>
                    <span className="text-emerald-400 font-bold">{live.fps || 60}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Particles</span>
                    <span className="text-sky-400 font-bold">{live.particleCount || 1420}</span>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Draw Calls</span>
                    <span className="text-amber-400 font-bold">{live.drawCalls || 18}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    control.setDisplay({ lowGraphics: !control.display.lowGraphics });
                    sim.setLowGraphicsMode(!control.display.lowGraphics);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <span className="text-slate-300">Low Graphics Mode:</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${control.display.lowGraphics ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-slate-800 text-slate-400'}`}>
                    {control.display.lowGraphics ? 'ON' : 'OFF'}
                  </span>
                </button>

                <button
                  onClick={() => {
                    control.setDisplay({ colorBlindPalette: !control.display.colorBlindPalette });
                    sim.setColorBlindMode(!control.display.colorBlindPalette);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <span className="text-slate-300">Colorblind Safe Colormap:</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${control.display.colorBlindPalette ? 'bg-sky-950 text-sky-400 border border-sky-800' : 'bg-slate-800 text-slate-400'}`}>
                    {control.display.colorBlindPalette ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            )}
          </section>
        </div>

        {/* ================= COLUMN 3: Equity, Far-Reach & Presets ================= */}
        <div className="space-y-6">
          {/* 6. REGIONS & FAR-REACH IMPACTS TABLE */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
            <div
              onClick={() => toggleCard('regions')}
              className="p-4 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors select-none"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-teal-950/80 border border-teal-800/60 text-teal-400">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-100">6. Regions & Far-Reach</h2>
                  <p className="text-[11px] text-slate-400">Sortable teleconnections & multi-region comparison</p>
                </div>
              </div>
              {collapsedCards['regions'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedCards['regions'] && (
              <div className="p-4 space-y-3 text-xs">
                {/* Sort Filters */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1">
                  <span>Sort by:</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => { setSortField('vulnerability'); setSortAsc(!sortAsc); }}
                      className={`px-2 py-0.5 rounded ${sortField === 'vulnerability' ? 'bg-sky-950 text-sky-300 font-bold' : 'hover:bg-slate-800'}`}
                    >
                      Risk {sortField === 'vulnerability' ? (sortAsc ? '↑' : '↓') : ''}
                    </button>
                    <button
                      onClick={() => { setSortField('rain'); setSortAsc(!sortAsc); }}
                      className={`px-2 py-0.5 rounded ${sortField === 'rain' ? 'bg-sky-950 text-sky-300 font-bold' : 'hover:bg-slate-800'}`}
                    >
                      Rain {sortField === 'rain' ? (sortAsc ? '↑' : '↓') : ''}
                    </button>
                    <button
                      onClick={() => { setSortField('name'); setSortAsc(!sortAsc); }}
                      className={`px-2 py-0.5 rounded ${sortField === 'name' ? 'bg-sky-950 text-sky-300 font-bold' : 'hover:bg-slate-800'}`}
                    >
                      Name {sortField === 'name' ? (sortAsc ? '↑' : '↓') : ''}
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                  {sortedRegions.map((r) => {
                    const isSelected = (control.selection.selectedRegionId || sim.selectedDistrictId) === r.id;
                    return (
                      <div
                        key={r.id}
                        onClick={() => {
                          control.setSelection({ selectedRegionId: r.id });
                          sim.setSelectedDistrict(r.id);
                          sendAction('flyToRegion', { regionId: r.id });
                        }}
                        className={`p-2 rounded-xl flex items-center justify-between cursor-pointer border transition-all ${
                          isSelected
                            ? 'bg-sky-950 border-sky-500 text-sky-200 shadow-sm'
                            : 'bg-slate-950/80 border-slate-800/80 hover:bg-slate-900 text-slate-300'
                        }`}
                      >
                        <div className="truncate">
                          <div className="font-bold text-xs text-slate-100">{r.name}</div>
                          <div className="text-[10px] text-slate-500">{r.country} • Vuln: {r.compositeVulnerability}</div>
                        </div>

                        <div className="text-right font-mono text-xs">
                          <span className={r.rainAnomalyPct < 0 ? 'text-rose-400 font-bold' : 'text-sky-400 font-bold'}>
                            {r.rainAnomalyPct > 0 ? `+${r.rainAnomalyPct}%` : `${r.rainAnomalyPct}%`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* 7. EQUITY & POLICY INTERVENTIONS */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
            <div
              onClick={() => toggleCard('equity')}
              className="p-4 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors select-none"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-rose-950/80 border border-rose-800/60 text-rose-400">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-100">7. Equity & Policy Engine</h2>
                  <p className="text-[11px] text-slate-400">Vulnerability weights, budget allocation & before/after</p>
                </div>
              </div>
              {collapsedCards['equity'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedCards['equity'] && (
              <div className="p-4 space-y-3.5 text-xs">
                {/* Vulnerability Weight Sliders */}
                <div className="space-y-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <div className="font-semibold text-slate-200">Vulnerability Formula Weights:</div>
                  
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                      <span>Poverty Rate:</span>
                      <span className="font-mono text-slate-200 font-bold">{(control.equity.vulnerabilityWeights.poverty * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.8"
                      step="0.05"
                      value={control.equity.vulnerabilityWeights.poverty}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        control.setEquity({ vulnerabilityWeights: { poverty: v } });
                        sim.setEquityWeights({ poverty: v });
                      }}
                      className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                      <span>Agrarian Crop Dependence:</span>
                      <span className="font-mono text-slate-200 font-bold">{(control.equity.vulnerabilityWeights.cropDependence * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.8"
                      step="0.05"
                      value={control.equity.vulnerabilityWeights.cropDependence}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        control.setEquity({ vulnerabilityWeights: { cropDependence: v } });
                        sim.setEquityWeights({ cropDependence: v });
                      }}
                      className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* Intervention & Budget */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">Policy Budget (INR):</span>
                    <span className="font-mono text-emerald-400 font-bold">₹{control.equity.budget}M</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={control.equity.budget}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      control.setEquity({ budget: v });
                      sim.setPolicyBudget(v);
                    }}
                    className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Before / After Toggle */}
                <button
                  onClick={() => {
                    const next = !control.equity.beforeAfter;
                    control.setEquity({ beforeAfter: next });
                    sim.setBeforeAfterMode(next ? 'after' : 'before');
                  }}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs border transition-all ${
                    control.equity.beforeAfter
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  Mode: {control.equity.beforeAfter ? 'AFTER INTERVENTION (Mitigated)' : 'BEFORE INTERVENTION (Baseline Risk)'}
                </button>
              </div>
            )}
          </section>

          {/* 10. PRESETS & SHARING */}
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
            <div
              onClick={() => toggleCard('presets')}
              className="p-4 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors select-none"
            >
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-800/60 text-amber-400">
                  <Save className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-100">10. Presets & Export</h2>
                  <p className="text-[11px] text-slate-400">Save 8 customized presets or export JSON configs</p>
                </div>
              </div>
              {collapsedCards['presets'] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
            </div>

            {!collapsedCards['presets'] && (
              <div className="p-4 space-y-3 text-xs">
                {/* Save Input */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Preset name..."
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    onClick={handleSavePreset}
                    disabled={!newPresetName.trim() || savedPresets.length >= 8}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs disabled:opacity-40"
                  >
                    Save
                  </button>
                </div>

                {/* Saved Slots List */}
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {savedPresets.length === 0 ? (
                    <div className="text-[11px] text-slate-500 text-center py-2">No saved presets yet</div>
                  ) : (
                    savedPresets.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="font-semibold text-slate-200">{p.name}</span>
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => handleApplyPreset(p)}
                            className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 text-[10px] font-bold"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleDeletePreset(p.id)}
                            className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px]"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Import / Export JSON */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={handleExportJSON}
                    className="flex items-center justify-center space-x-1 p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    <Download className="w-3.5 h-3.5 text-sky-400" />
                    <span>Export JSON</span>
                  </button>

                  <label className="flex items-center justify-center space-x-1 p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Import JSON</span>
                    <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
                  </label>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* 5.4 MOBILE REMOTE CONNECT MODAL */}
      {showMobileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-sky-950 border border-sky-800 text-sky-400">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Mobile Remote Control</h3>
                  <p className="text-[11px] text-slate-400">Control the 3D globe from your phone over Wi-Fi</p>
                </div>
              </div>
              <button
                onClick={() => setShowMobileModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">1. Connect to Same Wi-Fi</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Make sure your mobile phone or tablet is connected to the same local Wi-Fi / Hotspot network as this computer.
                </p>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">2. Open This URL On Your Phone</span>
                <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-700 font-mono text-xs text-sky-300 select-all">
                  <span>{typeof window !== 'undefined' ? `${window.location.origin}/control` : 'http://<your-ip>:3000/control'}</span>
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(`${window.location.origin}/control`);
                        setCopiedMobileLink(true);
                        setTimeout(() => setCopiedMobileLink(false), 2000);
                      }
                    }}
                    className="ml-2 p-1 hover:bg-slate-800 rounded text-slate-300"
                    title="Copy URL"
                  >
                    {copiedMobileLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-emerald-950/30 border border-emerald-800/60 p-3 rounded-xl text-emerald-300 text-[11px] flex items-start space-x-2">
                <Wifi className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Live Real-Time Sync:</strong> The WebSocket LAN relay is active on port 3000. Any slider or preset you tap on your phone instantly drives the 3D main screen!
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowMobileModal(false)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

