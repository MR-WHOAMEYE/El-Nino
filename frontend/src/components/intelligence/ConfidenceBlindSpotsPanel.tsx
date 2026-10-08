import React from 'react';
import { ConfidenceMetadata, DataBlindSpot } from '../../types';
import {
  ShieldAlert,
  Clock,
  Database,
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle,
  Radio,
  FileQuestion
} from 'lucide-react';

interface ConfidenceBlindSpotsPanelProps {
  confidenceData: ConfidenceMetadata;
  blindSpots: DataBlindSpot[];
}

export const ConfidenceBlindSpotsPanel: React.FC<ConfidenceBlindSpotsPanelProps> = ({
  confidenceData,
  blindSpots,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Banner: Dual Risk vs Confidence & Data Freshness */}
      <div className="p-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Risk Score */}
        <div className="p-3 rounded-[4px] bg-[var(--surface-2)] border border-[var(--border)]">
          <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Estimated Risk</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-semibold font-mono-numbers text-[var(--text)]">
              {confidenceData.overall_risk}
            </span>
            <span className="text-xs text-[var(--text-muted)]">/ 100</span>
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">
            Model version: {confidenceData.model_version}
          </div>
        </div>

        {/* Confidence Score */}
        <div className="p-3 rounded-[4px] bg-[var(--brand-subtle)] border border-[var(--brand)]/30">
          <div className="text-[10px] uppercase tracking-wider text-[var(--brand)] font-semibold flex items-center gap-1.5">
            <ShieldAlert size={13} />
            Model Confidence
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-semibold font-mono-numbers text-[var(--brand)]">
              {confidenceData.overall_confidence}%
            </span>
            <span className="text-xs text-[var(--brand)] font-medium">calibrated</span>
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">
            Uncertainty bound: ±{(100 - confidenceData.overall_confidence) * 0.4}%
          </div>
        </div>

        {/* Hazard Domain Confidence Breakdown */}
        <div className="p-3 rounded-[4px] bg-[var(--surface-2)] border border-[var(--border)] flex flex-col justify-between">
          <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">
            Domain Confidence
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Heat:</span>
              <span className="font-mono-numbers font-medium text-[var(--text)]">{confidenceData.heat_confidence}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Water:</span>
              <span className="font-mono-numbers font-medium text-[var(--text)]">{confidenceData.water_confidence}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Flood:</span>
              <span className="font-mono-numbers font-medium text-[var(--text)]">{confidenceData.flood_confidence}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Health:</span>
              <span className="font-mono-numbers font-medium text-[var(--text)]">{confidenceData.health_confidence}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Freshness Ledger */}
      <div className="p-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[var(--brand)]" />
            <span className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
              Data Freshness & Provenance Metadata
            </span>
          </div>
          <span className="text-[11px] text-[var(--text-muted)] font-mono-numbers">
            Telemetry Feed Active
          </span>
        </div>

        <div className="space-y-2">
          {confidenceData.data_freshness.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-[4px] border border-[var(--border)] bg-[var(--surface-2)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    item.status === 'fresh' ? 'bg-[#4A8C80]' : item.status === 'gap' ? 'bg-[#D15A42]' : 'bg-[#E3963E]'
                  }`}
                />
                <span className="font-medium text-[var(--text)]">{item.layer}</span>
                <span className="text-[11px] text-[var(--text-muted)]">({item.source})</span>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-[var(--text-muted)] font-mono-numbers">
                <span>{item.resolution}</span>
                <span className={`font-semibold ${item.status === 'fresh' ? 'text-[#4A8C80]' : 'text-[#D15A42]'}`}>
                  {item.updated_ago}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Blind Spot Detector */}
      <div className="p-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-[#D15A42]" />
            <span className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
              Data Blind Spot Detector ({blindSpots.length} Flagged)
            </span>
          </div>
          <span className="text-[11px] text-[#D15A42] font-semibold">
            Actionable Telemetry Gaps
          </span>
        </div>

        <div className="space-y-3">
          {blindSpots.map((spot) => (
            <div
              key={spot.id}
              className="p-3.5 rounded-[5px] border border-[#D15A42]/30 bg-[#D15A42]/5 space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.2 rounded bg-[#D15A42] text-white text-[9px] font-bold uppercase tracking-wider">
                      ⚠ DATA BLIND SPOT
                    </span>
                    <span className="text-xs font-semibold text-[var(--text)]">
                      {spot.title}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text)] leading-relaxed">
                    {spot.description}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Coverage Gap</div>
                  <div className="text-sm font-semibold font-mono-numbers text-[#D15A42]">
                    {spot.coverage_gap_percent}%
                  </div>
                </div>
              </div>

              {/* Confidence Impact Projection */}
              <div className="pt-2 border-t border-[var(--border)]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--text-muted)]">Current model confidence:</span>
                  <span className="font-semibold font-mono-numbers text-[var(--text)]">{spot.current_confidence}%</span>
                  <span className="text-[var(--text-muted)]">→ Potential with data:</span>
                  <span className="font-semibold font-mono-numbers text-[var(--brand)]">{spot.potential_confidence}%</span>
                </div>
                <div className="text-[11px] font-medium text-[var(--brand)]">
                  "{spot.impact_note}"
                </div>
              </div>

              {/* Recommended Action */}
              <div className="pt-1 text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                <Radio size={12} className="text-[var(--brand)] shrink-0" />
                <span>Recommended instrument: {spot.recommended_sensor_or_survey}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
