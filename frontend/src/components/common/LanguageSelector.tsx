import React from 'react';
import { useAppStore, SupportedLanguage } from '../../store/appStore';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'pills' | 'dropdown' | 'compact';
  showRegion?: boolean;
}

const LANGUAGES: { code: SupportedLanguage; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'pills',
}) => {
  const { language, setLanguage } = useAppStore();

  if (variant === 'dropdown') {
    return (
      <div className="relative inline-flex items-center">
        <Globe size={13} className="absolute left-2.5 text-[var(--text-muted)] pointer-events-none" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
          aria-label="Select language"
          className="appearance-none bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[var(--brand)] text-[var(--text)] text-xs font-medium py-1.5 pl-8 pr-7 rounded-full cursor-pointer focus:outline-none transition-colors"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.native} ({l.label})
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
      {LANGUAGES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLanguage(l.code)}
          className={`p-3 rounded-[4px] border text-center cursor-pointer transition-all ${
            language === l.code
              ? 'border-[var(--brand)] bg-[var(--brand-subtle)] text-[var(--brand)] font-bold shadow-xs'
              : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--surface)]'
          }`}
        >
          <div className="text-sm font-semibold">{l.native}</div>
          <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{l.label}</div>
        </button>
      ))}
    </div>
  );
};
