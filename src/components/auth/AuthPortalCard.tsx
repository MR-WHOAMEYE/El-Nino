import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Building2, 
  Briefcase, 
  Mail, 
  Phone, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { useClimate } from '../../context/ClimateContext';

export const AuthPortalCard: React.FC = () => {
  const { currentUser, loginUser, logoutUser } = useClimate();

  // Mode: citizen vs authority
  const [authMode, setAuthMode] = useState<'citizen' | 'authority'>('citizen');
  // Form type: signin vs signup
  const [isSignUp, setIsSignUp] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  // Authority specific fields
  const [workJob, setWorkJob] = useState('');
  const [agency, setAgency] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Google Sign-in Handler
  const handleGoogleSignIn = () => {
    setLoading(true);
    setSuccessMsg('Authenticating with Google OAuth...');
    setTimeout(() => {
      loginUser({
        name: authMode === 'authority' ? 'Dr. Sarah Stierch' : 'Alex Mercer',
        email: authMode === 'authority' ? 's.stierch@ndma.gov.ke' : 'alex.mercer@gmail.com',
        phone: '+254 712 345 678',
        role: authMode,
        workOrJob: authMode === 'authority' ? 'Chief Drought Contingency Officer' : undefined,
        agency: authMode === 'authority' ? 'National Drought Management Authority (NDMA)' : undefined,
      });
      setLoading(false);
      setSuccessMsg('');
    }, 600);
  };

  // Standard Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const displayName = name.trim() || (authMode === 'authority' ? 'Officer ' + (email.split('@')[0] || 'Official') : 'Citizen User');
    const displayEmail = email.trim() || (authMode === 'authority' ? 'authority@ndma.gov' : 'citizen@elnexus.org');
    const displayPhone = mobile.trim() || '+254 700 000 000';

    setSuccessMsg(authMode === 'authority' ? 'Official Credentials Verified • Granting Access...' : 'Account Verified • Session Active...');

    setTimeout(() => {
      loginUser({
        name: displayName,
        email: displayEmail,
        phone: displayPhone,
        role: authMode,
        workOrJob: authMode === 'authority' ? (workJob.trim() || 'Regional Climate Officer') : undefined,
        agency: authMode === 'authority' ? (agency.trim() || 'Ministry of Water & Irrigation') : undefined,
      });
      setLoading(false);
      setSuccessMsg('');
    }, 600);
  };

  // Quick Demo Autofill
  const handleDemoFill = () => {
    if (authMode === 'authority') {
      setName('Eng. David Kiprono');
      setEmail('d.kiprono@water.gov.ke');
      setMobile('+254 722 890 123');
      setWorkJob('Senior Hydrogeologist & Emergency Lead');
      setAgency('National Water Resource Authority');
      setPassword('••••••••••••');
    } else {
      setName('Amina Hassan');
      setEmail('amina.hassan@community.org');
      setMobile('+254 711 456 789');
      setPassword('••••••••••••');
    }
  };

  // If user is already logged in, show authenticated active card
  if (currentUser?.isLoggedIn) {
    return (
      <div className="relative w-full max-w-md mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-forest-mint/40 via-forest-sage/30 to-transparent rounded-3xl blur-xl opacity-70 pointer-events-none" />
        <div className="relative bg-forest-dark/95 backdrop-blur-2xl border border-forest-mint/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-forest-mint/20 border border-forest-mint/40 flex items-center justify-center text-forest-mint">
                {currentUser.role === 'authority' ? <ShieldCheck size={18} /> : <User size={18} />}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-forest-mint block">
                  {currentUser.role === 'authority' ? 'Authorized Clearance Active' : 'Citizen Telemetry Session'}
                </span>
                <span className="text-xs font-semibold text-white/80">Verified Identity</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </div>
          </div>

          <div className="space-y-3.5 mb-6">
            <div className="bg-black/30 rounded-2xl p-4 border border-white/10 space-y-2">
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <span>{currentUser.name}</span>
              </div>
              <div className="text-xs text-white/70 flex items-center gap-2">
                <Mail size={13} className="text-forest-mint shrink-0" />
                <span>{currentUser.email}</span>
              </div>
              {currentUser.phone && (
                <div className="text-xs text-white/70 flex items-center gap-2">
                  <Phone size={13} className="text-forest-mint shrink-0" />
                  <span>{currentUser.phone}</span>
                </div>
              )}
              {currentUser.workOrJob && (
                <div className="text-xs text-white/70 flex items-center gap-2 pt-1 border-t border-white/10">
                  <Briefcase size={13} className="text-forest-mint shrink-0" />
                  <span>{currentUser.workOrJob}</span>
                </div>
              )}
              {currentUser.agency && (
                <div className="text-xs text-white/70 flex items-center gap-2">
                  <Building2 size={13} className="text-forest-mint shrink-0" />
                  <span>{currentUser.agency}</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-forest-mint/15 border border-forest-mint/30 rounded-xl text-xs text-forest-mint flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>Gateway verified • Real-time climate telemetry streaming.</span>
            </div>
          </div>

          <button
            type="button"
            onClick={logoutUser}
            className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all border border-white/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut size={14} />
            <span>Switch Account / Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Subtle outer glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-forest-mint/30 via-forest-sage/20 to-transparent rounded-3xl blur-xl opacity-60 pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative bg-forest-dark/90 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-white overflow-hidden">
        {/* Header Tabs: Citizen vs Authorities Mode */}
        <div className="flex bg-black/30 p-1 rounded-2xl border border-white/10 mb-6">
          <button
            type="button"
            onClick={() => {
              setAuthMode('citizen');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              authMode === 'citizen'
                ? 'bg-forest-mint text-forest-dark shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <User size={15} />
            <span>Citizen Portal</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthMode('authority');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              authMode === 'authority'
                ? 'bg-forest-mint text-forest-dark shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck size={15} />
            <span>Authorities Login</span>
          </button>
        </div>

        {/* Mode Title & Description */}
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white">
              {authMode === 'citizen' 
                ? (isSignUp ? 'Citizen Registration' : 'Citizen Sign In') 
                : (isSignUp ? 'Official Credentials Sign Up' : 'Authorized Personnel Login')}
            </h2>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-[10px] font-bold text-forest-mint hover:underline bg-white/10 px-2 py-0.5 rounded border border-white/10 cursor-pointer"
              title="Autofill with sample credentials"
            >
              Autofill Demo
            </button>
          </div>
          <p className="text-xs text-white/70 mt-1">
            {authMode === 'citizen'
              ? 'Access local drought advisories, submit field observations, and view water stress.'
              : 'Restricted clearance for disaster officers, hydrologists, and ministerial planners.'}
          </p>
        </div>

        {/* Continue with Google Button */}
        <div className="space-y-3 mb-5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 bg-white hover:bg-forest-mint/20 text-nature-text font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer border border-white/20 hover:text-white"
          >
            {/* Google Colorful 'G' Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {authMode === 'authority' ? 'Continue with Government Google SSO' : 'Continue with Google'}
            </span>
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/15" />
            <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Or with email</span>
            <div className="flex-1 h-px bg-white/15" />
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Sign Up Fields: Full Name */}
          {isSignUp && (
            <div>
              <label className="text-[11px] font-bold text-white/80 block mb-1">
                Full Name <span className="text-forest-mint">*</span>
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  required={isSignUp}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={authMode === 'authority' ? 'e.g. Dr. Jane Mwangi' : 'e.g. John Doe'}
                  className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/15 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-forest-mint"
                />
              </div>
            </div>
          )}

          {/* Email / Mail */}
          <div>
            <label className="text-[11px] font-bold text-white/80 block mb-1">
              {authMode === 'authority' ? 'Official / Department Email' : 'Email Address'} <span className="text-forest-mint">*</span>
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={authMode === 'authority' ? 'officer@ndma.gov.ke' : 'you@example.com'}
                className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/15 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-forest-mint"
              />
            </div>
          </div>

          {/* Mobile No (Always for Signup, optional for signin) */}
          {(isSignUp || authMode === 'citizen') && (
            <div>
              <label className="text-[11px] font-bold text-white/80 block mb-1">
                Mobile Number <span className="text-forest-mint">*</span>
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="tel"
                  required={isSignUp}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="+254 700 000 000"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/15 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-forest-mint"
                />
              </div>
            </div>
          )}

          {/* AUTHORITIES ONLY: Work or Job Title */}
          {authMode === 'authority' && (
            <div className="space-y-3 pt-1 border-t border-white/10">
              <div>
                <label className="text-[11px] font-bold text-white/80 block mb-1 flex items-center justify-between">
                  <span>Work or Job Title</span>
                  <span className="text-[10px] text-forest-mint uppercase font-bold tracking-wider">Authorities Field</span>
                </label>
                <div className="relative">
                  <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="text"
                    required={authMode === 'authority'}
                    value={workJob}
                    onChange={(e) => setWorkJob(e.target.value)}
                    placeholder="e.g. Disaster Risk Lead / Hydrologist"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/15 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-forest-mint"
                  />
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="text-[11px] font-bold text-white/80 block mb-1">
                    Agency or Department
                  </label>
                  <div className="relative">
                    <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type="text"
                      value={agency}
                      onChange={(e) => setAgency(e.target.value)}
                      placeholder="e.g. National Drought Management Authority"
                      className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/15 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-forest-mint"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Password */}
          <div>
            <label className="text-[11px] font-bold text-white/80 block mb-1">
              Password <span className="text-forest-mint">*</span>
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/15 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-forest-mint"
              />
            </div>
          </div>

          {/* Success Feedback */}
          {successMsg && (
            <div className="p-3 bg-forest-mint/20 border border-forest-mint/40 rounded-xl text-xs text-forest-mint flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-forest-mint text-forest-dark hover:bg-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-xl shadow-forest-mint/15 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>
                  {isSignUp 
                    ? (authMode === 'authority' ? 'Register Official Profile' : 'Sign Up as Citizen') 
                    : (authMode === 'authority' ? 'Authorize Official Login' : 'Sign In to Platform')}
                </span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Sign In and Sign Up */}
        <div className="pt-4 mt-4 border-t border-white/10 text-center">
          <p className="text-xs text-white/70">
            {isSignUp ? 'Already registered?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setSuccessMsg('');
              }}
              className="text-forest-mint font-bold hover:underline cursor-pointer ml-1"
            >
              {isSignUp ? 'Sign In instead' : 'Sign Up with personal details'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPortalCard;
