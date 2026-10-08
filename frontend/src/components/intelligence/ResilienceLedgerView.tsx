import React from 'react';
import { ResilienceLedgerEntry } from '../../types';
import {
  Activity,
  Calendar,
  CheckCircle2,
  TrendingUp,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface ResilienceLedgerViewProps {
  entries: ResilienceLedgerEntry[];
}

export const ResilienceLedgerView: React.FC<ResilienceLedgerViewProps> = ({ entries }) => {
  return (
    <div className="space-y-4">
      {/* Header explanation */}
      <div className="p-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold text-[var(--brand)] uppercase tracking-wider">
            Outcome Accounting System
          </div>
          <h2 className="text-base font-semibold text-[var(--text)] mt-0.5">
            Longitudinal Resilience Ledger
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Audit-grade record tracking baseline vulnerability, municipal intervention packages deployed, and empirical change over time.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-[4px] bg-[var(--surface-2)] border border-[var(--border)] text-center shrink-0">
          <div className="text-[10px] text-[var(--text-muted)] uppercase">Active Monitored Audits</div>
          <div className="text-sm font-semibold font-mono-numbers text-[var(--text)]">{entries.length} Wards</div>
        </div>
      </div>

      {/* Ledger Table / Cards */}
      <div className="space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="p-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-4"
          >
            {/* Top row: Area & Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[var(--text)]">{entry.area_name}</span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded border uppercase font-mono-numbers font-medium ${
                      entry.data_type === 'Observed change'
                        ? 'bg-[#4A8C80]/10 text-[#4A8C80] border-[#4A8C80]/30'
                        : 'bg-[#3368A0]/10 text-[#3368A0] border-[#3368A0]/30'
                    }`}
                  >
                    {entry.data_type}
                  </span>
                </div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Audit Entry ID: {entry.id} • Verified by: {entry.verification_source}
                </div>
              </div>

              {/* Net Delta Gain */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-muted)]">Resilience Shift:</span>
                <span className="px-2.5 py-1 rounded-[4px] bg-[var(--brand-subtle)] border border-[var(--brand)]/30 text-xs font-mono-numbers font-bold text-[var(--brand)]">
                  +{entry.delta} pts
                </span>
              </div>
            </div>

            {/* Before / Intervention / After Comparison Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Before Column */}
              <div className="md:col-span-3 p-3 rounded-[4px] bg-[var(--surface-2)] border border-[var(--border)] text-center">
                <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                  Baseline Resilience
                </div>
                <div className="text-2xl font-bold font-mono-numbers text-[var(--text-muted)] mt-1">
                  {entry.baseline_resilience}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] mt-1 flex items-center justify-center gap-1">
                  <Calendar size={11} />
                  {entry.baseline_date}
                </div>
              </div>

              {/* Interventions Column */}
              <div className="md:col-span-6 p-3 rounded-[4px] bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-[var(--brand)]" />
                  Deployed Intervention Package
                </div>
                <ul className="space-y-1">
                  {entry.interventions_deployed.map((item, idx) => (
                    <li key={idx} className="text-xs text-[var(--text)] font-medium flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* After Column */}
              <div className="md:col-span-3 p-3 rounded-[4px] bg-[var(--brand-subtle)] border border-[var(--brand)]/30 text-center">
                <div className="text-[9px] uppercase tracking-wider text-[var(--brand)] font-semibold">
                  Current Resilience
                </div>
                <div className="text-2xl font-bold font-mono-numbers text-[var(--brand)] mt-1">
                  {entry.current_resilience}
                </div>
                <div className="text-[10px] text-[var(--brand)] mt-1 flex items-center justify-center gap-1">
                  <Calendar size={11} />
                  {entry.current_date}
                </div>
              </div>
            </div>

            {/* Notes & Scientific Attribution Disclaimer */}
            <div className="pt-2 border-t border-[var(--border)]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <p className="text-xs text-[var(--text-muted)] italic">
                "{entry.notes}"
              </p>
              <span className="text-[10px] text-[var(--text-muted)] shrink-0 font-medium">
                {entry.data_type === 'Observed change' ? 'Empirically audited outcome' : 'Simulation validated model'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
