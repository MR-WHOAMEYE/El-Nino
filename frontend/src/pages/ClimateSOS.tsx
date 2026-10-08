import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { Alert } from '../types';
import { DataMetadataFooter } from '../components/common/DataMetadataFooter';
import { LoadingState } from '../components/common/StateViews';
import { AlertTriangle, ShieldAlert, CheckCircle, Bell, ArrowRight, Check } from 'lucide-react';

export const ClimateSOS: React.FC = () => {
  const { getProvider } = useAppStore();
  const provider = getProvider();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [acknowledged, setAcknowledged] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    async function loadAlerts() {
      try {
        setLoading(true);
        const res = await provider.getAlerts();
        if (isMounted && res.success) {
          setAlerts(res.data);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadAlerts();
    return () => { isMounted = false; };
  }, [provider]);

  const toggleAcknowledge = (id: string) => {
    setAcknowledged((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading && alerts.length === 0) {
    return <LoadingState message="Evaluating environmental threshold triggers..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--critical)] font-mono-numbers">
          <AlertTriangle size={16} />
          <span>EARLY WARNING & THRESHOLD MONITOR</span>
        </div>
        <h1 className="text-2xl font-semibold text-[var(--text)] mt-1">
          Climate SOS Emergency Alerts
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1 max-w-2xl">
          Automated emergency notifications triggered when compound thresholds (consecutive wet-bulb temperatures, municipal water storage deficits, and community casualty clusters) intersect.
        </p>

        <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between font-mono-numbers text-xs">
          <span>ACTIVE THRESHOLD ALERTS: <strong className="text-[var(--critical)]">{alerts.length} SYSTEM TRIGGERS</strong></span>
          <span className="text-[var(--text-muted)]">AUTOMATIC NOTIFICATION BROADCAST ON</span>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-4">
        {alerts.map((al) => {
          const isAck = acknowledged[al.id];
          return (
            <div
              key={al.id}
              className={`border rounded-[6px] bg-[var(--surface)] p-5 transition-all space-y-4 ${
                al.severity === 'CRITICAL'
                  ? 'border-[var(--critical)] shadow-sm'
                  : 'border-[var(--border)]'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-mono-numbers font-semibold px-2 py-0.5 rounded-[3px] uppercase border ${
                      al.severity === 'CRITICAL'
                        ? 'bg-[var(--critical)] text-white border-[var(--critical)] pattern-hatch-critical'
                        : 'bg-[var(--risk-high)]/20 text-[var(--risk-high)] border-[var(--risk-high)]'
                    }`}
                  >
                    {al.severity} THRESHOLD
                  </span>
                  <span className="font-mono-numbers text-xs font-bold text-[var(--text)]">{al.id}</span>
                </div>

                <div className="text-[11px] font-mono-numbers text-[var(--text-muted)]">
                  Triggered: {new Date(al.timestamp).toLocaleString()}
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-[var(--text)]">{al.title}</h3>
                <div className="text-xs font-mono-numbers text-[var(--brand)] font-medium mt-0.5">
                  Location: {al.location}
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                  {al.description}
                </p>
              </div>

              {/* Threshold Indicators */}
              <div className="p-3 rounded-[4px] bg-[var(--surface-2)] border border-[var(--border)] space-y-1.5 font-mono-numbers text-xs">
                <span className="text-[10px] uppercase text-[var(--text-muted)] block font-semibold">
                  TRIGGERED THRESHOLD INDICATORS:
                </span>
                <div className="flex flex-wrap gap-2">
                  {al.indicators.map((ind, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--critical)] font-medium"
                    >
                      • {ind}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Directives */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-mono-numbers uppercase text-[var(--text-muted)] block font-semibold">
                  MANDATED MUNICIPAL ACTIONS:
                </span>
                <ul className="space-y-1 text-[var(--text)] list-disc list-inside">
                  {al.recommended_actions.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>

              {/* Acknowledge Button */}
              <div className="pt-2 border-t border-[var(--border)] flex justify-end">
                <button
                  onClick={() => toggleAcknowledge(al.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-mono-numbers font-medium cursor-pointer transition-colors ${
                    isAck
                      ? 'bg-[var(--brand-subtle)] text-[var(--brand)] border border-[var(--brand)]'
                      : 'border border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text)]'
                  }`}
                >
                  {isAck ? <Check size={14} /> : <Bell size={14} />}
                  <span>{isAck ? 'Action Plan Dispatched' : 'Acknowledge & Dispatch Directive'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <DataMetadataFooter
        source="IMD Wet-Bulb Advisory Engine + Metro Water Telemetry"
        model="Threshold Trigger Evaluator v1.0"
        confidence="high"
      />
    </div>
  );
};
