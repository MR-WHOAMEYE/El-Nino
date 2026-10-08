import React from 'react';
import { useAppStore } from '../../store/appStore';
import { ConfidenceLevel } from '../../types';

interface DataMetadataFooterProps {
  source?: string;
  model?: string;
  updated?: string;
  confidence?: ConfidenceLevel;
  statusLabel?: string;
}

export const DataMetadataFooter: React.FC<DataMetadataFooterProps> = ({
  source,
  model,
  updated = '08 Oct 2026',
  confidence = 'moderate',
  statusLabel,
}) => {
  const { isDemoMode, dataSourceLabel, modelVersion } = useAppStore();

  const finalSource = source || (isDemoMode ? 'CS-DEMO-SYNTH' : dataSourceLabel);
  const finalModel = model || modelVersion;
  const finalStatus = statusLabel || (isDemoMode ? 'DEMO DATA' : 'LIVE TELEMETRY');

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 pb-1 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)] mt-4 font-mono-numbers">
      <div className="flex items-center gap-3 flex-wrap">
        <span>
          <span className="text-[var(--text-muted)] opacity-70 uppercase tracking-wider text-[10px]">Source:</span>{' '}
          <span className="text-[var(--text)] font-medium">{finalSource}</span>
        </span>
        <span className="opacity-40">•</span>
        <span>
          <span className="text-[var(--text-muted)] opacity-70 uppercase tracking-wider text-[10px]">Model:</span>{' '}
          <span className="text-[var(--text)] font-medium">{finalModel}</span>
        </span>
        <span className="opacity-40">•</span>
        <span>
          <span className="text-[var(--text-muted)] opacity-70 uppercase tracking-wider text-[10px]">Updated:</span>{' '}
          <span className="text-[var(--text)] font-medium">{updated}</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span>
          <span className="text-[var(--text-muted)] opacity-70 uppercase tracking-wider text-[10px]">Confidence:</span>{' '}
          <span className="text-[var(--text)] uppercase font-semibold">{confidence}</span>
        </span>
        <span className="opacity-40">•</span>
        <span
          className={`px-1.5 py-0.2 rounded-[3px] text-[10px] font-semibold tracking-wider uppercase ${
            isDemoMode
              ? 'bg-[var(--border)] text-[var(--text-muted)]'
              : 'bg-[var(--brand-subtle)] text-[var(--brand)]'
          }`}
        >
          {finalStatus}
        </span>
      </div>
    </div>
  );
};
