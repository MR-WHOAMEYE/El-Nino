import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { EquityPriority } from '../types';
import { DataMetadataFooter } from '../components/common/DataMetadataFooter';
import { LoadingState } from '../components/common/StateViews';
import { ListOrdered, SlidersHorizontal, Coins, ArrowRight, MapPin } from 'lucide-react';

export const EquityPriorities: React.FC = () => {
  const navigate = useNavigate();
  const { getProvider, setSelectedRegionId } = useAppStore();
  const [priorities, setPriorities] = useState<EquityPriority[]>([]);
  const [rankingMode, setRankingMode] = useState<'equity' | 'risk_only'>('equity');
  const [loading, setLoading] = useState(true);

  const provider = getProvider();

  useEffect(() => {
    let isMounted = true;
    async function fetchEquity() {
      try {
        setLoading(true);
        const res = await provider.getEquityPriorities();
        if (isMounted && res.success) {
          setPriorities(res.data);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchEquity();
    return () => { isMounted = false; };
  }, [provider]);

  if (loading) {
    return <LoadingState message="Calculating climate equity rankings and priority indices..." />;
  }

  // Sort based on toggle mode
  const displayedList = [...priorities].sort((a, b) => {
    if (rankingMode === 'risk_only') {
      return b.risk - a.risk; // Pure hazard risk ranking
    }
    return a.rank - b.rank; // Equity-weighted ranking
  });

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand)] font-mono-numbers">
              <ListOrdered size={15} />
              <span>DECISION-SUPPORT PRIORITIZATION</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text)] mt-1">
              Climate Equity Priority Ranking
            </h1>
            <p className="text-xs text-[var(--text-muted)] mt-1 max-w-2xl">
              Target municipal resources directly to communities where high climate exposure, severe socio-demographic sensitivity, and low adaptive capacity converge.
            </p>
          </div>

          {/* Toggle: Equity-Weighted Ranking vs. Risk-Only Ranking */}
          <div className="flex items-center border border-[var(--border)] rounded-[4px] bg-[var(--surface-raised)] p-0.5 font-mono-numbers text-xs">
            <button
              onClick={() => setRankingMode('equity')}
              className={`px-3 py-1.5 rounded-[3px] font-semibold cursor-pointer transition-colors ${
                rankingMode === 'equity'
                  ? 'bg-[var(--brand)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              Equity-Weighted Ranking
            </button>
            <button
              onClick={() => setRankingMode('risk_only')}
              className={`px-3 py-1.5 rounded-[3px] font-semibold cursor-pointer transition-colors ${
                rankingMode === 'risk_only'
                  ? 'bg-[var(--brand)] text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              Hazard Risk-Only Ranking
            </button>
          </div>
        </div>

        {/* Formula Notice */}
        <div className="mt-4 p-3 rounded-[4px] bg-[var(--surface-raised)] border border-[var(--border)] font-mono-numbers text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-muted)]">EQUITY FORMULA:</span>
            <code className="text-[var(--brand)] font-semibold">
              Priority = normalize(Risk × Vulnerability × (1 − Adaptive Capacity))
            </code>
          </div>
          <span className="text-[11px] text-[var(--text-muted)]">
            {rankingMode === 'equity'
              ? 'Showing priority with vulnerability & adaptive buffer weighted'
              : 'Showing raw thermal/precipitation risk without socio-economic weighting'}
          </span>
        </div>
      </div>

      {/* Ranked List with Ward Map Mini-Thumbnails */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] overflow-hidden">
        <div className="p-3.5 border-b border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-between text-xs font-mono-numbers">
          <span className="font-semibold text-[var(--text)]">
            ORDERED INTERVENTION REGISTER ({displayedList.length} LOCATIONS)
          </span>
          <span className="text-[var(--text-muted)]">ACTIVE SORT: {rankingMode.toUpperCase()}</span>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {displayedList.map((item, index) => {
            const displayRank = index + 1;
            const isImmediate = item.priority_level === 'IMMEDIATE';

            return (
              <div
                key={item.region_id}
                className="p-4 hover:bg-[var(--surface-raised)] transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                {/* Left: Mini-Thumbnail + Name + Interventions */}
                <div className="flex items-start gap-4">
                  {/* Map Mini-Thumbnail */}
                  <div className="w-14 h-14 rounded-[4px] bg-[var(--surface-raised)] border border-[var(--border)] relative overflow-hidden flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 60 60" className="w-full h-full opacity-60">
                      <rect width="60" height="60" fill="var(--surface-raised)" />
                      <circle cx="30" cy="30" r="18" fill="none" stroke="var(--border)" strokeWidth="1" />
                      <path
                        d="M 15 25 Q 30 15 45 28 T 35 48 Z"
                        fill={isImmediate ? 'var(--critical)' : 'var(--brand)'}
                        fillOpacity="0.4"
                      />
                    </svg>
                    <span className="absolute font-mono-numbers text-[10px] font-bold text-[var(--text)]">
                      {`0${displayRank}`}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[var(--text)]">{item.name}</h3>
                      <span
                        className={`text-[10px] font-mono-numbers font-semibold px-2 py-0.5 rounded-[3px] border uppercase ${
                          isImmediate
                            ? 'bg-[var(--critical)] text-white border-[var(--critical)]'
                            : 'bg-[var(--surface-raised)] text-[var(--text-muted)] border-[var(--border)]'
                        }`}
                      >
                        {item.priority_level}
                      </span>
                    </div>

                    <div className="text-xs text-[var(--text-muted)] font-mono-numbers mt-0.5">
                      Vulnerable Population: <strong className="text-[var(--text)]">{item.population}</strong>
                    </div>

                    {/* Direct Recommended Actions */}
                    <div className="mt-2 space-y-0.5 text-xs">
                      {item.recommended_actions.map((act, i) => (
                        <div key={i} className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-[var(--brand)]" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Scores & Action Shortcuts */}
                <div className="flex items-center gap-4 self-end lg:self-center font-mono-numbers text-xs">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded bg-[var(--surface-raised)] border border-[var(--border)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">Risk</span>
                      <span className="text-sm font-bold text-[var(--critical)]">{item.risk}</span>
                    </div>
                    <div className="p-2 rounded bg-[var(--surface-raised)] border border-[var(--border)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">Vuln</span>
                      <span className="text-sm font-bold text-[var(--text)]">{item.vulnerability}</span>
                    </div>
                    <div className="p-2 rounded bg-[var(--surface-raised)] border border-[var(--border)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">Adapt</span>
                      <span className="text-sm font-bold text-[var(--brand)]">{item.adaptive_capacity}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedRegionId(item.region_id);
                        navigate('/scenario-lab');
                      }}
                      className="px-3 py-1.5 rounded-[4px] bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                    >
                      Simulate &rarr;
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRegionId(item.region_id);
                        navigate('/resource-optimizer');
                      }}
                      className="px-2.5 py-1.5 rounded-[4px] border border-[var(--border)] bg-[var(--surface-raised)] hover:bg-[var(--border)] text-xs font-medium text-[var(--text)] cursor-pointer transition-colors"
                    >
                      Optimize
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DataMetadataFooter
        source="State Action Plan on Climate Change + Multi-Dimensional Vulnerability Index"
        model="Equity Prioritization Solver v1.0"
        confidence="high"
      />
    </div>
  );
};
