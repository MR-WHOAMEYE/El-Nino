import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { DEMO_REGIONS } from '../../data/demoData';
import { Search, Sun, Moon, Laptop, ChevronDown, Activity, Globe } from 'lucide-react';

export const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const {
    theme,
    setTheme,
    isDemoMode,
    setDataPopoverOpen,
    setCommandPaletteOpen,
    selectedRegionId,
    setSelectedRegionId,
    language,
    setLanguage,
  } = useAppStore();

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegionId(e.target.value);
  };

  return (
    <header className="h-[52px] w-full bg-[var(--surface)] border-b border-[var(--border)] px-4 flex items-center justify-between gap-3 shrink-0 z-30 select-none">
      {/* Left: Brand Wordmark + Location Dropdown */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => navigate('/command-center')}
          className="flex items-center gap-2 cursor-pointer focus:outline-none group"
        >
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--brand)] shrink-0 transition-transform group-hover:scale-110" />
          <span className="font-semibold text-xs tracking-wider uppercase text-[var(--text)] whitespace-nowrap">
            CLIMA-SHIELD
          </span>
        </button>

        <span className="text-[var(--border)] font-thin hidden sm:inline">|</span>

        {/* Location Selector Dropdown */}
        <div className="relative flex items-center">
          <select
            value={selectedRegionId}
            onChange={handleRegionChange}
            aria-label="Select location"
            className="appearance-none bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[var(--brand)] text-[var(--text)] text-xs font-medium py-1.5 pl-3 pr-7 rounded-full cursor-pointer focus:outline-none transition-colors"
          >
            {Object.values(DEMO_REGIONS).map((reg) => (
              <option key={reg.id} value={reg.id}>
                {reg.name}
              </option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-2.5 text-[var(--text-muted)] pointer-events-none" />
        </div>
      </div>

      {/* Center: Clean ENSO Status Pill */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] text-xs font-mono-numbers">
        <span className="w-2 h-2 rounded-full bg-[var(--heat)] animate-pulse" />
        <span className="font-medium text-[var(--text)]">El Niño</span>
        <span className="text-[var(--text-muted)]">•</span>
        <span className="text-[var(--text-muted)]">Moderate</span>
        <span className="text-[var(--heat)] font-semibold">↑ Strengthening</span>
        <span className="text-[11px] text-[var(--text-muted)] hidden lg:inline">(+1.4°C)</span>
      </div>

      {/* Right Controls: Demo Tag, Search, Language, Theme */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Telemetry Data Mode Tag */}
        <button
          onClick={() => setDataPopoverOpen(true)}
          className={`h-7 px-2.5 rounded-full border font-mono-numbers text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1.5 cursor-pointer transition-colors ${
            isDemoMode
              ? 'border-[var(--drought)]/60 bg-[var(--surface-raised)] text-[var(--drought)] hover:bg-[var(--surface)]'
              : 'border-[var(--brand)]/60 bg-[var(--brand-subtle)] text-[var(--brand)] hover:opacity-90'
          }`}
          title="Click to inspect data telemetry or reset demo mode"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isDemoMode ? 'bg-[var(--drought)]' : 'bg-[var(--brand)]'}`} />
          <span>{isDemoMode ? 'Demo Data' : 'Live'}</span>
        </button>

        {/* Global Command Palette (Ctrl+K) */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-1.5 h-7 px-2.5 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] text-xs text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--brand)] cursor-pointer transition-colors"
          title="Search regions, operations or switch roles (Ctrl+K)"
        >
          <Search size={13} />
          <kbd className="text-[10px] font-mono-numbers px-1 rounded-full bg-[var(--surface)] border border-[var(--border)]">
            ⌘K
          </kbd>
        </button>

        {/* English / Tamil Toggle */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
          className="h-7 px-2.5 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] hover:border-[var(--brand)] text-xs font-medium text-[var(--text)] flex items-center gap-1 cursor-pointer transition-colors"
          title="Toggle Language (English / தமிழ்)"
        >
          <Globe size={12} className="text-[var(--brand)]" />
          <span className="font-semibold text-[11px]">{language === 'en' ? 'தமிழ்' : 'EN'}</span>
        </button>

        {/* Theme Toggle */}
        <div className="flex items-center border border-[var(--border)] rounded-full bg-[var(--surface-raised)] h-7 p-0.5">
          <button
            onClick={() => setTheme('light')}
            className={`p-1 rounded-full text-xs transition-colors cursor-pointer ${
              theme === 'light' ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
            title="Light mode"
          >
            <Sun size={13} />
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-1 rounded-full text-xs transition-colors cursor-pointer ${
              theme === 'dark' ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
            title="Dark mode"
          >
            <Moon size={13} />
          </button>
          <button
            onClick={() => setTheme('system')}
            className={`p-1 rounded-full text-xs transition-colors cursor-pointer ${
              theme === 'system' ? 'bg-[var(--surface)] text-[var(--text)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
            title="System theme"
          >
            <Laptop size={13} />
          </button>
        </div>
      </div>
    </header>
  );
};
