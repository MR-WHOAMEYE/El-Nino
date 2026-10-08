import React, { useState } from 'react';
import { TimeMachineData, TimeMachinePeriod } from '../../types';
import {
  History,
  Clock,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Thermometer,
  CloudRain,
  Droplets,
  Sprout,
  Users,
  ShieldAlert,
  Activity,
  ArrowRight
} from 'lucide-react';

interface ClimateTimeMachineProps {
  data: TimeMachineData;
}

export const ClimateTimeMachine: React.FC<ClimateTimeMachineProps> = ({ data }) => {
  const [selectedYearIndex, setSelectedYearIndex] = useState<number>(2); // 2026 default
  const [showCounterfactual, setShowCounterfactual] = useState<boolean>(true);

  const periods = data.periods.filter((p) => {
    if (!showCounterfactual && p.is_counterfactual) return false;
    return true;
  });

  const activePeriod = periods[selectedYearIndex] || periods[0];
  const baselinePeriod = periods[0]; // 2015

  return (
    <div className="space-y-4">
      {/* Time Machine Header and Controls */}
      <div className="p-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[var(--brand)]" />
            <span className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
              Climate Time Machine • Multi-Decadal Analog
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Compare past El Niño analog years (2015) against present conditions (2026) and 2030 counterfactual intervention trajectories.
          </p>
        </div>

        {/* Counterfactual Scenario Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <label className="flex items-center gap-2 text-xs font-medium text-[var(--text)] cursor-pointer">
            <input
              type="checkbox"
              checked={showCounterfactual}
              onChange={(e) => setShowCounterfactual(e.target.checked)}
              className="rounded text-[var(--brand)] focus:ring-[var(--brand)]"
            />
            <span>Include Counterfactual 2030 Portfolio</span>
          </label>
        </div>
      </div>

      {/* Decade Timeline Step Slider */}
      <div className="p-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)]">
        <div className="text-[10px] uppercase font-semibold text-[var(--text-muted)] tracking-wider mb-3">
          Select Temporal Anchor
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {periods.map((period, idx) => {
            const isSelected = idx === selectedYearIndex;
            return (
              <button
                key={`${period.year}-${period.is_counterfactual ? 'cf' : 'bau'}`}
                onClick={() => setSelectedYearIndex(idx)}
                className={`p-3 rounded-[5px] border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[var(--brand)] bg-[var(--brand-subtle)] shadow-xs'
                    : 'border-[var(--border)] bg-[var(--surface-2)] hover:bg-[var(--surface)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold font-mono-numbers text-[var(--text)]">
                    {period.year}
                  </span>
                  {period.is_counterfactual && (
                    <span className="text-[8px] px-1 py-0.2 rounded bg-[var(--brand)] text-white uppercase font-bold">
                      Adapt
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] mt-1">
                  {period.is_counterfactual
                    ? 'Counterfactual'
                    : period.year === 2026
                    ? 'Present State'
                    : period.year > 2026
                    ? 'Business-as-Usual'
                    : 'Historical Analog'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Multi-Domain Metric Comparison Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Temperature */}
        <div className="p-3.5 rounded-[5px] border border-[var(--border)] bg-[var(--surface)]">
          <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <Thermometer size={13} className="text-[#D15A42]" />
            Temp Anomaly
          </div>
          <div className="text-xl font-bold font-mono-numbers text-[var(--text)] mt-1.5">
            +{activePeriod.temperature_anomaly}°C
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
            vs 1981–2010 baseline
          </div>
        </div>

        {/* Rainfall Deficit */}
        <div className="p-3.5 rounded-[5px] border border-[var(--border)] bg-[var(--surface)]">
          <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <CloudRain size={13} className="text-[#3368A0]" />
            Rainfall Delta
          </div>
          <div className="text-xl font-bold font-mono-numbers text-[var(--text)] mt-1.5">
            {activePeriod.rainfall_anomaly_mm} mm
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
            Seasonal deficit
          </div>
        </div>

        {/* Water Stress */}
        <div className="p-3.5 rounded-[5px] border border-[var(--border)] bg-[var(--surface)]">
          <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <Droplets size={13} className="text-[#3368A0]" />
            Water Stress Index
          </div>
          <div className="text-xl font-bold font-mono-numbers text-[var(--text)] mt-1.5">
            {activePeriod.water_stress_index} / 100
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
            Aquifer & reservoir drawdown
          </div>
        </div>

        {/* Resilience Level */}
        <div className="p-3.5 rounded-[5px] border border-[var(--brand)]/30 bg-[var(--brand-subtle)]">
          <div className="text-[10px] uppercase tracking-wider text-[var(--brand)] font-semibold flex items-center gap-1.5">
            <Activity size={13} />
            Resilience Score
          </div>
          <div className="text-xl font-bold font-mono-numbers text-[var(--brand)] mt-1.5">
            {activePeriod.resilience_score} / 100
          </div>
          <div className="text-[10px] text-[var(--brand)] font-medium mt-0.5">
            {activePeriod.is_counterfactual ? 'With Adaptation Portfolio' : 'Observed / Simulated'}
          </div>
        </div>
      </div>

      {/* Comparison against 2015 analog */}
      <div className="p-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-3">
          <span className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
            Comparative Shift vs 2015 Super El Niño Baseline
          </span>
          <span className="text-[11px] text-[var(--text-muted)]">
            Delta Analysis
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 rounded bg-[var(--surface-2)] border border-[var(--border)]">
            <span className="text-[var(--text-muted)] text-[11px] block">Thermal Escalation:</span>
            <span className="font-bold text-[var(--text)] text-sm font-mono-numbers">
              +{(activePeriod.temperature_anomaly - baselinePeriod.temperature_anomaly).toFixed(1)}°C
            </span>
            <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">above 2015 peak heat</span>
          </div>

          <div className="p-2.5 rounded bg-[var(--surface-2)] border border-[var(--border)]">
            <span className="text-[var(--text-muted)] text-[11px] block">Population Exposure Delta:</span>
            <span className="font-bold text-[var(--text)] text-sm font-mono-numbers">
              +{((activePeriod.population_exposed - baselinePeriod.population_exposed) / 1000000).toFixed(1)}M
            </span>
            <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">demographic growth</span>
          </div>

          <div className="p-2.5 rounded bg-[var(--surface-2)] border border-[var(--border)]">
            <span className="text-[var(--text-muted)] text-[11px] block">Net Resilience Shift:</span>
            <span className={`font-bold text-sm font-mono-numbers ${activePeriod.resilience_score >= baselinePeriod.resilience_score ? 'text-[var(--brand)]' : 'text-[#D15A42]'}`}>
              {activePeriod.resilience_score >= baselinePeriod.resilience_score ? '+' : ''}
              {activePeriod.resilience_score - baselinePeriod.resilience_score} pts
            </span>
            <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">
              {activePeriod.is_counterfactual ? 'Preserved by adaptive buffers' : 'Systemic change'}
            </span>
          </div>
        </div>

        {activePeriod.is_counterfactual && (
          <div className="mt-3 p-2.5 rounded bg-[var(--brand-subtle)] border border-[var(--brand)]/30 text-xs text-[var(--brand)] flex items-center gap-2">
            <Sparkles size={14} className="shrink-0" />
            <span>
              <strong>Counterfactual Scenario:</strong> Demonstrates how strategic ₹10L–25L cooling and water portfolios arrest systemic resilience decline from 38 back to 76 despite 2.7°C global warming.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
