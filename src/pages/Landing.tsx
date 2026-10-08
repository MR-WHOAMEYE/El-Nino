import React from 'react';
import { 
  Shield, 
  Target, 
  TrendingUp, 
  Scale, 
  ArrowRight, 
  CheckCircle2,
  Lock,
  Radio,
  FileCheck2,
  Users
} from 'lucide-react';
import { StormVideoBackground } from '../components/ui/StormVideoBackground';
import { AuthPortalCard } from '../components/auth/AuthPortalCard';

export const Landing: React.FC = () => {
  return (
    <div className="landing-root min-h-screen selection:bg-forest-mint selection:text-forest-dark flex flex-col relative overflow-x-hidden text-white">
      {/* Full-screen 3D Storm & Atmospheric Background spanning the whole Landing Page */}
      <StormVideoBackground />

      {/* Main Content Container (Overlaid cleanly on 3D Background) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="p-6 md:p-8 flex justify-between items-center max-w-7xl mx-auto w-full relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-forest-dark/95 rounded-xl flex items-center justify-center text-forest-mint font-black text-xl shadow-lg border border-forest-sage/40 backdrop-blur-md">
              EL
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white drop-shadow-md">EL-NEXUS</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest text-forest-mint px-2.5 py-0.5 bg-forest-dark/80 rounded-full backdrop-blur-md border border-forest-mint/30 shadow-xs">
                Climate Intelligence
              </span>
            </div>
          </div>

          {/* Secure Gateway Clearance Pill */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-forest-dark/80 text-forest-mint border border-forest-mint/30 backdrop-blur-md shadow-xs">
              <Lock size={12} className="text-forest-mint" />
              <span>Verified Access Gateway</span>
            </div>
          </div>
        </nav>

        {/* Hero Section with Auth Portal on the Right */}
        <main className="max-w-7xl mx-auto px-6 md:px-8 pt-4 pb-16 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1 relative z-20">
          {/* Left Column: Brand & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest-dark/80 border border-forest-mint/40 rounded-full text-forest-mint text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md">
              <Shield size={14} className="text-forest-mint" /> Climate Decision Intelligence
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight drop-shadow-lg">
              Understand the Impact. <br />
              <span className="text-forest-mint">Simulate the Future.</span> <br />
              Build Resilience.
            </h1>

            <p className="text-lg sm:text-xl text-white/90 max-w-xl leading-relaxed drop-shadow-md">
              An intelligent interface for understanding how El Niño affects places and communities, 
              exploring strategies and supporting equitable climate decisions.
            </p>

            {/* Platform Trust Highlights */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-white/85">
                <div className="w-5 h-5 rounded-full bg-forest-mint/20 flex items-center justify-center text-forest-mint border border-forest-mint/30 shrink-0">
                  <CheckCircle2 size={13} />
                </div>
                <span><strong>Role-Based Access:</strong> Dedicated portals for Citizen Field Telemetry and Authority Clearance.</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-white/85">
                <div className="w-5 h-5 rounded-full bg-forest-mint/20 flex items-center justify-center text-forest-mint border border-forest-mint/30 shrink-0">
                  <CheckCircle2 size={13} />
                </div>
                <span><strong>Real-Time Climate Forecasting:</strong> Synchronized with NOAA ONI +1.8°C hydrological models.</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-white/85">
                <div className="w-5 h-5 rounded-full bg-forest-mint/20 flex items-center justify-center text-forest-mint border border-forest-mint/30 shrink-0">
                  <CheckCircle2 size={13} />
                </div>
                <span><strong>Equitable Capital Distribution:</strong> Algorithmic adaptation budget optimization.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Login & Sign Up Portal (Replaces image.png card) */}
          <div className="lg:col-span-5 relative w-full">
            <AuthPortalCard />
          </div>
        </main>

        {/* Capability Grid Section (3D animation fully visible throughout with translucent glassmorphic cards) */}
        <section className="py-24 px-6 md:px-8 w-full relative z-20 border-t border-white/10 bg-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-forest-mint mb-3">
                Architectural Pillars
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
                Designed for Rigorous Decision-Making
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  id: '01', 
                  title: 'UNDERSTAND', 
                  desc: 'Reveal differences in climate exposure and community vulnerability with high-resolution geospatial indicators.', 
                  icon: Target
                },
                { 
                  id: '02', 
                  title: 'SIMULATE', 
                  desc: 'Explore possible climate futures and intervention strategies before locking in public capital expenditures.', 
                  icon: TrendingUp
                },
                { 
                  id: '03', 
                  title: 'PRIORITIZE', 
                  desc: 'Support equitable resilience decisions and resource allocation weighted by poverty, exposure, and infrastructure gaps.', 
                  icon: Scale
                }
              ].map((cap) => (
                <div 
                  key={cap.id} 
                  className="p-8 sm:p-10 rounded-3xl bg-black/25 backdrop-blur-xl border border-white/15 hover:border-forest-mint/60 hover:bg-black/35 transition-all hover:shadow-2xl hover:-translate-y-1 group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl sm:text-5xl font-black tracking-tight text-forest-mint group-hover:text-white transition-colors">
                        {cap.id}
                      </span>
                      <div className="p-3 bg-white/10 rounded-2xl group-hover:bg-forest-mint group-hover:text-forest-dark transition-colors text-forest-mint">
                        <cap.icon size={24} />
                      </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-forest-mint transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed">{cap.desc}</p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center text-xs font-bold text-forest-mint">
                    Integrated Intelligence Framework
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer (Transparent with clean border, 3D storm visible to the very bottom) */}
        <footer className="border-t border-white/10 py-10 px-6 md:px-8 text-center text-xs text-white/60 relative z-20 bg-transparent">
          <p>© 2026 EL-NEXUS Climate Resilience Intelligence. Built for humanitarian agencies, local governments, and civil protection.</p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;

