import React from 'react';
import { ResponseCapacityData } from '../../types';
import {
  Building2,
  School,
  Hospital,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MapPin,
  TrendingUp,
  Percent
} from 'lucide-react';

interface ResponseCapacityMapProps {
  data: ResponseCapacityData;
}

export const ResponseCapacityMap: React.FC<ResponseCapacityMapProps> = ({ data }) => {
  const getFacilityIcon = (type: string) => {
    switch (type) {
      case 'School':
        return <School size={16} className="text-[#3368A0]" />;
      case 'Hospital':
        return <Hospital size={16} className="text-[#E11D48]" />;
      case 'NGO Center':
        return <Users size={16} className="text-[var(--brand)]" />;
      default:
        return <Building2 size={16} className="text-[#E3963E]" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Overview Balance Metrics */}
      <div className="p-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-[4px] bg-[var(--surface-2)] border border-[var(--border)]">
          <div className="text-[10px] uppercase text-[var(--text-muted)] font-semibold">
            Detected Community Need
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-[var(--text)] mt-1">
            {data.detected_need_count} <span className="text-xs text-[var(--text-muted)] font-normal">Cooling Hubs</span>
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">
            Calculated from heat index & labor density
          </div>
        </div>

        <div className="p-3 rounded-[4px] bg-[var(--brand-subtle)] border border-[var(--brand)]/30">
          <div className="text-[10px] uppercase text-[var(--brand)] font-semibold">
            Available Candidate Capacity
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-[var(--brand)] mt-1">
            {data.available_capacity_count} <span className="text-xs text-[var(--brand)] font-normal">Spaces</span>
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">
            Identified across 5 municipal & civic partners
          </div>
        </div>

        <div className="p-3 rounded-[4px] bg-[var(--surface-2)] border border-[var(--border)]">
          <div className="text-[10px] uppercase text-[var(--text-muted)] font-semibold">
            Coverage Balance
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-[#4A8C80] mt-1">
            {data.coverage_percentage}%
          </div>
          <div className="text-[10px] text-[#4A8C80] font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 size={11} />
            Theoretical Demand Matched
          </div>
        </div>
      </div>

      {/* Facility Inventory List */}
      <div className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-3">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-[var(--brand)]" />
            <span className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
              Candidate Civic Facility Inventory
            </span>
          </div>
          <span className="text-[11px] text-[var(--text-muted)] font-mono-numbers">
            {data.facilities.length} Spatial Assets Mapped
          </span>
        </div>

        <div className="space-y-2">
          {data.facilities.map((fac) => (
            <div
              key={fac.id}
              className="p-3 rounded-[4px] border border-[var(--border)] bg-[var(--surface-2)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-[var(--surface)] border border-[var(--border)] shrink-0">
                  {getFacilityIcon(fac.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[var(--text)]">{fac.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]">
                      {fac.type}
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                    <MapPin size={11} />
                    <span>Coordinates: [{fac.coordinates[0]}, {fac.coordinates[1]}]</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Potential Spaces</div>
                  <div className="text-sm font-semibold font-mono-numbers text-[var(--brand)]">
                    {fac.spaces_available} Hub Space{fac.spaces_available > 1 ? 's' : ''}
                  </div>
                </div>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded border uppercase font-medium ${
                    fac.verified
                      ? 'bg-[#4A8C80]/10 text-[#4A8C80] border-[#4A8C80]/30'
                      : 'bg-[#E3963E]/10 text-[#E3963E] border-[#E3963E]/30'
                  }`}
                >
                  {fac.verified ? 'Physically Audited' : 'Candidate Unverified'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Planning Tool Disclaimer */}
        <div className="mt-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--text-muted)] flex items-start gap-2">
          <AlertCircle size={14} className="text-[var(--brand)] shrink-0 mt-0.5" />
          <span>
            <strong className="text-[var(--text)]">Municipal Planning Support Tool:</strong> {data.planning_note}
          </span>
        </div>
      </div>
    </div>
  );
};
