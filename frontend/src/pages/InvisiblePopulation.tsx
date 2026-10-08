import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { InvisiblePopulationView } from '../components/intelligence/InvisiblePopulationView';
import { InvisiblePopulationData } from '../types';
import { LoadingState, ErrorState } from '../components/common/StateViews';
import { DataMetadataFooter } from '../components/common/DataMetadataFooter';
import { DEMO_REGIONS } from '../data/demoData';
import { Eye, MapPin, AlertCircle, ShieldCheck } from 'lucide-react';

export const InvisiblePopulationPage: React.FC = () => {
  const { selectedRegionId, setSelectedRegionId, getProvider } = useAppStore();
  const [data, setData] = useState<InvisiblePopulationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const provider = getProvider();

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const res = await provider.getInvisiblePopulation(selectedRegionId);
        if (isMounted) {
          if (res.success && res.data) {
            setData(res.data);
          } else {
            setError(res.error?.message || 'Failed to calculate invisible population scores.');
          }
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Error communicating with invisible population engine.');
          setLoading(false);
        }
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [selectedRegionId, provider]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            <span>Hidden Vulnerability Intelligence</span>
            <span>•</span>
            <span className="text-[var(--brand)]">Adaptive Capacity Deficit Engine</span>
          </div>
          <h1 className="text-xl font-semibold text-[var(--text)] mt-1 flex items-center gap-2">
            <Eye size={22} className="text-[var(--brand)]" />
            Invisible Population Detection
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Identify underserved, high-exposure communities that conventional hazard models overlook due to raw population density biases and missing adaptive infrastructure metrics.
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

      {/* Ethical Guardrail Disclaimer */}
      <div className="p-3 rounded-[4px] bg-[var(--surface-2)] border border-[var(--border)] flex items-start gap-2.5 text-xs text-[var(--text-muted)]">
        <AlertCircle size={15} className="text-[var(--brand)] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[var(--text)]">Estimated Vulnerable Population:</strong> Modelled estimates represent statistical cluster aggregates based on occupational exposure, building materials, and hydration deficits. They never identify individual persons and should be utilized for municipal resource targeting.
        </div>
      </div>

      {loading && <LoadingState message="Analyzing spatial adaptive capacity & labor density..." />}
      {error && <ErrorState message={error} />}

      {!loading && !error && data && (
        <InvisiblePopulationView data={data} />
      )}

      <DataMetadataFooter
        source="Census Microdata • CMWSSB Tanker Roster • Open-Meteo • Informal Workforce Survey"
        confidence="moderate"
        model="CLIMA-INVISIBLE-POP-v2.1"
      />
    </div>
  );
};
