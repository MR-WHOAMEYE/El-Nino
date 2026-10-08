import React from 'react';
import { ModelCommunityConflict, EvidenceOverview } from '../../types';
import {
  AlertTriangle,
  Radio,
  Satellite,
  Users,
  Compass,
  CheckCircle,
  ShieldAlert,
  HelpCircle,
  Eye,
  FileCheck2
} from 'lucide-react';

interface ModelCommunityConflictAlertProps {
  conflicts: ModelCommunityConflict[];
  evidence?: EvidenceOverview;
  onVerifyField?: (conflictId: string) => void;
}

export const ModelCommunityConflictAlert: React.FC<ModelCommunityConflictAlertProps> = ({
  conflicts,
  evidence,
  onVerifyField,
}) => {
  return (
    <div className="space-y-4">
      {/* Evidence Overview Panel (Feature 12) */}
      {evidence && (
        <div className="p-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Compass size={16} className="text-[var(--brand)]" />
              <span className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
                Multi-Source Evidence Overview • {evidence.hazard}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[var(--text-muted)]">Consensus Confidence:</span>
              <span className="text-xs font-mono-numbers font-bold text-[var(--brand)]">
                {evidence.overall_confidence}%
              </span>
            </div>
          </div>

          {/* 5-pillar Evidence Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <div className="p-2.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-center">
              <div className="text-[9px] uppercase text-[var(--text-muted)] font-semibold">Official Static</div>
              <div className="text-xs font-semibold text-[var(--text)] mt-1">{evidence.official_data}</div>
            </div>
            <div className="p-2.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-center">
              <div className="text-[9px] uppercase text-[var(--text-muted)] font-semibold">Satellite SAR/NDVI</div>
              <div className="text-xs font-semibold text-[var(--text)] mt-1">{evidence.satellite_data}</div>
            </div>
            <div className="p-2.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-center">
              <div className="text-[9px] uppercase text-[var(--text-muted)] font-semibold">Model Forecast</div>
              <div className="text-xs font-semibold text-[#D15A42] mt-1">{evidence.model_prediction}</div>
            </div>
            <div className="p-2.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-center">
              <div className="text-[9px] uppercase text-[var(--text-muted)] font-semibold">Community Reports</div>
              <div className="text-xs font-semibold text-[#D15A42] mt-1">{evidence.community_reports}</div>
            </div>
            <div className="p-2.5 rounded bg-[var(--brand-subtle)] border border-[var(--brand)]/30 text-center col-span-2 sm:col-span-1">
              <div className="text-[9px] uppercase text-[var(--brand)] font-semibold">Consistency</div>
              <div className="text-xs font-bold text-[var(--brand)] mt-1">{evidence.evidence_consistency}</div>
            </div>
          </div>

          <p className="text-xs text-[var(--text-muted)] leading-relaxed italic pt-1">
            "{evidence.summary}"
          </p>
        </div>
      )}

      {/* Model vs Community Conflict Cards (Feature 5) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-[#D15A42]" />
            <span className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
              Discrepancy Alerts • Model vs Ground Truth
            </span>
          </div>
          <span className="text-[11px] text-[var(--text-muted)]">
            {conflicts.length} Active Divergence{conflicts.length > 1 ? 's' : ''}
          </span>
        </div>

        {conflicts.map((conflict) => (
          <div
            key={conflict.id}
            className="p-4 rounded-[6px] border border-[#D15A42]/40 bg-[#D15A42]/5 space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-[#D15A42] text-white text-[9px] font-bold uppercase tracking-wider">
                  ⚠ MODEL–COMMUNITY CONFLICT
                </span>
                <span className="text-xs font-semibold text-[var(--text)]">
                  {conflict.location_name}
                </span>
              </div>
              <span className="text-[11px] text-[#D15A42] font-semibold">
                Adjusted Confidence: {conflict.adjusted_confidence}% (Downweighted)
              </span>
            </div>

            <p className="text-xs text-[var(--text)] leading-relaxed">
              {conflict.explanation}
            </p>

            {/* Triangulation Evidence Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 rounded bg-[var(--surface)] border border-[var(--border)] text-xs">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase block">Model Signal:</span>
                <span className="font-semibold text-[var(--text)]">{conflict.model_estimate}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase block">Community Ground Evidence:</span>
                <span className="font-semibold text-[#D15A42]">{conflict.community_observations}</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase block">Satellite Observation:</span>
                <span className="font-semibold text-[#3368A0]">{conflict.satellite_evidence}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 border-t border-[var(--border)]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-[var(--text)]">
                <Radio size={13} className="text-[#D15A42] shrink-0" />
                <span className="font-semibold">Recommended action:</span>
                <span>"{conflict.recommended_action}"</span>
              </div>

              <button
                onClick={() => onVerifyField && onVerifyField(conflict.id)}
                className="px-3 py-1.5 rounded-[4px] bg-[var(--surface-2)] hover:bg-[var(--surface)] border border-[var(--border)] text-[11px] font-medium text-[var(--text)] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileCheck2 size={13} className="text-[var(--brand)]" />
                Initiate Field Verification Ticket
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
