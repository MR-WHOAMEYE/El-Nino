import React from 'react';
import { useAppStore } from '../../store/appStore';
import { Database, CheckCircle, RefreshCw, AlertTriangle, X } from 'lucide-react';

export const DataModePopover: React.FC = () => {
  const {
    isDemoMode,
    demoReason,
    dataSourceLabel,
    modelVersion,
    lastHealthCheck,
    setDemoMode,
    resetDemoData,
    checkBackendHealth,
    dataPopoverOpen,
    setDataPopoverOpen,
  } = useAppStore();

  if (!dataPopoverOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-18 sm:pr-8 bg-black/40">
      <div
        className="w-full max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-[6px] shadow-lg p-5 text-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Database size={16} className={isDemoMode ? 'text-[var(--drought)]' : 'text-[var(--brand)]'} />
            <h3 className="font-semibold text-xs tracking-wider uppercase text-[var(--text)]">
              Telemetry & Data Mode
            </h3>
          </div>
          <button
            onClick={() => setDataPopoverOpen(false)}
            className="text-[var(--text-muted)] hover:text-[var(--text)] p-1 rounded-[4px]"
            aria-label="Close data mode popover"
          >
            <X size={15} />
          </button>
        </div>

        <div className="py-4 space-y-3 font-mono-numbers text-xs">
          <div className="flex justify-between items-center">
            <span className="text-[var(--text-muted)]">Active Provider:</span>
            <span
              className={`font-semibold px-2 py-0.5 rounded-[3px] uppercase ${
                isDemoMode
                  ? 'bg-[var(--border)] text-[var(--text)]'
                  : 'bg-[var(--brand-subtle)] text-[var(--brand)]'
              }`}
            >
              {isDemoMode ? 'Demo Data Provider' : 'Live Backend Engine'}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Data Source:</span>
            <span className="font-medium text-[var(--text)] text-right">{dataSourceLabel}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Model Version:</span>
            <span className="font-medium text-[var(--text)]">{modelVersion}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Last Verified:</span>
            <span className="font-medium text-[var(--text)]">
              {lastHealthCheck ? new Date(lastHealthCheck).toLocaleTimeString() : 'N/A'}
            </span>
          </div>

          {demoReason && (
            <div className="p-2.5 rounded-[4px] bg-[var(--surface-2)] border border-[var(--border)] text-[11px] text-[var(--text-muted)] font-sans">
              <div className="flex items-center gap-1.5 font-semibold text-[var(--text)] mb-1">
                <AlertTriangle size={13} className="text-[var(--drought)]" />
                <span>Provider Note:</span>
              </div>
              {demoReason}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[var(--border)] space-y-2">
          <div className="flex gap-2">
            <button
              onClick={async () => {
                const healthy = await checkBackendHealth();
                if (healthy) {
                  setDataPopoverOpen(false);
                }
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-[4px] text-xs font-medium border border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text)] cursor-pointer"
            >
              <RefreshCw size={13} />
              Ping Live API
            </button>
            <button
              onClick={() => {
                setDemoMode(!isDemoMode, isDemoMode ? 'Switched to live backend connection' : 'User manually switched to demo dataset');
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-[4px] text-xs font-medium border border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text)] cursor-pointer"
            >
              <CheckCircle size={13} />
              Toggle {isDemoMode ? 'Live' : 'Demo'}
            </button>
          </div>
          <button
            onClick={() => {
              resetDemoData();
              setDataPopoverOpen(false);
            }}
            className="w-full py-1.5 px-3 rounded-[4px] text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)] border border-transparent hover:border-[var(--border)] text-center cursor-pointer"
          >
            Reset Demo Data to Baseline
          </button>
        </div>
      </div>
    </div>
  );
};
