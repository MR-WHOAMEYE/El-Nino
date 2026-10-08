import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { UserRole } from '../types';
import { ShieldCheck, Flame, ArrowRight, Globe, Lock, Phone } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserRole, language, setLanguage, setDemoMode } = useAppStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>('Government');
  const [phoneOtp, setPhoneOtp] = useState('');

  const handleEnterPlatform = (role: UserRole) => {
    setUserRole(role);
    setDemoMode(true, 'Demo account active for interactive review');
    if (role === 'Citizen') {
      navigate('/citizen');
    } else if (role === 'Healthcare') {
      navigate('/healthcare');
    } else if (role === 'Farmer') {
      navigate('/agriculture');
    } else {
      navigate('/command-center');
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-[var(--bg)] text-[var(--text)]">
      {/* Left Form: Role-Based Entry */}
      <div className="lg:col-span-5 p-8 lg:p-14 flex flex-col justify-between bg-[var(--surface)] border-r border-[var(--border)]">
        <div>
          {/* Header & Language Toggle */}
          <div className="flex items-center justify-between pb-6 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--brand)]" />
              <span className="font-semibold text-xs tracking-wider uppercase text-[var(--text)]">
                CLIMA-SHIELD
              </span>
            </div>

            <button
              onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-[var(--border)] text-xs font-medium cursor-pointer hover:border-[var(--brand)] transition-colors"
            >
              <Globe size={13} className="text-[var(--brand)]" />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
          </div>

          <div className="mt-8 space-y-2">
            <h1 className="text-2xl font-bold text-[var(--text)]">
              {language === 'en' ? 'Sign in to Operational Platform' : 'செயல்பாட்டு தளத்தில் நுழையுங்கள்'}
            </h1>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {language === 'en'
                ? 'Select your operational authorization to enter Chennai climate resilience decision services.'
                : 'சென்னை காலநிலை பின்னடைவு முடிவெடுக்கும் தளத்திற்குள் நுழைய உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்.'}
            </p>
          </div>

          {/* Role-Based Quick Entry Options */}
          <div className="mt-6 space-y-3">
            {[
              {
                role: 'Government' as UserRole,
                title: 'Ward Officer / Municipal Disaster Management',
                desc: 'Access Command Center, Scenario Lab, and Resource Optimization.',
              },
              {
                role: 'Healthcare' as UserRole,
                title: 'Health Department & Hospital Surge',
                desc: 'Monitor heat stroke ward capacity, ORS reserves, and wet-bulb triage.',
              },
              {
                role: 'Farmer' as UserRole,
                title: 'Agricultural Extension & Irrigation',
                desc: 'Soil moisture deficits, dry-period rainfall anomalies, and crop alerts.',
              },
              {
                role: 'Citizen' as UserRole,
                title: 'Citizen View (Mobile-First / OTP)',
                desc: 'Localized drinking water status, nearest cooling center, and Tamil advisories.',
              },
            ].map((item) => (
              <div
                key={item.role}
                onClick={() => setSelectedRole(item.role)}
                className={`p-3.5 rounded-[5px] border cursor-pointer transition-all ${
                  selectedRole === item.role
                    ? 'border-[var(--brand)] bg-[var(--surface-raised)] ring-1 ring-[var(--brand)]'
                    : 'border-[var(--border)] hover:bg-[var(--surface-raised)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text)]">{item.title}</span>
                  {selectedRole === item.role && (
                    <span className="w-2 h-2 rounded-full bg-[var(--brand)]" />
                  )}
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Citizen Phone OTP entry input if Citizen role is selected */}
          {selectedRole === 'Citizen' && (
            <div className="mt-4 p-3 rounded-[4px] bg-[var(--surface-raised)] border border-[var(--border)] space-y-2">
              <label className="text-xs text-[var(--text-muted)] block font-mono-numbers">
                ENTER MOBILE NUMBER (DEMO OTP SIMULATED):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="+91 98400 12345"
                  value={phoneOtp}
                  onChange={(e) => setPhoneOtp(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-mono-numbers focus:outline-none focus:border-[var(--brand)]"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 space-y-2.5">
            <button
              onClick={() => handleEnterPlatform(selectedRole)}
              className="w-full py-2.5 px-4 rounded-[4px] text-xs font-semibold bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>{language === 'en' ? `Enter as ${selectedRole}` : `${selectedRole} ஆக நுழையவும்`}</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => handleEnterPlatform('Government')}
              className="w-full py-2 px-4 rounded-[4px] text-xs font-medium border border-[var(--border)] bg-[var(--surface-raised)] hover:bg-[var(--border)] text-[var(--text)] cursor-pointer transition-colors text-center"
            >
              Continue in Demonstration Mode
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-[var(--border)] text-[11px] font-mono-numbers text-[var(--text-muted)] flex justify-between items-center">
          <span>NOAA ENSO + IMD CHENNAI FEED</span>
          <span>SECURE TELEMETRY</span>
        </div>
      </div>

      {/* Right: Live Drifting Geospatial Map with Real Verified Stat */}
      <div className="hidden lg:col-span-7 lg:flex flex-col justify-between p-12 relative overflow-hidden bg-[var(--surface-raised)]">
        {/* Spatial Grid Lines */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#5A6B7A_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Top Status Stat */}
        <div className="relative z-10 flex justify-between items-center font-mono-numbers text-xs text-[var(--text-muted)] bg-[var(--surface)]/90 backdrop-blur-sm p-3 rounded-[4px] border border-[var(--border)]">
          <span>TAMIL NADU COASTAL MONITORING ZONE</span>
          <span>13.0827°N, 80.2707°E</span>
        </div>

        {/* Center Live Pulsing Emerging Hotspot Stat Card */}
        <div className="relative z-10 max-w-md mx-auto p-6 rounded-[6px] bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--critical)] shadow-2xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-[var(--critical)] animate-hotspot" />
            <div>
              <span className="text-[10px] font-mono-numbers font-bold text-[var(--critical)] uppercase tracking-wider block">
                VERIFIED GROUND CONVERGENCE
              </span>
              <h3 className="text-base font-bold text-[var(--text)]">North Chennai Hotspot</h3>
            </div>
          </div>

          <div className="p-3 rounded bg-[var(--surface-raised)] border border-[var(--border)] font-mono-numbers text-xs space-y-1">
            <div className="text-2xl font-bold text-[var(--text)]">47 Reports</div>
            <div className="text-[11px] text-[var(--text-muted)]">Verified in Vyasarpadi & Tondiarpet during the last 6 hours</div>
          </div>

          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Severe drinking water tanker delays compound ambient wet-bulb temperatures exceeding 31.5°C in dense informal wards.
          </p>
        </div>

        {/* Bottom Legend */}
        <div className="relative z-10 flex justify-between items-center font-mono-numbers text-[11px] text-[var(--text-muted)] bg-[var(--surface)]/90 backdrop-blur-sm p-3 rounded-[4px] border border-[var(--border)]">
          <span>CARTO DARK MATTER BASEMAP</span>
          <span>REAL-TIME HOTSPOT EVALUATION ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
