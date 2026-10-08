import React from 'react';
import { RiskBand } from '../../types';
import { ShieldAlert, AlertTriangle, AlertCircle, ShieldCheck } from 'lucide-react';

interface ScoreBadgeProps {
  score: number;
  label: string;
  band?: RiskBand;
  size?: 'hero' | 'medium' | 'small';
  showMax?: boolean;
}

export const getRiskBand = (score: number): RiskBand => {
  if (score <= 20) return 'LOW';
  if (score <= 40) return 'GUARDED';
  if (score <= 60) return 'ELEVATED';
  if (score <= 80) return 'HIGH';
  return 'CRITICAL';
};

export const getRiskColor = (band: RiskBand): string => {
  switch (band) {
    case 'LOW':
      return 'var(--risk-low)';
    case 'GUARDED':
      return 'var(--risk-guarded)';
    case 'ELEVATED':
      return 'var(--risk-elevated)';
    case 'HIGH':
      return 'var(--risk-high)';
    case 'CRITICAL':
      return 'var(--risk-critical)';
  }
};

export const getRiskBg = (band: RiskBand): string => {
  switch (band) {
    case 'LOW':
      return 'var(--risk-low-bg)';
    case 'GUARDED':
      return 'var(--risk-guarded-bg)';
    case 'ELEVATED':
      return 'var(--risk-elevated-bg)';
    case 'HIGH':
      return 'var(--risk-high-bg)';
    case 'CRITICAL':
      return 'var(--risk-critical-bg)';
  }
};

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  label,
  band = getRiskBand(score),
  size = 'medium',
  showMax = true,
}) => {
  const riskColor = getRiskColor(band);
  const riskBg = getRiskBg(band);

  const renderIcon = () => {
    switch (band) {
      case 'CRITICAL':
        return <AlertCircle size={13} className="shrink-0" />;
      case 'HIGH':
      case 'ELEVATED':
        return <AlertTriangle size={13} className="shrink-0" />;
      default:
        return <ShieldCheck size={13} className="shrink-0" />;
    }
  };

  if (size === 'hero') {
    return (
      <div className="flex flex-col">
        <div className="flex items-baseline gap-3">
          <span className="font-mono-numbers text-[64px] font-semibold tracking-tight text-[var(--text)] leading-none">
            {score}
          </span>
          {showMax && (
            <span className="font-mono-numbers text-base text-[var(--text-muted)] font-normal">
              / 100
            </span>
          )}
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-[4px] border"
            style={{ color: riskColor, borderColor: riskColor, backgroundColor: riskBg }}
          >
            {renderIcon()}
            <span>{band}</span>
          </span>
        </div>
        <span className="text-xs font-medium text-[var(--text-muted)] mt-2">
          {label}
        </span>
      </div>
    );
  }

  if (size === 'small') {
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono-numbers text-base font-semibold text-[var(--text)]">
          {score}
        </span>
        <span
          className="inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-[3px] border"
          style={{ color: riskColor, borderColor: riskColor, backgroundColor: riskBg }}
        >
          {band}
        </span>
        <span className="text-xs text-[var(--text-muted)]">
          {label}
        </span>
      </div>
    );
  }

  // Medium (default)
  return (
    <div className="flex flex-col border border-[var(--border)] p-3.5 rounded-[6px] bg-[var(--surface)]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-[var(--text-muted)]">
          {label}
        </span>
        <span
          className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-[4px] border"
          style={{ color: riskColor, borderColor: riskColor, backgroundColor: riskBg }}
        >
          {renderIcon()}
          <span>{band}</span>
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono-numbers text-2xl font-semibold text-[var(--text)]">
          {score}
        </span>
        {showMax && (
          <span className="font-mono-numbers text-xs text-[var(--text-muted)]">
            / 100
          </span>
        )}
      </div>
    </div>
  );
};
