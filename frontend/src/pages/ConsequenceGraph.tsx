import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { ClimateConsequenceGraph } from '../components/intelligence/ClimateConsequenceGraph';
import { ConsequenceGraphData } from '../types';
import { LoadingState, ErrorState } from '../components/common/StateViews';
import { DataMetadataFooter } from '../components/common/DataMetadataFooter';
import { DEMO_REGIONS } from '../data/demoData';
import { Network, MapPin, Sparkles, AlertCircle } from 'lucide-react';

export const ConsequenceGraphPage: React.FC = () => {
  const { selectedRegionId, setSelectedRegionId, getProvider } = useAppStore();
  const [data, setData] = useState<ConsequenceGraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const provider = getProvider();

  useEffect(() => {
    let isMounted = true;
    async function loadGraph() {
      try {
        setLoading(true);
        setError(null);
        const res = await provider.getConsequenceGraph(selectedRegionId);
        if (isMounted) {
          if (res.success && res.data) {
            setData(res.data);
          } else {
            setError(res.error?.message || 'Failed to load consequence graph.');
          }
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Error communicating with consequence engine.');
          setLoading(false);
        }
      }
    }

    loadGraph();
    return () => { isMounted = false; };
  }, [selectedRegionId, provider]);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            <span>Climate Consequence Intelligence</span>
            <span>•</span>
            <span className="text-[var(--brand)]">Causal Cascade Modeling</span>
          </div>
          <h1 className="text-xl font-semibold text-[var(--text)] mt-1 flex items-center gap-2">
            <Network size={22} className="text-[var(--brand)]" />
            Climate Consequence Graph
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Model how primary ENSO and extreme heat anomalies propagate through municipal grid, water distribution, and socio-economic systems into community public health impacts.
          </p>
        </div>

        {/* Region selector switch */}
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

      {/* Modelled scientific disclosure */}
      <div className="p-3 rounded-[4px] bg-[var(--surface-2)] border border-[var(--border)] flex items-start gap-2.5 text-xs text-[var(--text-muted)]">
        <AlertCircle size={15} className="text-[var(--brand)] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[var(--text)]">Modelled Causal Estimate:</strong> Causal edges represent coupled physical-infrastructural dependencies derived from hydrological telemetry, sub-station SCADA loads, and municipal health admissions. They are not direct deterministic prophecies.
        </div>
      </div>

      {loading && <LoadingState message="Calculating causal consequence pathways..." />}
      {error && <ErrorState message={error} />}

      {!loading && !error && data && (
        <ClimateConsequenceGraph data={data} />
      )}

      <DataMetadataFooter
        source="Open-Meteo • CMWSSB Pumping SCADA • TANGEDCO • TN DHS Health Registry"
        confidence="high"
        model="CLIMA-CONSEQUENCE-v1.8"
      />
    </div>
  );
};
