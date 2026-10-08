import React from 'react';
import { useAppStore } from '../store/appStore';
import { UserRole } from '../types';
import { Settings as SettingsIcon, Database, RefreshCw, Sun, Moon, Laptop, Globe } from 'lucide-react';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { t } from '../i18n/translations';

export const Settings: React.FC = () => {
  const {
    theme,
    setTheme,
    userRole,
    setUserRole,
    isDemoMode,
    setDemoMode,
    resetDemoData,
    checkBackendHealth,
    dataSourceLabel,
    modelVersion,
    lastHealthCheck,
    demoReason,
  } = useAppStore();

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand)] font-mono-numbers">
          <SettingsIcon size={16} />
          <span>SYSTEM CONFIGURATION & TELEMETRY</span>
        </div>
        <h1 className="text-2xl font-semibold text-[var(--text)] mt-1">
          Platform Settings
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Manage operational roles, data telemetry providers, and application appearance.
        </p>
      </div>

      {/* Telemetry & Demo Mode Card */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 font-semibold text-sm text-[var(--text)]">
            <Database size={16} className={isDemoMode ? 'text-[var(--drought)]' : 'text-[var(--brand)]'} />
            <span>Data Provider & Backend Connection</span>
          </div>
          <span
            className={`text-[10px] font-mono-numbers font-semibold px-2 py-0.5 rounded uppercase ${
              isDemoMode ? 'bg-[var(--border)] text-[var(--text-muted)]' : 'bg-[var(--brand-subtle)] text-[var(--brand)]'
            }`}
          >
            {isDemoMode ? 'DEMO DATA ACTIVE' : 'LIVE API ACTIVE'}
          </span>
        </div>

        <div className="space-y-3 font-mono-numbers text-xs">
          <div className="flex justify-between py-1 border-b border-[var(--border)]">
            <span className="text-[var(--text-muted)]">Source Label:</span>
            <span className="font-semibold text-[var(--text)]">{dataSourceLabel}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[var(--border)]">
            <span className="text-[var(--text-muted)]">Model Pipeline:</span>
            <span className="font-semibold text-[var(--text)]">{modelVersion}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[var(--border)]">
            <span className="text-[var(--text-muted)]">Last Verified:</span>
            <span className="font-semibold text-[var(--text)]">{lastHealthCheck || 'Never'}</span>
          </div>
          {demoReason && (
            <div className="p-3 rounded bg-[var(--surface-2)] text-[11px] text-[var(--text-muted)] font-sans border border-[var(--border)]">
              <strong>Notice:</strong> {demoReason}
            </div>
          )}
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => checkBackendHealth()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-[4px] text-xs font-medium border border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text)] cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Ping Backend API</span>
          </button>
          <button
            onClick={() => setDemoMode(!isDemoMode, isDemoMode ? 'Switched to live backend' : 'Switched to demo mode')}
            className="px-3 py-2 rounded-[4px] text-xs font-medium border border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text)] cursor-pointer"
          >
            Toggle {isDemoMode ? 'Live Mode' : 'Demo Mode'}
          </button>
          <button
            onClick={resetDemoData}
            className="px-3 py-2 rounded-[4px] text-xs font-medium border border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
          >
            Reset Demo Baseline Data
          </button>
        </div>
      </div>

      {/* Role Switcher Card */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text)] pb-2 border-b border-[var(--border)]">
          Active Operational Role
        </h3>
        <p className="text-xs text-[var(--text-muted)]">
          Controls navigation visibility and access permissions across command and citizen views.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono-numbers">
          {(['Government', 'Citizen', 'Farmer', 'Healthcare'] as UserRole[]).map((role) => (
            <button
              key={role}
              onClick={() => setUserRole(role)}
              className={`p-3 rounded-[4px] border text-center cursor-pointer transition-all ${
                userRole === role
                  ? 'border-[var(--brand)] bg-[var(--brand-subtle)] text-[var(--brand)] font-bold'
                  : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--surface)]'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Language Localization Card */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] p-5 space-y-4">
        <div className="flex items-center gap-2 font-semibold text-sm text-[var(--text)] pb-2 border-b border-[var(--border)]">
          <Globe size={16} className="text-[var(--brand)]" />
          <span>Regional Language & Localization / மொழி / भाषा</span>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          Select your preferred interface language. Clima-Shield supports 6 regional languages across all dashboards, alerts, and spatial decision consoles.
        </p>
        <LanguageSelector variant="pills" showRegion={true} />
      </div>

      {/* Theme Card */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text)] pb-2 border-b border-[var(--border)]">
          Interface Appearance
        </h3>
        <div className="grid grid-cols-3 gap-3 text-xs font-mono-numbers">
          <button
            onClick={() => setTheme('light')}
            className={`p-3 rounded-[4px] border flex items-center justify-center gap-2 cursor-pointer ${
              theme === 'light' ? 'border-[var(--brand)] bg-[var(--brand-subtle)] text-[var(--brand)] font-bold' : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)]'
            }`}
          >
            <Sun size={15} /> Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-[4px] border flex items-center justify-center gap-2 cursor-pointer ${
              theme === 'dark' ? 'border-[var(--brand)] bg-[var(--brand-subtle)] text-[var(--brand)] font-bold' : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)]'
            }`}
          >
            <Moon size={15} /> Dark (Default)
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`p-3 rounded-[4px] border flex items-center justify-center gap-2 cursor-pointer ${
              theme === 'system' ? 'border-[var(--brand)] bg-[var(--brand-subtle)] text-[var(--brand)] font-bold' : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)]'
            }`}
          >
            <Laptop size={15} /> System
          </button>
        </div>
      </div>
    </div>
  );
};
