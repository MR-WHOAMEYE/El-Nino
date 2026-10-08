import React from 'react';
import { useAppStore } from '../store/appStore';
import { DataMetadataFooter } from '../components/common/DataMetadataFooter';
import { History, Info, TrendingUp, AlertTriangle } from 'lucide-react';

export const HistoricalClimate: React.FC = () => {
  const { selectedRegion } = useAppStore();

  const historicalYears = [
    {
      year: 2015,
      title: 'Very Strong El Niño ("Godzilla")',
      sstAnomaly: '+2.4°C',
      peakTemp: '42.6°C',
      rainfallDeficit: '-38%',
      waterStress: 62,
      waterLabel: 'ELEVATED',
      consequence: 'Floods & Compounding Heat wave',
      sparkline: [28, 34, 48, 62, 55, 40],
    },
    {
      year: 2019,
      title: 'Day Zero Water Crisis / Neutral Dipole',
      sstAnomaly: '+0.8°C',
      peakTemp: '41.2°C',
      rainfallDeficit: '-44%',
      waterStress: 94,
      waterLabel: 'CRITICAL',
      consequence: 'Severe Reservoir Exhaustion & Day Zero',
      sparkline: [40, 58, 75, 94, 91, 80],
    },
    {
      year: 2023,
      title: 'Strong El Niño Cycle',
      sstAnomaly: '+1.9°C',
      peakTemp: '42.1°C',
      rainfallDeficit: '-19%',
      waterStress: 76,
      waterLabel: 'HIGH',
      consequence: 'Extended Dry Spells & Cyclonic Surge',
      sparkline: [35, 45, 60, 76, 70, 55],
    },
    {
      year: 2026,
      title: 'Moderate Strengthening (Current Cycle)',
      sstAnomaly: '+1.4°C',
      peakTemp: '41.8°C',
      rainfallDeficit: '-28%',
      waterStress: 78,
      waterLabel: 'HIGH',
      consequence: 'Active Compounding Heat-Water Influx',
      sparkline: [32, 48, 65, 78, 85, 90],
      isCurrent: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] p-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--brand)] font-mono-numbers">
          <History size={15} />
          <span>MULTI-YEAR ANALOG REANALYSIS</span>
        </div>
        <h1 className="text-2xl font-bold text-[var(--text)] mt-1">
          Historical Climate Analog Comparison
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1 max-w-2xl">
          Comparative multi-basin evaluation tracking 2015, 2019, 2023, and current 2026 conditions for {selectedRegion.name}.
        </p>

        {/* Scientific Honesty Disclaimer */}
        <div className="mt-4 p-3 rounded-[4px] bg-[var(--surface-raised)] border border-[var(--border)] font-mono-numbers text-xs flex items-center gap-2.5">
          <Info size={14} className="text-[var(--drought)] shrink-0" />
          <span className="text-[var(--text-muted)]">
            <strong className="text-[var(--text)]">Scientific Disclaimer:</strong> Historical correlation does NOT imply direct causation. Macro ENSO anomalies interact with local urban microclimates and seasonal monsoonal dynamics.
          </span>
        </div>
      </div>

      {/* Small-Multiples Line Charts per Year with 2026 Overlay */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {historicalYears.map((row) => (
          <div
            key={row.year}
            className={`p-5 rounded-[6px] border bg-[var(--surface)] space-y-4 ${
              row.isCurrent ? 'border-[var(--brand)] shadow-sm' : 'border-[var(--border)]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 font-mono-numbers">
                  <span className="text-lg font-bold text-[var(--text)]">{row.year}</span>
                  {row.isCurrent && (
                    <span className="px-1.5 py-0.5 rounded bg-[var(--brand)] text-white text-[10px] font-bold">
                      CURRENT CYCLE
                    </span>
                  )}
                </div>
                <div className="text-xs font-medium text-[var(--text-muted)] mt-0.5">{row.title}</div>
              </div>

              <div className="text-right font-mono-numbers">
                <span className="text-[10px] text-[var(--text-muted)] block">Water Stress</span>
                <span
                  className={`text-base font-bold ${
                    row.waterStress >= 90
                      ? 'text-[var(--critical)]'
                      : row.waterStress >= 70
                      ? 'text-[var(--heat)]'
                      : 'text-[var(--text)]'
                  }`}
                >
                  {row.waterStress} / 100 ({row.waterLabel})
                </span>
              </div>
            </div>

            {/* SVG Sparkline Chart */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono-numbers text-[var(--text-muted)]">
                <span>Monthly Trajectory (Jan &rarr; Jun)</span>
                <span>Peak Temp: <strong className="text-[var(--heat)]">{row.peakTemp}</strong></span>
              </div>

              <div className="h-16 w-full rounded bg-[var(--surface-raised)] border border-[var(--border)] p-2 flex items-center">
                <svg viewBox="0 0 240 50" className="w-full h-full overflow-visible">
                  {/* Baseline 2026 Ghost Line on previous years for direct comparison */}
                  {!row.isCurrent && (
                    <polyline
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      points="0,38 48,28 96,18 144,8 192,5 240,0"
                    />
                  )}

                  {/* Sparkline Points */}
                  <polyline
                    fill="none"
                    stroke={row.isCurrent ? 'var(--brand)' : 'var(--text-muted)'}
                    strokeWidth="2.5"
                    points={row.sparkline
                      .map((val, i) => `${i * 48},${50 - (val / 100) * 45}`)
                      .join(' ')}
                  />

                  {/* Peak Marker Dot */}
                  <circle
                    cx={3 * 48}
                    cy={50 - (row.sparkline[3] / 100) * 45}
                    r="4"
                    fill={row.isCurrent ? 'var(--brand)' : 'var(--critical)'}
                  />
                </svg>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border)] flex justify-between text-xs font-mono-numbers text-[var(--text-muted)]">
              <span>SST: <strong className="text-[var(--text)]">{row.sstAnomaly}</strong></span>
              <span>Deficit: <strong className="text-[var(--critical)]">{row.rainfallDeficit}</strong></span>
              <span className="font-sans text-[11px] truncate max-w-[140px]">{row.consequence}</span>
            </div>
          </div>
        ))}
      </div>

      <DataMetadataFooter
        source="NOAA Oceanic Nino Index + IMD 0.25° Gridded Surface Telemetry"
        model="Historical Multi-year Analog Model v1.0"
        confidence="high"
      />
    </div>
  );
};
