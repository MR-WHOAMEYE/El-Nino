import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { ResilienceLedgerView } from '../components/intelligence/ResilienceLedgerView';
import { ResilienceLedgerEntry } from '../types';
import { LoadingState, ErrorState } from '../components/common/StateViews';
import { DataMetadataFooter } from '../components/common/DataMetadataFooter';
import { DEMO_REGIONS } from '../data/demoData';
import { Activity, MapPin, AlertCircle } from 'lucide-react';

export const ResilienceLedgerPage: React.FC = () => {
  const { selectedRegionId, setSelectedRegionId, getProvider } = useAppStore();
  const [entries, setEntries] = useState<ResilienceLedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const provider = getProvider();

  useEffect(() => {
    let isMounted = true;
    async function loadLedger() {
      try {
        setLoading(true);
        setError(null);
        const res = await provider.getResilienceLedger(selectedRegionId);
        if (isMounted) {
          if (res.success && res.data) {
            setEntries(res.data);
          } else {
            setError(res.error?.message || 'Failed to retrieve resilience ledger audits.');
          }
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Error communicating with resilience ledger service.');
          setLoading(false);
        }
      }
    }

    loadLedger();
    return () => { isMounted = false; };
  }, [selectedRegionId, provider]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            <span>Intervention Tracking</span>
            <span>•</span>
            <span className="text-[var(--brand)]">Outcome Accounting Ledger</span>
          </div>
          <h1 className="text-xl font-semibold text-[var(--text)] mt-1 flex items-center gap-2">
            <Activity size={22} className="text-[var(--brand)]" />
            Resilience Outcome Ledger
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Track before-and-after resilience shifts for climate adaptation investments across Chennai municipal wards with empirical attribution validation.
          </p>
        </div>

        {/* Region selector */}
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-[var(--text-muted)]" />
          <select
            value={selectedRegionId}
            onChange={(e) => setSelectedRegionId(e.target.value)}
            className="px-2.5 py-1.5 rounded-[4px] bg-[var(--surface-2)] border border-[var(--border)] text-xs text-[var(--text)] font-medium focus:outline-none focus:border-[var(--brand)]"
          >
            {Object.values(DEMO_REGIONS).map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Disclaimers */}
      <div className="p-3 rounded-[4px] bg-[var(--surface-2)] border border-[var(--border)] flex items-start gap-2.5 text-xs text-[var(--text-muted)]">
        <AlertCircle size={15} className="text-[var(--brand)] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[var(--text)]">Causal Attribution Standard:</strong> Changes are denoted as "Observed change" only when corroborated by post-audit field records and hospital admission telemetry; otherwise flagged as "Modelled change".
        </div>
      </div>

      {loading && <LoadingState message="Loading longitudinal outcome ledgers..." />}
      {error && <ErrorState message={error} />}

      {!loading && !error && (
        <ResilienceLedgerView entries={entries} />
      )}

      <DataMetadataFooter
        source="TNCCCR Municipal Resilience Audit • CMWSSB Operations Log • DHS Primary Health"
        confidence="high"
        model="CLIMA-LEDGER-v1.3"
      />
    </div>
  );
};
