import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Target, 
  TrendingUp, 
  Scale, 
  ArrowRight, 
  Activity, 
  Sparkles,
  ChevronRight,
  Globe2,
  CloudLightning,
  Video,
  Lock,
  Play
} from 'lucide-react';
import StormVideoBackground from '../components/ui/StormVideoBackground';
import ThunderFlash3D from '../components/ui/ThunderFlash3D';

export const Landing: React.FC = () => {
  const [activeBgMode, setActiveBgMode] = useState<'normal' | 'storm' | 'thunder'>('normal');

  const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
    if (activeBgMode === 'storm') {
      return (
        <StormVideoBackground intensity="extreme" showControls={true} className="min-h-screen">
          <div className="bg-slate-950/75 backdrop-blur-sm min-h-screen text-white">
            {children}
          </div>
        </StormVideoBackground>
      );
    } else if (activeBgMode === 'thunder') {
      return (
        <ThunderFlash3D autoFlash={true} flashInterval={3000} showTrigger={true} className="min-h-screen">
          <div className="bg-slate-950/80 backdrop-blur-sm min-h-screen text-white">
            {children}
          </div>
        </ThunderFlash3D>
      );
    } else {
      return <div className="min-h-screen bg-nature-bg selection:bg-forest-mint selection:text-forest-dark flex flex-col">{children}</div>;
    }
  };

  return (
    <ContentWrapper>
      {/* Navigation */}
      <nav className="p-6 md:p-8 flex justify-between items-center max-w-7xl mx-auto w-full z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-forest-dark rounded-xl flex items-center justify-center text-forest-mint font-black text-xl shadow-md border border-forest-sage/40">
            EL
          </div>
          <div>
            <span className={`text-2xl font-heading font-black tracking-tight ${activeBgMode !== 'normal' ? 'text-white' : 'text-forest-dark'}`}>
              EL-NEXUS
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest text-forest-sage px-2 py-0.5 bg-forest-dark/10 rounded-full border border-forest-sage/30">
              Climate Intelligence
            </span>
          </div>
        </div>

        {/* 3D Background Switcher Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1 bg-black/40 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setActiveBgMode('normal')}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeBgMode === 'normal' ? 'bg-forest-sage text-forest-dark' : 'text-slate-300 hover:text-white'
              }`}
            >
              Default
            </button>
            <button
              onClick={() => setActiveBgMode('storm')}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeBgMode === 'storm' ? 'bg-teal-500 text-slate-950 font-extrabold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Video size={12} /> 3D Storm
            </button>
            <button
              onClick={() => setActiveBgMode('thunder')}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                activeBgMode === 'thunder' ? 'bg-cyan-400 text-slate-950 font-extrabold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <CloudLightning size={12} /> Thunder Flash
            </button>
          </div>

          <Link 
            to="/login" 
            className="px-5 py-2.5 bg-cyan-500 text-slate-950 rounded-xl text-xs font-mono font-bold hover:bg-cyan-400 transition-all shadow-lg flex items-center gap-2 hover:-translate-y-0.5 cursor-pointer"
          >
            <Lock size={14} /> Agency Sign In
          </Link>

          <Link 
            to="/dashboard" 
            className="px-6 py-2.5 bg-forest-dark text-white rounded-xl text-sm font-bold hover:bg-forest-secondary transition-all shadow-md shadow-forest-dark/15 flex items-center gap-2 hover:-translate-y-0.5"
          >
            Command Center <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1 z-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest-mint/70 border border-forest-sage/40 rounded-full text-forest-dark text-xs font-bold uppercase tracking-wider shadow-2xs">
            <Shield size={14} className="text-forest-secondary" /> Climate Decision Intelligence
          </div>

          <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-heading font-extrabold leading-[1.08] tracking-tight ${activeBgMode !== 'normal' ? 'text-white' : 'text-nature-text'}`}>
            Understand the Impact. <br />
            <span className="text-cyan-400 italic font-serif">Simulate the Future.</span> <br />
            Build Resilience.
          </h1>

          <p className={`text-lg sm:text-xl max-w-xl leading-relaxed ${activeBgMode !== 'normal' ? 'text-slate-300' : 'text-nature-muted'}`}>
            An intelligent interface for understanding how El Niño affects places and communities, 
            exploring strategies and supporting equitable climate decisions.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link 
              to="/login" 
              className="px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold rounded-xl font-mono flex items-center gap-3 transition-all shadow-xl shadow-cyan-500/25 hover:-translate-y-1 text-base cursor-pointer"
            >
              Sign In To Portal <Lock size={18} />
            </Link>
            <Link 
              to="/dashboard" 
              className="px-8 py-4 bg-forest-dark text-white rounded-xl font-bold flex items-center gap-3 hover:bg-forest-secondary transition-all shadow-xl shadow-forest-dark/20 hover:-translate-y-1 text-base cursor-pointer"
            >
              Enter Command Center <ArrowRight size={20} />
            </Link>
            <Link 
              to="/simulator" 
              className="px-6 py-4 bg-white/90 hover:bg-white text-forest-dark border border-nature-border rounded-xl font-bold flex items-center gap-2 transition-all shadow-2xs text-base cursor-pointer"
            >
              <Activity size={18} className="text-forest-sage" /> Launch Simulator
            </Link>
          </div>

          {/* Quick Stats Pill */}
          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-700/50 max-w-lg">
            <div>
              <p className={`text-2xl font-heading font-extrabold ${activeBgMode !== 'normal' ? 'text-cyan-400' : 'text-forest-dark'}`}>5</p>
              <p className={`text-xs font-medium ${activeBgMode !== 'normal' ? 'text-slate-400' : 'text-nature-muted'}`}>Critical Vulnerability Zones</p>
            </div>
            <div>
              <p className={`text-2xl font-heading font-extrabold ${activeBgMode !== 'normal' ? 'text-cyan-400' : 'text-forest-dark'}`}>+1.8°C</p>
              <p className={`text-xs font-medium ${activeBgMode !== 'normal' ? 'text-slate-400' : 'text-nature-muted'}`}>Active ONI Advisory</p>
            </div>
            <div>
              <p className={`text-2xl font-heading font-extrabold ${activeBgMode !== 'normal' ? 'text-cyan-400' : 'text-forest-dark'}`}>40%+</p>
              <p className={`text-xs font-medium ${activeBgMode !== 'normal' ? 'text-slate-400' : 'text-nature-muted'}`}>Loss Avoidable via Action</p>
            </div>
          </div>
        </div>

        {/* Abstract Visual Component */}
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-teal-500/20 rounded-3xl opacity-40 blur-2xl -rotate-2"></div>
          
          <div className="relative h-full w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl shadow-xl overflow-hidden p-8 flex flex-col justify-between min-h-[440px]">
            {/* 3D Storm Preview Selector Card */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-1.5">
                  <CloudLightning size={14} /> 3D Atmospheric Rendering Engine
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  WebGL 3D Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setActiveBgMode('storm')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeBgMode === 'storm'
                      ? 'bg-teal-950/90 border-teal-400 text-teal-200 ring-2 ring-teal-400/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <Video size={20} className="text-teal-400 mb-2" />
                  <p className="font-bold text-sm">3D Storm Video</p>
                  <p className="text-[11px] text-slate-400 mt-1">Swirling particles, rain vectors, fog depth canvas.</p>
                </button>

                <button
                  onClick={() => setActiveBgMode('thunder')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    activeBgMode === 'thunder'
                      ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200 ring-2 ring-cyan-400/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <CloudLightning size={20} className="text-cyan-400 mb-2" />
                  <p className="font-bold text-sm">Thunder Flash 3D</p>
                  <p className="text-[11px] text-slate-400 mt-1">Volumetric 3D electric arcs & screen flashes.</p>
                </button>
              </div>

              {/* Styled SVG Pattern representing terrain/contours */}
              <div className="relative w-full h-36 flex items-center justify-center rounded-xl bg-slate-950/60 border border-slate-800 p-2 overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 400 240" className="opacity-85">
                  <defs>
                    <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#0F172A" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <path d="M20 200 Q 100 120 200 180 T 380 140" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                  <path d="M20 160 Q 120 90 220 140 T 380 110" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeDasharray="4,2" />
                  <path d="M20 120 Q 140 60 250 110 T 380 80" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                  
                  {/* Hotspot markers */}
                  <circle cx="200" cy="180" r="14" fill="#38bdf8" fillOpacity="0.25" />
                  <circle cx="200" cy="180" r="5" fill="#38bdf8" />
                  <circle cx="280" cy="80" r="10" fill="#2dd4bf" fillOpacity="0.3" />
                  <circle cx="280" cy="80" r="4" fill="#2dd4bf" />
                </svg>

                <div className="absolute top-3 right-3 bg-black/80 border border-slate-700 px-2.5 py-1 rounded-lg text-[10px] font-mono text-cyan-300 flex items-center gap-1">
                  <Globe2 size={12} className="text-cyan-400" /> ENSO Live Data
                </div>
              </div>
            </div>

            {/* Quote Insight Card */}
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl text-white shadow-md mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={13} className="text-cyan-400" />
                <p className="text-[10px] uppercase font-bold tracking-[2px] text-cyan-300">System Insight</p>
              </div>
              <p className="font-heading text-sm sm:text-base font-medium italic leading-snug text-slate-200">
                "Differences in climate exposure reveal where action is most critical."
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Capability Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 border-t border-slate-800/80 w-full z-10">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-xs uppercase font-bold tracking-widest text-cyan-400 mb-2">Architectural Pillars</p>
          <h2 className={`text-3xl font-heading font-black ${activeBgMode !== 'normal' ? 'text-white' : 'text-nature-text'}`}>
            Designed for Rigorous Decision-Making
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              id: '01', 
              title: 'UNDERSTAND', 
              desc: 'Reveal differences in climate exposure and community vulnerability with high-resolution geospatial indicators.', 
              icon: Target,
              path: '/impact'
            },
            { 
              id: '02', 
              title: 'SIMULATE', 
              desc: 'Explore possible climate futures and intervention strategies before locking in public capital expenditures.', 
              icon: TrendingUp,
              path: '/simulator'
            },
            { 
              id: '03', 
              title: 'PRIORITIZE', 
              desc: 'Support equitable resilience decisions and resource allocation weighted by poverty, exposure, and infrastructure gaps.', 
              icon: Scale,
              path: '/equity'
            }
          ].map((cap) => (
            <Link 
              key={cap.id} 
              to={cap.path}
              className={`p-8 rounded-2xl border transition-all hover:shadow-lg group flex flex-col justify-between ${
                activeBgMode !== 'normal'
                  ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-400/50'
                  : 'bg-white border-nature-border hover:border-forest-sage'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-heading font-black text-cyan-400">
                    {cap.id}
                  </span>
                  <div className="p-3 bg-slate-950 rounded-xl text-cyan-300 border border-slate-800">
                    <cap.icon size={22} />
                  </div>
                </div>
                <h3 className={`text-xl font-heading font-bold ${activeBgMode !== 'normal' ? 'text-white' : 'text-nature-text'}`}>
                  {cap.title}
                </h3>
                <p className={`text-sm leading-relaxed ${activeBgMode !== 'normal' ? 'text-slate-300' : 'text-nature-muted'}`}>{cap.desc}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800 flex items-center text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                Explore Module <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 md:px-8 text-center text-xs text-slate-400 z-10">
        <p>© 2026 EL-NEXUS Climate Resilience Intelligence. Built for humanitarian agencies, local governments, and civil protection.</p>
      </footer>
    </ContentWrapper>
  );
};

export default Landing;
