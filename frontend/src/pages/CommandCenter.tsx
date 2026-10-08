import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { LeafletClimateMap } from '../components/map/LeafletClimateMap';
import { ScoreBadge, getRiskBand } from '../components/common/ScoreBadge';
import { DataMetadataFooter } from '../components/common/DataMetadataFooter';
import { LoadingState, ErrorState } from '../components/common/StateViews';
import {
  RegionSummary,
  RiskExplanation,
  AIAdviceResponse,
  EnsoStatus
} from '../types';
import {
  MapPin,
  HelpCircle,
  Users,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Bot,
  Layers,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Droplets,
  Thermometer,
  Heart
} from 'lucide-react';
import { DEMO_REGIONS } from '../data/demoData';

type DrawerTab = 'drivers' | 'subscores' | 'why' | 'advisor' | 'trend';

export const CommandCenter: React.FC = () => {
  const navigate = useNavigate();
  const {
    selectedRegionId,
    setSelectedRegionId,
    getProvider,
    timeScrubberDay,
    setTimeScrubberDay,
    isPlayingScrubber,
    toggleScrubberPlay,
    language,
  } = useAppStore();

  const [region, setRegion] = useState<RegionSummary | null>(null);
  const [enso, setEnso] = useState<EnsoStatus | null>(null);
  const [explanation, setExplanation] = useState<RiskExplanation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active drawer tab
  const [activeTab, setActiveTab] = useState<DrawerTab>('drivers');

  // Active layer for map
  const [activeLayer, setActiveLayer] = useState<'overall' | 'heat' | 'water' | 'health'>('overall');

  // AI Advisor state
  const [aiQuestion, setAiQuestion] = useState('What should we prioritize right now?');
  const [aiAdvice, setAiAdvice] = useState<AIAdviceResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const provider = getProvider();

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [regionRes, ensoRes, explainRes] = await Promise.all([
          provider.getRegion(selectedRegionId),
          provider.getEnsoStatus(),
          provider.getRiskExplanation(selectedRegionId),
        ]);

        if (isMounted) {
          if (regionRes.success) setRegion(regionRes.data);
          if (ensoRes.success) setEnso(ensoRes.data);
          if (explainRes.success) setExplanation(explainRes.data);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Failed to load climate telemetry.');
          setLoading(false);
        }
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [selectedRegionId, provider]);

  // Handle scrubber animation
  useEffect(() => {
    let timer: any;
    if (isPlayingScrubber) {
      timer = setInterval(() => {
        const next = timeScrubberDay >= 90 ? 0 : timeScrubberDay + 15;
        setTimeScrubberDay(next);
      }, 1400);
    }
    return () => clearInterval(timer);
  }, [isPlayingScrubber, timeScrubberDay, setTimeScrubberDay]);

  const handleAskAdvisor = async (promptText?: string) => {
    const q = promptText || aiQuestion;
    try {
      setAiLoading(true);
      const res = await provider.getAIAdvice({
        region_id: selectedRegionId,
        question: q,
      });
      if (res.success) setAiAdvice(res.data);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (region && !aiAdvice) {
      handleAskAdvisor('What should we prioritize right now?');
    }
  }, [region]);

  if (loading && !region) {
    return <LoadingState message="Loading geospatial intelligence & ward telemetry..." />;
  }

  if (error && !region) {
    return <ErrorState message={error} onRetry={() => setSelectedRegionId(selectedRegionId)} />;
  }

  const current = region || DEMO_REGIONS['TN-CHN-NORTH'];

  // Calculate dynamic projected risk under time scrubber
  const dynamicRisk = Math.min(100, Math.round(current.overall_impact * (1 + (timeScrubberDay / 90) * 0.16)));
  const dynamicBand = getRiskBand(dynamicRisk);

  return (
    <div className="flex flex-col gap-6">
      {/* Attractive Grand Hero Section with Atmospheric Depth & Real-time Telemetry Visualizer */}
      <div className="card-curvy p-8 sm:p-10 bg-gradient-to-br from-[#0F2A23] via-[#0B211C] to-[#071813] border border-[#224E41] shadow-[0_8px_32px_rgba(0,0,0,0.35)] relative overflow-hidden">
        {/* Subtle decorative concentric meteorological grid circles */}
        <div className="absolute -right-20 -top-20 w-[420px] h-[420px] rounded-full border border-[#C8DFDB]/5 pointer-events-none" />
        <div className="absolute -right-10 -top-10 w-[300px] h-[300px] rounded-full border border-[#C8DFDB]/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-[#C8DFDB]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Bold Editorial Title & Live Quick Telemetry */}
          <div className="lg:col-span-7 space-y-4 text-[#F3F6F1]">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14332B] border border-[#1E4D40] text-xs font-semibold text-[#C8DFDB] font-mono-numbers shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#E5A355] animate-pulse" />
                <span>OVERVIEW DASHBOARD • ACTIVE EL NIÑO CYCLE</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono-numbers font-semibold bg-[#0A1F1A] border border-[#1C4238] text-[#8FA89F]">
                ONI +1.4°C PACIFIC SIGNAL
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#F4F6F1] leading-[1.12]">
              Chennai Climate <br />
              <span className="font-editorial italic font-normal text-[#C8DFDB]">
                Operations Console
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#8FA89F] leading-relaxed max-w-xl font-normal">
              Integrated planetary-to-hyperlocal decision support downscaled to Greater Chennai Corporation ward boundaries. Predictive telemetry across extreme heat, water security, and healthcare surge capacity.
            </p>

            {/* Quick Live Telemetry Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 font-mono-numbers text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0A1F1A]/80 border border-[#1C4238] text-[#F3F6F1]">
                <span className="text-[#E26F5A]">🌡️</span>
                <span>Wet-Bulb: <strong className="text-[#E26F5A]">30.2°C</strong> (Severe)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0A1F1A]/80 border border-[#1C4238] text-[#F3F6F1]">
                <span className="text-[#5AA693]">💧</span>
                <span>Reservoir: <strong className="text-[#5AA693]">34%</strong> (-28% Deficit)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0A1F1A]/80 border border-[#1C4238] text-[#F3F6F1]">
                <span className="text-[#E5A355]">🚨</span>
                <span>Hotspot: <strong className="text-[#E5A355]">North Chennai 91/100</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive ENSO Wave & Composite Dial Graphic */}
          <div className="lg:col-span-5 rounded-3xl border border-[#224E41] bg-[#091D17]/90 backdrop-blur-md p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1A3D33] text-xs font-mono-numbers">
              <div className="flex items-center gap-2 text-[#C8DFDB] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#C8DFDB] animate-pulse" />
                <span>PACIFIC ENSO OSCILLATION TELEMETRY</span>
              </div>
              <span className="text-[11px] text-[#8FA89F]">LIVE TELEMETRY</span>
            </div>

            {/* Dual Component: SVG Wave + Circular Risk Dial */}
            <div className="grid grid-cols-12 gap-3 items-center">
              {/* Telemetry Wave Chart */}
              <div className="col-span-7 h-28 flex items-center justify-center">
                <svg viewBox="0 0 200 90" className="w-full h-full overflow-visible" fill="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="45" x2="200" y2="45" stroke="#1C4238" strokeWidth="1" strokeDasharray="2 2" />
                  {/* Wave 1 Background */}
                  <path d="M 0 55 Q 50 20 100 50 T 200 35" stroke="#1C4238" strokeWidth="1.5" />
                  {/* Wave 2 Primary Telemetry */}
                  <path d="M 0 35 Q 50 65 100 30 T 200 50" stroke="#C8DFDB" strokeWidth="2.5" />
                  {/* Glowing Pulse Nodes */}
                  <circle cx="50" cy="58" r="4.5" fill="#E5A355" />
                  <circle cx="100" cy="30" r="5" fill="#C8DFDB" />
                  <circle cx="160" cy="42" r="4.5" fill="#E26F5A" />
                </svg>
              </div>

              {/* Mini Circular Gauge for Selected Ward Risk */}
              <div className="col-span-5 flex flex-col items-center justify-center text-center p-2 rounded-2xl bg-[#071713] border border-[#16362E]">
                <div className="text-[10px] text-[#8FA89F] font-mono-numbers uppercase">Ward Score</div>
                <div className="text-3xl font-bold font-mono-numbers text-[#C8DFDB] my-0.5">
                  {current.overall_impact}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E26F5A]/20 text-[#E26F5A] uppercase font-mono-numbers">
                  {current.risk_band} RISK
                </span>
              </div>
            </div>

            {/* Insight Quote Pill */}
            <div className="p-3 rounded-2xl bg-[#071713]/80 border border-[#16362E] text-[11px] text-[#8FA89F] flex items-center justify-between">
              <span>Pacific SST Anomaly: <strong className="text-[#E5A355]">+1.4°C</strong></span>
              <span>Modelled Peak: <strong className="text-[#C8DFDB]">+60 Days</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Attractive 4-Card Overview Telemetry Grid: Positioned Below Hero */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-mono-numbers">
        {/* Card 1: Active Ward Focus */}
        <div className="card-curvy p-6 bg-gradient-to-br from-[#0E251F] to-[#0A1B16] border border-[#1E463B] hover:border-[#C8DFDB] transition-all duration-300 shadow-md group space-y-3">
          <div className="flex items-center justify-between">
            <span className="p-3 rounded-2xl bg-[#C8DFDB]/15 text-[#C8DFDB] group-hover:scale-110 transition-transform">
              <MapPin size={18} />
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#C8DFDB]/10 text-[#C8DFDB] border border-[#C8DFDB]/20">
              {current.id}
            </span>
          </div>
          <div>
            <span className="text-xs text-[#8FA89F] block font-sans">Active Ward Focus</span>
            <div className="text-base sm:text-lg font-bold text-[#F3F6F1] font-sans truncate mt-0.5">
              {current.name}
            </div>
          </div>
          <div className="pt-2 border-t border-[#193B32] flex items-center justify-between text-xs">
            <span className="text-[#8FA89F] font-sans">Composite Impact</span>
            <strong className="text-[#C8DFDB] font-bold text-sm">{current.overall_impact} / 100</strong>
          </div>
        </div>

        {/* Card 2: Wet-Bulb Thermal Stress */}
        <div className="card-curvy p-6 bg-gradient-to-br from-[#0E251F] to-[#0A1B16] border border-[#1E463B] hover:border-[#E26F5A] transition-all duration-300 shadow-md group space-y-3">
          <div className="flex items-center justify-between">
            <span className="p-3 rounded-2xl bg-[#E26F5A]/15 text-[#E26F5A] group-hover:scale-110 transition-transform">
              <Thermometer size={18} />
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E26F5A]/10 text-[#E26F5A] border border-[#E26F5A]/20">
              CRITICAL
            </span>
          </div>
          <div>
            <span className="text-xs text-[#8FA89F] block font-sans">Wet-Bulb Thermal Stress</span>
            <div className="text-2xl font-bold text-[#E26F5A] mt-0.5">
              {current.heat_risk} <span className="text-xs font-normal text-[#8FA89F]">/ 100</span>
            </div>
          </div>
          {/* Thermal Meter Progress Bar */}
          <div className="space-y-1">
            <div className="h-2 w-full bg-[#071713] rounded-full overflow-hidden border border-[#16362E]">
              <div className="h-full bg-[#E26F5A] rounded-full" style={{ width: `${current.heat_risk}%` }} />
            </div>
            <div className="flex justify-between text-[11px] text-[#8FA89F] pt-0.5">
              <span>Feels like 42.8°C</span>
              <span className="text-[#E26F5A] font-semibold">11:30–16:00 peak</span>
            </div>
          </div>
        </div>

        {/* Card 3: Municipal Water Stress */}
        <div className="card-curvy p-6 bg-gradient-to-br from-[#0E251F] to-[#0A1B16] border border-[#1E463B] hover:border-[#5AA693] transition-all duration-300 shadow-md group space-y-3">
          <div className="flex items-center justify-between">
            <span className="p-3 rounded-2xl bg-[#5AA693]/15 text-[#5AA693] group-hover:scale-110 transition-transform">
              <Droplets size={18} />
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#5AA693]/10 text-[#5AA693] border border-[#5AA693]/20">
              ELEVATED
            </span>
          </div>
          <div>
            <span className="text-xs text-[#8FA89F] block font-sans">Municipal Water Stress</span>
            <div className="text-2xl font-bold text-[#5AA693] mt-0.5">
              {current.water_stress} <span className="text-xs font-normal text-[#8FA89F]">/ 100</span>
            </div>
          </div>
          {/* Reservoir Progress Bar */}
          <div className="space-y-1">
            <div className="h-2 w-full bg-[#071713] rounded-full overflow-hidden border border-[#16362E]">
              <div className="h-full bg-[#5AA693] rounded-full" style={{ width: `34%` }} />
            </div>
            <div className="flex justify-between text-[11px] text-[#8FA89F] pt-0.5">
              <span>Reservoir Active: 34%</span>
              <span className="text-[#5AA693] font-semibold">-28% Deficit</span>
            </div>
          </div>
        </div>

        {/* Card 4: Clinical Health Surge */}
        <div className="card-curvy p-6 bg-gradient-to-br from-[#0E251F] to-[#0A1B16] border border-[#1E463B] hover:border-[#E5A355] transition-all duration-300 shadow-md group space-y-3">
          <div className="flex items-center justify-between">
            <span className="p-3 rounded-2xl bg-[#E5A355]/15 text-[#E5A355] group-hover:scale-110 transition-transform">
              <Heart size={18} />
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E5A355]/10 text-[#E5A355] border border-[#E5A355]/20">
              SURGE
            </span>
          </div>
          <div>
            <span className="text-xs text-[#8FA89F] block font-sans">Health Surge Pressure</span>
            <div className="text-2xl font-bold text-[#E5A355] mt-0.5">
              {current.health_risk} <span className="text-xs font-normal text-[#8FA89F]">/ 100</span>
            </div>
          </div>
          {/* ER Influx Bar */}
          <div className="space-y-1">
            <div className="h-2 w-full bg-[#071713] rounded-full overflow-hidden border border-[#16362E]">
              <div className="h-full bg-[#E5A355] rounded-full" style={{ width: `76%` }} />
            </div>
            <div className="flex justify-between text-[11px] text-[#8FA89F] pt-0.5">
              <span>ER Influx Rate:</span>
              <strong className="text-[#E5A355]">+42% 10y median</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Map + Details Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Center: Full Bleed Interactive Map (7 Cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Map Layer Toolbar */}
          <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text)] font-medium">
              <Layers size={14} className="text-[var(--brand)]" />
              <span>Layer:</span>
              <div className="flex items-center gap-1.5 ml-1.5">
                {(['overall', 'heat', 'water', 'health'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setActiveLayer(l)}
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors capitalize ${
                      activeLayer === l
                        ? 'bg-[var(--brand)] text-[var(--bg)] font-semibold'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]'
                    }`}
                  >
                    {l === 'overall' ? 'Composite Risk' : l}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] font-mono-numbers text-[var(--text-muted)] hidden sm:block">
              {current.name} Focus
            </div>
          </div>

          {/* Open-Source Leaflet Climate Map */}
          <div className="rounded-3xl overflow-hidden border border-[var(--border)] shadow-sm">
            <LeafletClimateMap
              activeLayer={activeLayer}
              height="520px"
              onSelectWard={(id) => setSelectedRegionId(id)}
            />
          </div>

          {/* Bottom Time Scrubber: Now -> +30d -> +60d -> +90d */}
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-numbers text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleScrubberPlay}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--brand)] text-[var(--bg)] hover:opacity-90 font-semibold cursor-pointer transition-colors"
              >
                {isPlayingScrubber ? <Pause size={13} /> : <Play size={13} />}
                <span>{isPlayingScrubber ? 'Pause' : 'Play Timeline'}</span>
              </button>
              <button
                onClick={() => setTimeScrubberDay(0)}
                className="p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)] cursor-pointer"
                title="Reset to current observation"
              >
                <RotateCcw size={13} />
              </button>
            </div>

            {/* Stepped Timeline */}
            <div className="flex-1 max-w-md w-full flex items-center justify-between gap-2 px-2">
              {[0, 30, 60, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setTimeScrubberDay(d)}
                  className={`flex flex-col items-center cursor-pointer transition-all ${
                    timeScrubberDay === d
                      ? 'text-[var(--brand)] font-bold scale-105'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full mb-1 border-2 transition-colors ${
                    timeScrubberDay === d
                      ? 'bg-[var(--brand)] border-[var(--brand)]'
                      : 'bg-[var(--surface-raised)] border-[var(--border)]'
                  }`} />
                  <span className="text-[11px]">{d === 0 ? 'Now' : `+${d}d`}</span>
                </button>
              ))}
            </div>

            <div className="text-[11px] text-[var(--text-muted)] text-right">
              Projection: <strong className="text-[var(--heat)]">+{timeScrubberDay} Days</strong>
            </div>
          </div>
        </div>

        {/* Right: Focused Location Intelligence Drawer (5 Cols) */}
        <div className="lg:col-span-5 card-curvy p-6 sm:p-7 flex flex-col justify-between">
          <div>
            {/* Header Identity */}
            <div className="flex items-start justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--brand)] font-semibold">
                  <MapPin size={13} />
                  <span>{current.parent_region || 'Tamil Nadu, India'}</span>
                </div>
                <h2 className="text-xl font-bold text-[var(--text)] mt-0.5">{current.name}</h2>
                <div className="text-xs text-[var(--text-muted)] font-mono-numbers">
                  Population: {current.population}
                </div>
              </div>
            </div>

            {/* Hero Number Anchor (64px+) */}
            <div className="my-4 p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)]">
              <ScoreBadge
                score={dynamicRisk}
                label={timeScrubberDay > 0 ? `Modelled +${timeScrubberDay}d Risk Projection` : 'Current Climate Impact Index'}
                band={dynamicBand}
                size="hero"
              />
            </div>

            {/* Navigation Tabs inside Drawer */}
            <div className="flex items-center gap-1.5 border-b border-[var(--border)] pb-2 mb-4 text-xs font-medium overflow-x-auto">
              {[
                { id: 'drivers', label: 'Top Drivers' },
                { id: 'subscores', label: 'Sub-scores' },
                { id: 'why', label: 'Why This Score' },
                { id: 'advisor', label: 'Advisor' },
                { id: 'trend', label: 'Outlook' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as DrawerTab)}
                  className={`px-3 py-1.5 rounded-full cursor-pointer transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[var(--brand)] text-[var(--bg)] font-semibold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab 1: Top 3 Drivers & Next Action (Default View) */}
            {activeTab === 'drivers' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[var(--text)] block">
                    Top 3 Contributing Risk Drivers:
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-[4px] bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Thermometer size={14} className="text-[var(--heat)]" />
                        <span className="text-[var(--text)] font-medium">Surface Temperature Anomaly</span>
                      </div>
                      <span className="font-mono-numbers font-bold text-[var(--heat)]">+27%</span>
                    </div>

                    <div className="p-2.5 rounded-[4px] bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets size={14} className="text-[var(--water)]" />
                        <span className="text-[var(--text)] font-medium">Precipitation Deficit Anomaly</span>
                      </div>
                      <span className="font-mono-numbers font-bold text-[var(--water)]">-28%</span>
                    </div>

                    <div className="p-2.5 rounded-[4px] bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart size={14} className="text-[var(--critical)]" />
                        <span className="text-[var(--text)] font-medium">Informal Housing & Tanker Deficit</span>
                      </div>
                      <span className="font-mono-numbers font-bold text-[var(--critical)]">86/100</span>
                    </div>
                  </div>
                </div>

                {/* Next Recommended Action Banner */}
                <div className="p-3.5 rounded-[5px] bg-[var(--brand-subtle)] border border-[var(--brand)]/40 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--brand)]">
                    <ShieldCheck size={14} />
                    <span>Next Immediate Operational Directive:</span>
                  </div>
                  <p className="text-xs text-[var(--text)] leading-relaxed">
                    Deploy emergency water bowsers and activate school hall cooling shelters in Wards 1–4 before peak midday temperatures.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Sub-scores Grid */}
            {activeTab === 'subscores' && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-[4px] border border-[var(--border)] bg-[var(--surface-raised)]">
                  <span className="text-[11px] text-[var(--text-muted)] block">Heat Risk</span>
                  <span className="text-lg font-mono-numbers font-bold text-[var(--heat)]">{current.heat_risk}</span>
                </div>
                <div className="p-2.5 rounded-[4px] border border-[var(--border)] bg-[var(--surface-raised)]">
                  <span className="text-[11px] text-[var(--text-muted)] block">Water Stress</span>
                  <span className="text-lg font-mono-numbers font-bold text-[var(--water)]">{current.water_stress}</span>
                </div>
                <div className="p-2.5 rounded-[4px] border border-[var(--border)] bg-[var(--surface-raised)]">
                  <span className="text-[11px] text-[var(--text-muted)] block">Health Risk</span>
                  <span className="text-lg font-mono-numbers font-bold text-[var(--critical)]">{current.health_risk}</span>
                </div>
                <div className="p-2.5 rounded-[4px] border border-[var(--border)] bg-[var(--surface-raised)]">
                  <span className="text-[11px] text-[var(--text-muted)] block">Flood Sensitivity</span>
                  <span className="text-lg font-mono-numbers font-bold text-[var(--flood)]">{current.flood_risk}</span>
                </div>
                <div className="p-2.5 rounded-[4px] border border-[var(--border)] bg-[var(--surface-raised)]">
                  <span className="text-[11px] text-[var(--text-muted)] block">Vulnerability</span>
                  <span className="text-lg font-mono-numbers font-bold text-[var(--text)]">{current.vulnerability}</span>
                </div>
                <div className="p-2.5 rounded-[4px] border border-[var(--border)] bg-[var(--surface-raised)]">
                  <span className="text-[11px] text-[var(--text-muted)] block">Adaptive Buffer</span>
                  <span className="text-lg font-mono-numbers font-bold text-[var(--resilience)]">{current.adaptive_capacity}</span>
                </div>
              </div>
            )}

            {/* Tab 3: Why This Score (SHAP Attribution) */}
            {activeTab === 'why' && explanation && (
              <div className="space-y-3 font-mono-numbers text-xs">
                <p className="font-sans text-xs text-[var(--text-muted)] leading-relaxed">
                  {explanation.summary}
                </p>
                <div className="space-y-2 pt-1">
                  {explanation.factors.map((f) => (
                    <div key={f.factor} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-[var(--text)] font-sans truncate mr-2">{f.factor}</span>
                        <span className="font-bold text-[var(--brand)]">+{f.percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[var(--surface-raised)] rounded-full overflow-hidden border border-[var(--border)]">
                        <div
                          className="h-full bg-[var(--brand)]"
                          style={{ width: `${Math.min(100, f.percentage * 2.8)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Resilience Advisor Contextual Guidance */}
            {activeTab === 'advisor' && (
              <div className="space-y-3 text-xs">
                {aiLoading ? (
                  <div className="p-4 rounded bg-[var(--surface-raised)] text-[var(--text-muted)] flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing local vulnerabilities...</span>
                  </div>
                ) : aiAdvice ? (
                  <div className="space-y-2.5 p-3 rounded-[4px] bg-[var(--surface-raised)] border border-[var(--border)]">
                    <div className="font-semibold text-sm text-[var(--text)]">
                      {aiAdvice.recommendation}
                    </div>
                    <ul className="space-y-1 text-[var(--text-muted)] list-disc list-inside">
                      {aiAdvice.reasons.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'What should we prioritize right now?',
                    'Who needs help first in this district?',
                    'What happens if we add 15 cooling centers?',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setAiQuestion(q);
                        handleAskAdvisor(q);
                      }}
                      className="text-[11px] p-1.5 rounded border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)] text-[var(--text)] text-left cursor-pointer transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Trend & 90-Day Outlook */}
            {activeTab === 'trend' && (
              <div className="space-y-3 font-mono-numbers text-xs">
                <div className="p-3 rounded bg-[var(--surface-raised)] border border-[var(--border)] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Onset Phase:</span>
                    <span className="text-[var(--text)]">69 / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Current Phase:</span>
                    <span className="font-bold text-[var(--critical)]">{current.overall_impact} / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Modelled Peak (+90d):</span>
                    <span className="font-bold text-[var(--critical)]">{dynamicRisk} / 100</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Navigation Buttons */}
          <div className="pt-4 mt-4 border-t border-[var(--border)] flex items-center gap-2">
            <button
              onClick={() => navigate('/scenario-lab')}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-full text-xs font-semibold bg-[var(--brand)] text-[var(--bg)] hover:opacity-90 cursor-pointer transition-colors shadow-sm"
            >
              <SlidersHorizontal size={14} />
              <span>Simulate Interventions &rarr;</span>
            </button>
            <button
              onClick={() => navigate('/equity-priorities')}
              className="flex items-center justify-center gap-1 py-3 px-4 rounded-full text-xs font-medium border border-[var(--border)] bg-[var(--surface-raised)] hover:bg-[var(--border)] text-[var(--text)] cursor-pointer transition-colors"
            >
              <span>Equity List</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      <DataMetadataFooter
        source="IMD / ERA5 Micro-grid + Chennai Corporation Wards"
        model="Ensemble XGBoost Analog v1.0"
        confidence="moderate"
      />
    </div>
  );
};
