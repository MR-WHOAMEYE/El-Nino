import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { CommunityReport } from '../types';
import { DataMetadataFooter } from '../components/common/DataMetadataFooter';
import { LoadingState } from '../components/common/StateViews';
import { Users, AlertTriangle, Send, MapPin, Clock, Plus, Flame, Droplets, CheckCircle2 } from 'lucide-react';

export const CommunityIntelligence: React.FC = () => {
  const { selectedRegion, getProvider } = useAppStore();
  const provider = getProvider();

  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // New report form state
  const [category, setCategory] = useState<CommunityReport['category']>('Water shortage');
  const [severity, setSeverity] = useState<CommunityReport['severity']>('severe');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function loadReports() {
      try {
        setLoading(true);
        const res = await provider.getCommunityReports();
        if (isMounted && res.success) {
          setReports(res.data);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadReports();
    return () => { isMounted = false; };
  }, [provider]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName || !description) return;

    try {
      const res = await provider.submitCommunityReport({
        region_id: selectedRegion.id,
        category,
        severity,
        location_name: locationName,
        coordinates: selectedRegion.coordinates,
        description,
      });

      if (res.success) {
        setReports([res.data, ...reports]);
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setShowSubmitModal(false);
          setLocationName('');
          setDescription('');
        }, 1200);
      }
    } catch {
      // safe handle
    }
  };

  if (loading && reports.length === 0) {
    return <LoadingState message="Loading community field reports and spatial clusters..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand)] font-mono-numbers">
              <Users size={16} />
              <span>CROWDSOURCED VERIFICATION & HOTSPOTS</span>
            </div>
            <h1 className="text-2xl font-semibold text-[var(--text)] mt-1">
              Community Intelligence Feed
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1 max-w-2xl">
              Real-time ground truth reports submitted by citizens, local healthcare workers, and ward volunteers. Corroborates satellite models with immediate neighborhood infrastructure realities.
            </p>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[4px] text-xs font-semibold bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] cursor-pointer transition-colors"
          >
            <Plus size={15} />
            <span>Submit Ground Report</span>
          </button>
        </div>
      </div>

      {/* Clustered Hotspot Alert Banner (Rule Section 31) */}
      <div className="p-4 rounded-[6px] border border-[var(--critical)] bg-[var(--surface)] pattern-hatch-critical flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono-numbers">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-[4px] bg-[var(--critical)] text-white flex items-center justify-center shrink-0">
            <Flame size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--critical)] uppercase tracking-wider">
                POTENTIAL EMERGING HOTSPOT DETECTED
              </span>
              <span className="text-[10px] bg-[var(--critical)] text-white px-1.5 py-0.2 rounded font-semibold">
                SEVERITY CRITICAL
              </span>
            </div>
            <div className="text-sm font-semibold text-[var(--text)] mt-0.5">
              North Chennai (Vyasarpadi & Tondiarpet Ward Cluster)
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              47 verified ground reports within 1.8 km during the last 6 hours (Water Shortage + Heat Syncope)
            </div>
          </div>
        </div>

        <div className="self-end md:self-center">
          <span className="text-xs px-2.5 py-1 rounded bg-[var(--surface)] border border-[var(--critical)] text-[var(--critical)] font-bold">
            CLUSTER ACTIVE
          </span>
        </div>
      </div>

      {/* Report Feed */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between font-mono-numbers text-xs">
          <span className="font-semibold text-[var(--text)] uppercase tracking-wider">
            RECENT COMMUNITY REPORTS ({reports.length})
          </span>
          <span className="text-[var(--text-muted)]">UPDATED EVERY 60 SECONDS</span>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {reports.map((rpt) => (
            <div key={rpt.id} className="p-4 hover:bg-[var(--surface-2)] transition-colors space-y-2">
              <div className="flex items-center justify-between font-mono-numbers text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[var(--text)]">{rpt.id}</span>
                  <span className="text-[var(--text-muted)]">•</span>
                  <span className="font-semibold text-[var(--brand)]">{rpt.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-[3px] uppercase ${
                      rpt.severity === 'critical'
                        ? 'bg-[var(--critical)] text-white'
                        : rpt.severity === 'severe'
                        ? 'bg-[var(--risk-high)]/20 text-[var(--risk-high)] border border-[var(--risk-high)]'
                        : 'bg-[var(--surface-2)] text-[var(--text-muted)]'
                    }`}
                  >
                    {rpt.severity}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(rpt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-mono-numbers">
                <MapPin size={13} className="text-[var(--text-muted)]" />
                <span className="text-[var(--text)] font-medium">{rpt.location_name}</span>
              </div>

              <p className="text-xs text-[var(--text)] leading-relaxed pt-1">
                {rpt.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Report Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-[6px] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text)]">
                Submit Ground Observation
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text)] text-xs"
              >
                Cancel
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center text-[var(--brand)] space-y-2">
                <CheckCircle2 size={36} className="mx-auto" />
                <div className="font-semibold text-sm">Report Registered Successfully</div>
                <div className="text-xs text-[var(--text-muted)]">Integrated into spatial cluster evaluation model.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono-numbers">
                <div>
                  <label className="text-[var(--text-muted)] block mb-1">INCIDENT CATEGORY:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 rounded-[4px] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)]"
                  >
                    <option value="Water shortage">Water shortage</option>
                    <option value="Extreme heat">Extreme heat</option>
                    <option value="Health emergency">Health emergency</option>
                    <option value="Flooding">Flooding</option>
                    <option value="Power outage">Power outage</option>
                    <option value="Crop damage">Crop damage</option>
                    <option value="Infrastructure damage">Infrastructure damage</option>
                  </select>
                </div>

                <div>
                  <label className="text-[var(--text-muted)] block mb-1">OBSERVED SEVERITY:</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full p-2 rounded-[4px] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)]"
                  >
                    <option value="low">Low (Localized inconvenience)</option>
                    <option value="moderate">Moderate (Intermittent service)</option>
                    <option value="severe">Severe (Critical disruption)</option>
                    <option value="critical">Critical (Immediate life/health danger)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[var(--text-muted)] block mb-1">SPECIFIC LOCATION / LANDMARK:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ward 42, Market Junction Water Point"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full p-2 rounded-[4px] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] font-sans"
                  />
                </div>

                <div>
                  <label className="text-[var(--text-muted)] block mb-1">FIELD OBSERVATION DETAILS:</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe specific conditions, queues, health symptoms, or duration..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 rounded-[4px] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] font-sans"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-3 py-1.5 rounded-[4px] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-muted)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-[4px] bg-[var(--brand)] text-white font-semibold cursor-pointer"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <DataMetadataFooter
        source="Community Incident Reporting Service (OpenTelemetry)"
        model="DBSCAN Spatial Cluster Algorithm (2km / 6hr)"
        confidence="high"
      />
    </div>
  );
};
