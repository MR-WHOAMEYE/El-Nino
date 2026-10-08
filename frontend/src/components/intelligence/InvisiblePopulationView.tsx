import React from 'react';
import { InvisiblePopulationData } from '../../types';
import {
  Users,
  Eye,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Info,
  Droplets,
  Thermometer,
  HeartPulse,
  Briefcase
} from 'lucide-react';

interface InvisiblePopulationViewProps {
  data: InvisiblePopulationData;
}

export const InvisiblePopulationView: React.FC<InvisiblePopulationViewProps> = ({ data }) => {
  const getBadgeClass = (status: string) => {
    switch (status) {
      case 'CRITICAL':
        return 'bg-[#D15A42]/10 text-[#D15A42] border-[#D15A42]/30';
      case 'HIGH':
        return 'bg-[#E3963E]/10 text-[#E3963E] border-[#E3963E]/30';
      case 'LOW':
        return 'bg-[#D15A42]/10 text-[#D15A42] border-[#D15A42]/30'; // Low access is bad
      case 'ADEQUATE':
        return 'bg-[#4A8C80]/10 text-[#4A8C80] border-[#4A8C80]/30';
      default:
        return 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)]';
    }
  };

  return (
    <div className="space-y-4">
      {/* Risk Comparison Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Conventional Climate Risk */}
        <div className="p-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Conventional Hazard Score
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-semibold font-mono-numbers text-[var(--text)]">
                {data.climate_risk}
              </span>
              <span className="text-xs text-[var(--text-muted)]">/ 100</span>
            </div>
            <div className="mt-2 text-xs text-[var(--text-muted)]">
              Based solely on macroscopic meteorological forcing & satellite indices.
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)] flex items-center justify-between">
            <span>Model Level</span>
            <span className="font-semibold text-[#E3963E]">MODERATE / ELEVATED</span>
          </div>
        </div>

        {/* Delta / Transition */}
        <div className="p-4 rounded-[6px] border border-[var(--brand)]/40 bg-[var(--brand-subtle)] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-semibold text-[var(--brand)] uppercase tracking-wider flex items-center gap-1.5">
              <Eye size={14} />
              Invisible Risk Discrepancy
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-semibold font-mono-numbers text-[var(--brand)]">
                +{data.estimated_invisible_risk - data.climate_risk}
              </span>
              <span className="text-xs text-[var(--brand)] font-medium">pts adjustment</span>
            </div>
            <div className="mt-2 text-xs text-[var(--text)] leading-relaxed">
              Adaptive capacity deficits (cooling, water, outdoor labor) elevate the real human burden.
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--brand)]/20 text-[11px] text-[var(--brand)] font-medium flex items-center justify-between">
            <span>Estimated Underserved Pop.</span>
            <span className="font-bold font-mono-numbers">~{data.estimated_vulnerable_population.toLocaleString()}</span>
          </div>
        </div>

        {/* Compound Invisible Risk Score */}
        <div className="p-4 rounded-[6px] border border-[#D15A42]/40 bg-[var(--surface)] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-semibold text-[#D15A42] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert size={14} />
              Invisible Risk Score
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-semibold font-mono-numbers text-[#D15A42]">
                {data.estimated_invisible_risk}
              </span>
              <span className="text-xs text-[var(--text-muted)]">/ 100</span>
            </div>
            <div className="mt-2 text-xs text-[var(--text-muted)]">
              Composite index incorporating frontline exposure & resource deprivation.
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)] flex items-center justify-between">
            <span>Status</span>
            <span className="font-semibold text-[#D15A42]">ACUTE VULNERABILITY</span>
          </div>
        </div>
      </div>

      {/* Primary Analytical Explanation */}
      <div className="p-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-[4px] bg-[var(--brand-subtle)] text-[var(--brand)] shrink-0">
            <Info size={18} />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
              Diagnostic Rationale • {data.region_name}
            </h3>
            <p className="text-xs text-[var(--text)] mt-1 leading-relaxed font-medium">
              "{data.explanation}"
            </p>
            <div className="mt-2 text-[11px] text-[var(--text-muted)]">
              {data.model_label} • Aggregated community-level estimate
            </div>
          </div>
        </div>
      </div>

      {/* Adaptive Capacity & Exposure Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-[5px] border border-[var(--border)] bg-[var(--surface)]">
          <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
            <Briefcase size={12} className="text-[#E3963E]" />
            Outdoor Worker
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--text)]">{data.outdoor_worker_exposure}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${getBadgeClass(data.outdoor_worker_exposure)}`}>
              High Exposure
            </span>
          </div>
        </div>

        <div className="p-3 rounded-[5px] border border-[var(--border)] bg-[var(--surface)]">
          <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
            <Thermometer size={12} className="text-[#3368A0]" />
            Cooling Access
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--text)]">{data.cooling_access}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${getBadgeClass(data.cooling_access)}`}>
              Deficit
            </span>
          </div>
        </div>

        <div className="p-3 rounded-[5px] border border-[var(--border)] bg-[var(--surface)]">
          <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
            <HeartPulse size={12} className="text-[#E11D48]" />
            Healthcare Access
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--text)]">{data.healthcare_access}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${getBadgeClass(data.healthcare_access)}`}>
              Deficit
            </span>
          </div>
        </div>

        <div className="p-3 rounded-[5px] border border-[var(--border)] bg-[var(--surface)]">
          <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1">
            <Droplets size={12} className="text-[#3368A0]" />
            Water Access
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--text)]">{data.water_access}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${getBadgeClass(data.water_access)}`}>
              Deficit
            </span>
          </div>
        </div>
      </div>

      {/* Micro-Factor Vulnerability Ledger */}
      <div className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] p-4">
        <h3 className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider mb-3">
          Contributing Deprivation Drivers
        </h3>
        <div className="space-y-2">
          {data.factors.map((factor, idx) => (
            <div
              key={idx}
              className="p-3 rounded-[4px] border border-[var(--border)] bg-[var(--surface-2)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--text)]">{factor.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded border font-mono-numbers font-medium ${getBadgeClass(factor.status)}`}>
                    {factor.status}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)]">{factor.description}</p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] uppercase text-[var(--text-muted)]">Deprivation Weight</div>
                <div className="text-sm font-mono-numbers font-semibold text-[#D15A42]">
                  {factor.impact_score} / 100
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
