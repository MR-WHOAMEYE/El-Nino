import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import {
  Compass,
  TrendingUp,
  Scale,
  Zap,
  Volume2,
  VolumeX,
  CloudRain,
  ChevronRight,
  ArrowRight,
  Sun,
  Moon,
  Globe,
  Radio,
  SlidersHorizontal,
  Users,
  Sprout,
  Activity,
  Layers
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme, setLanguage } = useAppStore();

  // Innovative atmospheric climate controls (from user screenshot)
  const [isRainActive, setIsRainActive] = useState(true);
  const [isThunderFlashing, setIsThunderFlashing] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Trigger brief thunder ambient flash
  const handleStrikeThunder = () => {
    setIsThunderFlashing(true);
    setTimeout(() => setIsThunderFlashing(false), 300);
  };

  // Synthesize soft ambient rain audio via Web Audio API (zero external assets needed)
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let node: AudioNode | null = null;

    if (isAudioPlaying) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtx = new AudioContextClass();
        const bufferSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        // Generate soft brown/pink noise representing rain
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 0.12; // gentle volume
        }
        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = buffer;
        whiteNoise.loop = true;

        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.15;

        whiteNoise.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        whiteNoise.start();
        node = whiteNoise;
      } catch {
        // Fallback gracefully if browser audio is blocked
      }
    }

    return () => {
      if (node) {
        try { (node as any).stop(); } catch {}
      }
      if (audioCtx) {
        try { audioCtx.close(); } catch {}
      }
    };
  }, [isAudioPlaying]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col transition-colors duration-300 selection:bg-[var(--brand-mint)] selection:text-[#091A16]">
      {/* Top Header */}
      <header className="h-16 border-b border-[var(--border)] bg-[var(--surface)] px-6 lg:px-12 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[var(--brand)] text-[var(--bg)] flex items-center justify-center font-bold text-sm shadow-xs">
            CS
          </div>
          <div>
            <span className="font-bold text-sm tracking-wide text-[var(--text)] block">
              CLIMA-SHIELD
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono-numbers block -mt-0.5">
              Climate Resilience Intelligence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button
            onClick={() => {
              setLanguage('ta');
              navigate('/citizen');
            }}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] hover:bg-[var(--surface)] text-xs font-semibold text-[var(--text)] transition-colors cursor-pointer"
          >
            <Globe size={13} className="text-[var(--brand)]" />
            <span>தமிழ் எச்சரிக்கை</span>
          </button>

          <button
            onClick={() => navigate('/command-center')}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#C8DFDB] text-[#091A16] hover:bg-[#D6EAE5] cursor-pointer transition-all shadow-sm font-sans"
          >
            <span>Open Command Center</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </header>

      {/* ========================================================
          HERO SECTION: Atmospheric, Innovative, Editorial
          Exact Match to Reference Screenshot 2
          ======================================================== */}
      <section
        className={`relative w-full overflow-hidden transition-all duration-300 py-16 lg:py-24 px-6 lg:px-14 border-b border-[var(--border)] ${
          isThunderFlashing ? 'bg-[#183D33]' : 'bg-[#091A16]'
        }`}
        style={{ minHeight: '620px' }}
      >
        {/* Ambient Subtle Rain Streaks Effect */}
        {isRainActive && (
          <div className="absolute inset-0 pointer-events-none rain-drops opacity-40 z-0" />
        )}

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Bold Editorial Headline */}
          <div className="lg:col-span-7 space-y-6 text-[#F3F6F1]">
            {/* Tag Pill with Hexagon Symbol */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1E4338] bg-[#0E241F]/80 text-[11px] font-mono-numbers text-[#C8DFDB] tracking-wider uppercase">
              <span className="text-[#C8DFDB]">⬡</span>
              <span>CLIMATE DECISION INTELLIGENCE</span>
            </div>

            {/* Headline with Editorial Serif Italic Focus */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] text-[#F4F6F1]">
              Understand the <br />
              Impact. <br />
              <span className="font-editorial italic font-normal text-[#C8DFDB]">
                Simulate the Future.
              </span> <br />
              Build Resilience.
            </h1>

            <p className="text-base sm:text-lg text-[#8FA89F] leading-relaxed max-w-xl font-normal">
              An intelligent interface for understanding how El Niño affects places and communities, exploring strategies and supporting equitable climate decisions.
            </p>

            {/* Curvy Pill Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/command-center')}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-semibold bg-[#C8DFDB] text-[#091A16] hover:bg-[#DCEDE7] cursor-pointer transition-all shadow-[0_0_24px_rgba(200,223,219,0.25)] hover:scale-[1.02]"
              >
                <span>Enter Command Center</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => navigate('/scenario-lab')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-full text-sm font-medium border border-[#1E4338] bg-[#0E241F]/60 hover:bg-[#14332B] text-[#F3F6F1] cursor-pointer transition-all"
              >
                <SlidersHorizontal size={15} className="text-[#C8DFDB]" />
                <span>Launch Simulator</span>
              </button>
            </div>
          </div>

          {/* Right Column: Curvy Telemetry Card with Animated Waves */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-3xl border border-[#1C4238] bg-[#0E241F]/90 backdrop-blur-md p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-6">
              {/* Telemetry Header */}
              <div className="flex items-center justify-end">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1C4238] bg-[#14332B] text-[11px] font-mono-numbers text-[#C8DFDB]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8DFDB] animate-pulse" />
                  <span>ENSO Telemetry Live</span>
                </div>
              </div>

              {/* Sine Wave Visualizer with Glowing Nodes */}
              <div className="relative h-44 w-full flex items-center justify-center">
                <svg
                  viewBox="0 0 320 120"
                  className="w-full h-full overflow-visible"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Subtle Wave 1 */}
                  <path
                    d="M 10 70 C 60 40, 110 95, 170 50 C 230 15, 270 75, 310 45"
                    stroke="#1C4238"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  {/* Active Telemetry Wave 2 */}
                  <path
                    d="M 10 50 C 70 85, 120 20, 180 60 C 240 95, 275 35, 310 55"
                    stroke="#C8DFDB"
                    strokeWidth="2"
                    strokeOpacity="0.85"
                  />
                  {/* Lower Wave 3 */}
                  <path
                    d="M 10 90 C 80 50, 130 100, 190 70 C 250 45, 280 80, 310 75"
                    stroke="#8FA89F"
                    strokeWidth="1.2"
                    strokeOpacity="0.4"
                  />

                  {/* Pulsing Telemetry Nodes */}
                  <circle cx="75" cy="72" r="5" fill="#E5A355" />
                  <circle cx="75" cy="72" r="9" stroke="#E5A355" strokeOpacity="0.4" strokeWidth="1.5" className="animate-ping" />

                  <circle cx="180" cy="60" r="6" fill="#C8DFDB" />
                  <circle cx="180" cy="60" r="11" stroke="#C8DFDB" strokeOpacity="0.5" strokeWidth="1.5" />

                  <circle cx="260" cy="48" r="5" fill="#E26F5A" />
                  <circle cx="260" cy="48" r="9" stroke="#E26F5A" strokeOpacity="0.4" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Bottom Quote Insight Box */}
              <div className="p-4 rounded-2xl bg-[#091A16]/70 border border-[#16362E] space-y-1.5">
                <div className="text-[10px] font-mono-numbers uppercase tracking-wider text-[#8FA89F] flex items-center gap-1.5">
                  <span className="text-[#C8DFDB]">✦</span>
                  <span>SYSTEM INSIGHT</span>
                </div>
                <p className="text-xs sm:text-sm text-[#F3F6F1] font-sans italic leading-relaxed">
                  "Differences in climate exposure reveal where action is most critical."
                </p>
              </div>
            </div>

            {/* Bottom Atmospheric Sensory Controls (Screenshot 2 Features) */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-1 text-[11px] font-mono-numbers text-[#8FA89F]">
              <button
                onClick={handleStrikeThunder}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#1C4238] bg-[#0E241F]/60 hover:bg-[#14332B] hover:text-[#C8DFDB] cursor-pointer transition-colors"
              >
                <Zap size={12} className="text-[#E5A355]" />
                <span>Strike Thunder</span>
              </button>

              <button
                onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#1C4238] bg-[#0E241F]/60 hover:bg-[#14332B] hover:text-[#C8DFDB] cursor-pointer transition-colors"
              >
                {isAudioPlaying ? (
                  <>
                    <Volume2 size={12} className="text-[#C8DFDB]" />
                    <span>Rain Sound On</span>
                  </>
                ) : (
                  <>
                    <VolumeX size={12} />
                    <span>Rain Sound</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsRainActive(!isRainActive)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                  isRainActive
                    ? 'border-[#C8DFDB]/50 bg-[#14332B] text-[#C8DFDB]'
                    : 'border-[#1C4238] bg-[#0E241F]/60 text-[#8FA89F]'
                }`}
              >
                <CloudRain size={12} />
                <span>{isRainActive ? 'Rainy Mode Active' : 'Rain Disabled'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          ARCHITECTURAL PILLARS SECTION: Warm Linen Canvas & 3 Curvy White Cards
          Exact Match to Reference Screenshot 1
          ======================================================== */}
      <section className="bg-[var(--bg)] py-20 px-6 lg:px-14">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[11px] font-mono-numbers font-semibold text-[var(--text-muted)] tracking-widest uppercase block">
              ARCHITECTURAL PILLARS
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
              Designed for Rigorous Decision-Making
            </h2>
          </div>

          {/* 3 Curvy White Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 01: UNDERSTAND */}
            <div className="card-curvy p-8 bg-[var(--surface)] flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-mono-numbers font-bold text-[#A2C0B7]">
                    01
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-[var(--text)] group-hover:bg-[#C8DFDB]/30 transition-colors">
                    <Compass size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold tracking-tight text-[var(--text)] uppercase font-sans">
                    UNDERSTAND
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    Reveal differences in climate exposure and community vulnerability with high-resolution geospatial indicators.
                  </p>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => navigate('/command-center')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand)] hover:underline cursor-pointer group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Explore Module</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Card 02: SIMULATE */}
            <div className="card-curvy p-8 bg-[var(--surface)] flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-mono-numbers font-bold text-[#A2C0B7]">
                    02
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-[var(--text)] group-hover:bg-[#C8DFDB]/30 transition-colors">
                    <TrendingUp size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold tracking-tight text-[var(--text)] uppercase font-sans">
                    SIMULATE
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    Explore possible climate futures and intervention strategies before locking in public capital expenditures.
                  </p>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => navigate('/scenario-lab')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand)] hover:underline cursor-pointer group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Explore Module</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>

            {/* Card 03: PRIORITIZE */}
            <div className="card-curvy p-8 bg-[var(--surface)] flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-mono-numbers font-bold text-[#A2C0B7]">
                    03
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-[var(--text)] group-hover:bg-[#C8DFDB]/30 transition-colors">
                    <Scale size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold tracking-tight text-[var(--text)] uppercase font-sans">
                    PRIORITIZE
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    Support equitable resilience decisions and resource allocation weighted by poverty, exposure, and infrastructure gaps.
                  </p>
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => navigate('/equity-priorities')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand)] hover:underline cursor-pointer group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Explore Module</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          ROLE-BASED DIRECT ADVISORY PORTALS (Curvy, Professional)
          ======================================================== */}
      <section className="py-16 px-6 lg:px-14 border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[11px] font-mono-numbers font-semibold text-[var(--text-muted)] tracking-wider uppercase block">
              SPECIALIZED DOMAIN WORKFLOWS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
              Frontline Portals for Climate Action
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              onClick={() => navigate('/command-center')}
              className="card-curvy p-6 bg-[var(--surface-raised)] hover:bg-[var(--surface)] transition-all cursor-pointer group space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#C8DFDB]/40 text-[#091A16] flex items-center justify-center">
                <Layers size={22} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--text)] group-hover:text-[var(--brand)] transition-colors">
                  Municipal Command Center
                </h4>
                <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                  Open-source Leaflet GIS, 90-day trajectory scrubber, and SHAP drivers.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-[var(--brand)] flex items-center gap-1">
                <span>Access Console</span>
                <ChevronRight size={13} />
              </div>
            </div>

            <div
              onClick={() => navigate('/citizen')}
              className="card-curvy p-6 bg-[var(--surface-raised)] hover:bg-[var(--surface)] transition-all cursor-pointer group space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#C8DFDB]/40 text-[#091A16] flex items-center justify-center">
                <Users size={22} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--text)] group-hover:text-[var(--brand)] transition-colors">
                  Citizen Advisory & Havens
                </h4>
                <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                  Air-conditioned cooling havens, live water tankers, and symptom triage.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-[var(--brand)] flex items-center gap-1">
                <span>Access Console</span>
                <ChevronRight size={13} />
              </div>
            </div>

            <div
              onClick={() => navigate('/farmer')}
              className="card-curvy p-6 bg-[var(--surface-raised)] hover:bg-[var(--surface)] transition-all cursor-pointer group space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#C8DFDB]/40 text-[#091A16] flex items-center justify-center">
                <Sprout size={22} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--text)] group-hover:text-[var(--brand)] transition-colors">
                  Farmer Agromet Brief
                </h4>
                <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                  5-crop advisory matrix, AWD irrigation scheduler, and soil moisture telemetry.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-[var(--brand)] flex items-center gap-1">
                <span>Access Console</span>
                <ChevronRight size={13} />
              </div>
            </div>

            <div
              onClick={() => navigate('/healthcare')}
              className="card-curvy p-6 bg-[var(--surface-raised)] hover:bg-[var(--surface)] transition-all cursor-pointer group space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#C8DFDB]/40 text-[#091A16] flex items-center justify-center">
                <Activity size={22} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--text)] group-hover:text-[var(--brand)] transition-colors">
                  Healthcare Surge Center
                </h4>
                <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                  Clinical bed census, syndromic heat admissions, and IV fluid buffer stocks.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-[var(--brand)] flex items-center gap-1">
                <span>Access Console</span>
                <ChevronRight size={13} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Minimalist Institutional Footer (Exact match to Screenshot 1) */}
      <footer className="mt-auto py-8 px-6 lg:px-14 border-t border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-numbers text-center sm:text-left">
          <div>
            © 2026 CLIMA-SHIELD Climate Resilience Intelligence. Built for humanitarian agencies, local governments, and civil protection.
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">
            Open-Source Leaflet GIS • Offline-Resilient
          </div>
        </div>
      </footer>
    </div>
  );
};
