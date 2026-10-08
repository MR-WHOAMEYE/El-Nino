import React from 'react';
import { AlertCircle, RefreshCw, Database } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Calculating climate intelligence...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-[var(--border)] rounded-[6px] bg-[var(--surface)] my-4">
      <div className="w-8 h-8 border-2 border-[var(--border)] border-t-[var(--brand)] rounded-full animate-spin mb-4" />
      <p className="text-sm font-medium text-[var(--text)]">{message}</p>
      <span className="text-xs text-[var(--text-muted)] mt-1 font-mono-numbers">
        Processing environmental spatial parameters...
      </span>
    </div>
  );
};

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Climate intelligence service unavailable.',
  message = 'Unable to connect to the backend spatial processing service. You can retry or switch to the deterministic demo provider.',
  onRetry,
}) => {
  const { setDemoMode } = useAppStore();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-[var(--critical)]/40 rounded-[6px] bg-[var(--surface)] my-4">
      <div className="w-10 h-10 rounded-[4px] bg-[var(--critical)]/10 text-[var(--critical)] flex items-center justify-center mb-3">
        <AlertCircle size={20} />
      </div>
      <h3 className="text-sm font-semibold text-[var(--text)] mb-1">{title}</h3>
      <p className="text-xs text-[var(--text-muted)] max-w-md mb-5">{message}</p>
      <div className="flex items-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--border)] cursor-pointer transition-colors"
          >
            <RefreshCw size={14} />
            Retry Connection
          </button>
        )}
        <button
          onClick={() => setDemoMode(true, 'User manually enabled demo provider.')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] cursor-pointer transition-colors"
        >
          <Database size={14} />
          Use Demo Data
        </button>
      </div>
    </div>
  );
};

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No climate observation data recorded',
  description = 'No observations matching the current filter criteria were returned from the climate registry.',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center border border-[var(--border)] rounded-[6px] bg-[var(--surface)] my-4">
      <div className="w-9 h-9 rounded-[4px] border border-[var(--border)] text-[var(--text-muted)] flex items-center justify-center mb-3">
        <Database size={16} />
      </div>
      <h4 className="text-xs font-semibold tracking-wide text-[var(--text)] uppercase">{title}</h4>
      <p className="text-xs text-[var(--text-muted)] max-w-sm mt-1">{description}</p>
    </div>
  );
};
