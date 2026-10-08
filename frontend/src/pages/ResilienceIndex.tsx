import React from 'react';
import { useAppStore } from '../store/appStore';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { DataMetadataFooter } from '../components/common/DataMetadataFooter';
import { Activity, AlertTriangle, Droplets, Heart, Building, PhoneCall, Users } from 'lucide-react';

export const ResilienceIndex: React.FC = () => {
  const { selectedRegion } = useAppStore();

  const dimensions = [
    { name: 'Water Security & Desalination Reserves', score: 48, status: 'WEAKEST', color: 'var(--critical)', icon: Droplets, desc: 'Piped supply dependency, reservoir active storage at 34% capacity, high tanker cost' },
    { name: 'Primary Healthcare Surge Capacity', score: 58, status: 'MODERATE', color: 'var(--heat)', icon: Heart, desc: 'Heat-stroke emergency beds in government hospitals, IV fluid supplies' },
    { name: 'Infrastructure & Urban Shading Fabric', score: 54, status: 'MODERATE', color: 'var(--text-muted)', icon: Building, desc: 'Cool roof penetration, tree canopy in industrial port zones' },
    { name: 'Emergency Preparedness & Early Warning', score: 72, status: 'STRONG', color: 'var(--brand)', icon: PhoneCall, desc: 'Multi-channel municipal SMS broadcasts, emergency response battalions' },
    { name: 'Community Social Capital & Mutual Aid', score: 76, status: 'STRONG', color: 'var(--brand)', icon: Users, desc: 'Resident welfare networks, volunteer relief hydration points' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] p-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand)] font-mono-numbers">
          <Activity size={15} />
          <span>INSTITUTIONAL ADAPTIVE BENCHMARK</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--text)] mt-1">
          Climate Resilience Index
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1 max-w-2xl">
          Multi-dimensional structural capacity audit evaluating {selectedRegion.name}'s institutional readiness to absorb climate shocks without critical failure.
        </p>
      </div>

      {/* Hero Score & 5-Pillar Radar Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Overall Score Card (4 Cols) */}
        <div className="md:col-span-4 p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-4">
          <ScoreBadge score={63} label="Overall Metropolitan Resilience" band="HIGH" size="hero" />
          <div className="text-xs text-[var(--text-muted)] leading-relaxed pt-2 border-t border-[var(--border)]">
            Aggregated audit score across water, health, infrastructure, emergency warnings, and community capital.
          </div>
        </div>

        {/* Five-Pillar SVG Radar Chart (8 Cols) */}
        <div className="md:col-span-8 p-6 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col items-center justify-center relative">
          <div className="w-full flex items-center justify-between pb-3 border-b border-[var(--border)] text-xs font-mono-numbers">
            <span className="font-semibold text-[var(--text)]">FIVE-PILLAR RESILIENCE RADAR</span>
            <span className="text-[var(--critical)] font-bold">WATER SECURITY BOTTLENECK (48/100)</span>
          </div>

          {/* SVG Radar Chart */}
          <div className="my-4 relative flex items-center justify-center">
            <svg width="340" height="280" viewBox="0 0 340 280" className="overflow-visible">
              {/* Concentric Polygonal Grid Rings (20, 40, 60, 80, 100) */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale, i) => (
                <polygon
                  key={i}
                  points={`
                    ${170 + 110 * scale * Math.cos(-Math.PI / 2)},${140 + 110 * scale * Math.sin(-Math.PI / 2)}
                    ${170 + 110 * scale * Math.cos(-Math.PI / 2 + 2 * Math.PI / 5)},${140 + 110 * scale * Math.sin(-Math.PI / 2 + 2 * Math.PI / 5)}
                    ${170 + 110 * scale * Math.cos(-Math.PI / 2 + 4 * Math.PI / 5)},${140 + 110 * scale * Math.sin(-Math.PI / 2 + 4 * Math.PI / 5)}
                    ${170 + 110 * scale * Math.cos(-Math.PI / 2 + 6 * Math.PI / 5)},${140 + 110 * scale * Math.sin(-Math.PI / 2 + 6 * Math.PI / 5)}
                    ${170 + 110 * scale * Math.cos(-Math.PI / 2 + 8 * Math.PI / 5)},${140 + 110 * scale * Math.sin(-Math.PI / 2 + 8 * Math.PI / 5)}
                  `}
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="1"
                  strokeDasharray={scale === 1.0 ? 'none' : '3 3'}
                />
              ))}

              {/* Data Polygon */}
              <polygon
                points={`
                  ${170 + 110 * (48 / 100) * Math.cos(-Math.PI / 2)},${140 + 110 * (48 / 100) * Math.sin(-Math.PI / 2)}
                  ${170 + 110 * (58 / 100) * Math.cos(-Math.PI / 2 + 2 * Math.PI / 5)},${140 + 110 * (58 / 100) * Math.sin(-Math.PI / 2 + 2 * Math.PI / 5)}
                  ${170 + 110 * (54 / 100) * Math.cos(-Math.PI / 2 + 4 * Math.PI / 5)},${140 + 110 * (54 / 100) * Math.sin(-Math.PI / 2 + 4 * Math.PI / 5)}
                  ${170 + 110 * (72 / 100) * Math.cos(-Math.PI / 2 + 6 * Math.PI / 5)},${140 + 110 * (72 / 100) * Math.sin(-Math.PI / 2 + 6 * Math.PI / 5)}
                  ${170 + 110 * (76 / 100) * Math.cos(-Math.PI / 2 + 8 * Math.PI / 5)},${140 + 110 * (76 / 100) * Math.sin(-Math.PI / 2 + 8 * Math.PI / 5)}
                `}
                fill="rgba(11, 110, 127, 0.25)"
                stroke="var(--brand)"
                strokeWidth="2"
              />

              {/* Weakest Point Highlight (Water Security: 48) - Red/Amber, NOT Green */}
              <circle
                cx={170 + 110 * (48 / 100) * Math.cos(-Math.PI / 2)}
                cy={140 + 110 * (48 / 100) * Math.sin(-Math.PI / 2)}
                r="6"
                fill="var(--critical)"
              />
              <text
                x="170"
                y="15"
                textAnchor="middle"
                className="fill-[var(--critical)] text-[11px] font-mono-numbers font-bold"
              >
                Water: 48 (Bottleneck)
              </text>

              {/* Other Vertex Labels */}
              <text x="310" y="110" textAnchor="start" className="fill-[var(--text-muted)] text-[10px] font-mono-numbers">
                Health: 58
              </text>
              <text x="255" y="260" textAnchor="start" className="fill-[var(--text-muted)] text-[10px] font-mono-numbers">
                Infrastructure: 54
              </text>
              <text x="85" y="260" textAnchor="end" className="fill-[var(--brand)] text-[10px] font-mono-numbers">
                Warning: 72
              </text>
              <text x="30" y="110" textAnchor="end" className="fill-[var(--brand)] text-[10px] font-mono-numbers">
                Social: 76
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Dimensions Breakdown List */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-between text-xs font-mono-numbers">
          <span className="font-semibold text-[var(--text)]">PILLAR PERFORMANCE REGISTER</span>
          <span className="text-[var(--text-muted)]">5 EVALUATED DIMENSIONS</span>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {dimensions.map((dim) => {
            const Icon = dim.icon;
            const isWeakest = dim.status === 'WEAKEST';
            return (
              <div
                key={dim.name}
                className={`p-4 space-y-1.5 transition-colors ${
                  isWeakest ? 'bg-[var(--critical)]/5' : 'hover:bg-[var(--surface-raised)]'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Icon size={15} className={isWeakest ? 'text-[var(--critical)]' : 'text-[var(--text-muted)]'} />
                    <span className={`font-semibold text-sm ${isWeakest ? 'text-[var(--critical)] font-bold' : 'text-[var(--text)]'}`}>
                      {dim.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 font-mono-numbers">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        isWeakest
                          ? 'bg-[var(--critical)] text-white'
                          : dim.status === 'STRONG'
                          ? 'bg-[var(--brand-subtle)] text-[var(--brand)]'
                          : 'bg-[var(--surface-raised)] text-[var(--text-muted)]'
                      }`}
                    >
                      {dim.status}
                    </span>
                    <span className="text-base font-bold text-[var(--text)]">
                      {dim.score} / 100
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-[var(--surface-raised)] rounded-full overflow-hidden border border-[var(--border)]">
                  <div
                    className="h-full"
                    style={{
                      width: `${dim.score}%`,
                      backgroundColor: isWeakest ? 'var(--critical)' : 'var(--brand)',
                    }}
                  />
                </div>

                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {dim.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <DataMetadataFooter
        source="UNDRR Disaster Resilience Scorecard"
        model="Adaptive Capacity Framework v1.0"
        confidence="high"
      />
    </div>
  );
};
