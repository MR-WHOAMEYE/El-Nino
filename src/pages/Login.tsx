import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  Zap, 
  CloudLightning, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Globe2,
  Sparkles,
  AlertCircle,
  Video
} from 'lucide-react';
import StormVideoBackground from '../components/ui/StormVideoBackground';
import ThunderFlash3D from '../components/ui/ThunderFlash3D';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  
  // Background selection state: 'storm' or 'thunder'
  const [bgMode, setBgMode] = useState<'storm' | 'thunder'>('thunder');
  
  // Auth Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both authorized email and security key.');
      return;
    }

    setLoading(true);

    // Simulate secure authentication verification delay
    setTimeout(() => {
      setLoading(false);
      setLoginSuccess(true);

      setTimeout(() => {
        navigate('/dashboard');
      }, 900);
    }, 1200);
  };

  const handleQuickDemoAuth = () => {
    setEmail('command@elnino-nexus.org');
    setPassword('••••••••••••');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setLoginSuccess(true);

      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    }, 1000);
  };

  const BackgroundContainer = ({ children }: { children: React.ReactNode }) => {
    if (bgMode === 'storm') {
      return (
        <StormVideoBackground intensity="extreme" showControls={true} className="min-h-screen">
          {children}
        </StormVideoBackground>
      );
    } else {
      return (
        <ThunderFlash3D autoFlash={true} flashInterval={3200} showTrigger={true} className="min-h-screen">
          {children}
        </ThunderFlash3D>
      );
    }
  };

  return (
    <BackgroundContainer>
      <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between max-w-7xl mx-auto w-full z-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-teal-950/90 border border-teal-400/40 rounded-xl flex items-center justify-center text-teal-300 font-black text-xl shadow-lg shadow-teal-950/50 group-hover:scale-105 transition-transform backdrop-blur-md">
              EL
            </div>
            <div>
              <span className="text-xl font-heading font-black tracking-tight text-white flex items-center gap-2">
                EL-NEXUS <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">v3.4</span>
              </span>
              <p className="text-[10px] text-teal-300/70 font-mono uppercase tracking-wider">
                Climate Action Platform
              </p>
            </div>
          </Link>

          {/* 3D Background Toggle Selector */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md shadow-2xl">
            <button
              onClick={() => setBgMode('storm')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                bgMode === 'storm'
                  ? 'bg-teal-500/30 text-teal-200 border border-teal-400/50 shadow-md shadow-teal-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Video size={13} className={bgMode === 'storm' ? 'text-teal-400' : ''} /> 3D Storm Video
            </button>
            <button
              onClick={() => setBgMode('thunder')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                bgMode === 'thunder'
                  ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/50 shadow-md shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CloudLightning size={13} className={bgMode === 'thunder' ? 'text-cyan-400 animate-pulse' : ''} /> Thunder Flash 3D
            </button>
          </div>
        </header>

        {/* Main Authentication Card */}
        <main className="flex-1 flex items-center justify-center my-8 z-20">
          <div className="w-full max-w-md relative">
            {/* Ambient Background Glow halo behind card */}
            <div className={`absolute -inset-1 rounded-3xl blur-2xl opacity-50 transition-all duration-700 ${
              bgMode === 'thunder' 
                ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-500' 
                : 'bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700'
            }`} />

            <div className="relative bg-slate-950/80 backdrop-blur-2xl border border-slate-700/60 rounded-3xl p-8 shadow-2xl text-white">
              {/* Security Classification Badge */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-cyan-400" />
                  <span className="text-xs font-mono font-bold uppercase text-slate-300 tracking-wider">
                    Secured Telemetry Access
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Node Active
                </span>
              </div>

              {/* Title Header */}
              <div className="mb-6 space-y-1">
                <h1 className="text-2xl font-heading font-extrabold text-white tracking-tight flex items-center justify-between">
                  Command Center Sign In
                  {bgMode === 'thunder' ? (
                    <Zap size={20} className="text-cyan-400 animate-bounce" />
                  ) : (
                    <Sparkles size={20} className="text-teal-400" />
                  )}
                </h1>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter authorized credentials to access ENSO telemetry dashboards, vulnerability indexes, and simulator labs.
                </p>
              </div>

              {/* Success Notification */}
              {loginSuccess && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-3 animate-fade-in">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold">Authentication Verified!</p>
                    <p className="text-[11px] text-emerald-300/80">Connecting to global climate telemetry stream...</p>
                  </div>
                </div>
              )}

              {/* Error Notification */}
              {error && (
                <div className="mb-6 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2.5 animate-shake">
                  <AlertCircle size={16} className="text-rose-400 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Form inputs */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                    Agency / Official Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="officer@un-ocha.org"
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono font-medium text-slate-300">
                      Security Key / Password
                    </label>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Security clearance reset link dispatched to your agency administrator."); }} className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors">
                      Forgot clearance key?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-400 w-4 h-4 cursor-pointer"
                    />
                    <span>Persist encrypted terminal session</span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading || loginSuccess}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    bgMode === 'thunder'
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25 hover:shadow-cyan-400/40'
                      : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-teal-500/25 hover:shadow-teal-400/40'
                  } ${loading ? 'opacity-80 cursor-wait' : ''}`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Authenticating Security Token...
                    </span>
                  ) : (
                    <>
                      Sign In To Command Center <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Quick Demo Access Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative px-3 bg-slate-950 text-[10px] font-mono uppercase text-slate-500 inline-block">
                  Or Quick Access
                </div>
              </div>

              {/* Demo Sign In Button */}
              <button
                type="button"
                onClick={handleQuickDemoAuth}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700/80 text-xs font-mono font-bold text-cyan-300 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-cyan-500/40"
              >
                <KeyRound size={14} className="text-cyan-400" /> Bypass with Demo Clearance
              </button>
            </div>
          </div>
        </main>

        {/* Footer info */}
        <footer className="max-w-7xl mx-auto w-full z-20 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2 border-t border-slate-800/60 pt-4">
          <div className="flex items-center gap-2">
            <Globe2 size={13} className="text-cyan-400" />
            <span>EL-NEXUS Atmospheric & Humanitarian Network</span>
          </div>
          <p>© 2026 EL-NEXUS Intelligence. Encrypted TLS 1.3 Node Connection.</p>
        </footer>
      </div>
    </BackgroundContainer>
  );
};

export default Login;
