import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { DataMetadataFooter } from '../components/common/DataMetadataFooter';
import {
  HeartPulse,
  Bed,
  MapPin,
  AlertCircle,
  ShieldAlert,
  Activity,
  Ambulance,
  Package,
  Clock,
  Thermometer,
  FileText,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface HospitalFacility {
  name: string;
  zone: string;
  occupied: number;
  total: number;
  percent: number;
  status: 'CRITICAL' | 'HIGH' | 'STABLE';
  pressure: string;
  coolingBeds: number;
  availableCoolingBeds: number;
}

interface SupplyItem {
  name: string;
  category: string;
  stockUnits: number;
  burnRatePerDay: number;
  daysRemaining: number;
  status: 'ADEQUATE' | 'GUARDED' | 'CRITICAL';
}

export const HealthcareDashboard: React.FC = () => {
  const { selectedRegion } = useAppStore();
  const [activeTab, setActiveTab] = useState<'facilities' | 'syndromic' | 'supplies' | 'dispatch'>('facilities');

  const facilities: HospitalFacility[] = [
    {
      name: 'Government Stanley Medical College Hospital',
      zone: 'North Chennai (Zone 4)',
      occupied: 42,
      total: 50,
      percent: 84,
      status: 'CRITICAL',
      pressure: '+58%',
      coolingBeds: 12,
      availableCoolingBeds: 2,
    },
    {
      name: 'Perambur Urban Community Health Center (UCHC)',
      zone: 'North Zone 3',
      occupied: 14,
      total: 15,
      percent: 93,
      status: 'CRITICAL',
      pressure: '+62%',
      coolingBeds: 4,
      availableCoolingBeds: 0,
    },
    {
      name: 'Kilpauk Medical College Emergency Unit',
      zone: 'West Central',
      occupied: 24,
      total: 30,
      percent: 80,
      status: 'HIGH',
      pressure: '+29%',
      coolingBeds: 8,
      availableCoolingBeds: 3,
    },
    {
      name: 'Royapettah Government General Hospital',
      zone: 'Central Chennai',
      occupied: 28,
      total: 35,
      percent: 80,
      status: 'HIGH',
      pressure: '+34%',
      coolingBeds: 10,
      availableCoolingBeds: 4,
    },
  ];

  const medicalSupplies: SupplyItem[] = [
    {
      name: 'IV Normal Saline (0.9% 500ml Bags)',
      category: 'Intravenous Fluids',
      stockUnits: 3400,
      burnRatePerDay: 480,
      daysRemaining: 7.1,
      status: 'GUARDED',
    },
    {
      name: 'WHO Oral Rehydration Salts (ORS Sachets)',
      category: 'Electrolytes',
      stockUnits: 14200,
      burnRatePerDay: 1200,
      daysRemaining: 11.8,
      status: 'ADEQUATE',
    },
    {
      name: 'Ice Immersion Cooling Tanks & Sheets',
      category: 'Emergency Cooling',
      stockUnits: 18,
      burnRatePerDay: 5,
      daysRemaining: 3.6,
      status: 'CRITICAL',
    },
    {
      name: 'Core Body Rectal Thermistor Probes',
      category: 'Diagnostics',
      stockUnits: 45,
      burnRatePerDay: 8,
      daysRemaining: 5.6,
      status: 'GUARDED',
    },
  ];

  const syndromicAdmissions = [
    { condition: 'Heat Exhaustion (Syncope / Dehydration)', todayCases: 74, yesterdayCases: 52, trend: '+42%', threshold: 'Exceeded' },
    { condition: 'Acute Heatstroke (Hyperthermia >40°C)', todayCases: 14, yesterdayCases: 9, trend: '+55%', threshold: 'Alert' },
    { condition: 'Exacerbated Chronic Renal / Cardiorespiratory Strain', todayCases: 38, yesterdayCases: 31, trend: '+22%', threshold: 'Alert' },
    { condition: 'Pediatric Acute Diarrheal / Dehydration Disease', todayCases: 29, yesterdayCases: 26, trend: '+11%', threshold: 'Normal' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="card-curvy p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[var(--border)] gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] text-xs font-semibold text-[var(--critical)]">
              <HeartPulse size={14} className="text-[var(--critical)]" />
              <span>CLINICAL SURGE & WET-BULB HEALTH TELEMETRY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mt-2">
              Healthcare Surge Operations Center
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1 max-w-3xl">
              Real-time heatstroke triage capacity, IV fluid buffer stocks, and hospital cooling bed availability across government healthcare facilities in {selectedRegion.name}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-[var(--critical)]/10 border border-[var(--critical)]/30 text-xs font-semibold text-[var(--critical)] uppercase font-mono-numbers">
              CODE AMBER: ACTIVE HEAT HEALTH ALERT
            </span>
          </div>
        </div>

        {/* 4 Core Health Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Thermometer size={15} className="text-[var(--critical)]" />
              <span>Heat Health Index</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono-numbers text-[var(--critical)] mt-1">
              81 <span className="text-xs font-normal text-[var(--text-muted)]">/ 100</span>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">
              Wet-bulb exceeding 30°C threshold
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Activity size={15} className="text-[var(--brand)]" />
              <span>Vulnerable Catchment Pop</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono-numbers text-[var(--brand)] mt-1">
              142K
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">
              Laborers, elderly, pediatrics
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Bed size={15} className="text-[var(--brand-secondary)]" />
              <span>Dedicated Surge Beds</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono-numbers text-[var(--text)] mt-1">
              68%
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">
              Prepared for rapid cooling protocol
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <TrendingUp size={15} className="text-[var(--critical)]" />
              <span>ER Influx Surge Rate</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono-numbers text-[var(--critical)] mt-1">
              +42%
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">
              Above 10-year seasonal baseline
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('facilities')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'facilities'
              ? 'bg-[var(--brand)] text-[var(--bg)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]'
          }`}
        >
          Hospital Bed Occupancy ({facilities.length} Facilities)
        </button>

        <button
          onClick={() => setActiveTab('syndromic')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'syndromic'
              ? 'bg-[var(--brand)] text-[var(--bg)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]'
          }`}
        >
          Syndromic Admissions Tracker
        </button>

        <button
          onClick={() => setActiveTab('supplies')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'supplies'
              ? 'bg-[var(--brand)] text-[var(--bg)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]'
          }`}
        >
          Critical Medical Supplies Buffer
        </button>

        <button
          onClick={() => setActiveTab('dispatch')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'dispatch'
              ? 'bg-[var(--brand)] text-[var(--bg)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]'
          }`}
        >
          108 Ambulance Dispatch & SOP
        </button>
      </div>

      {/* TAB 1: HOSPITAL BED OCCUPANCY BARS */}
      {activeTab === 'facilities' && (
        <div className="card-clean p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[var(--border)] gap-2">
            <div>
              <h2 className="text-base font-bold text-[var(--text)]">
                Emergency & Heat Triage Bed Occupancy
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Live census across North, Central, and West Chennai tertiary medical hospitals.
              </p>
            </div>
            <span className="text-xs font-mono-numbers text-[var(--text-muted)]">
              Census Updated: Today 11:30 IST
            </span>
          </div>

          <div className="space-y-4 pt-2">
            {facilities.map((fac) => (
              <div
                key={fac.name}
                className="p-4 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text)]">{fac.name}</h3>
                    <div className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mt-0.5 font-mono-numbers">
                      <MapPin size={12} className="text-[var(--brand)]" />
                      <span>{fac.zone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono-numbers self-end sm:self-center">
                    <span className="text-xs text-[var(--text-muted)]">
                      Occupancy: <strong className="text-[var(--text)]">{fac.occupied}/{fac.total} beds</strong> ({fac.percent}%)
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        fac.status === 'CRITICAL'
                          ? 'bg-[var(--critical)] text-white'
                          : 'bg-[var(--brand)] text-white'
                      }`}
                    >
                      {fac.status}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2.5 w-full bg-[var(--surface)] rounded-full overflow-hidden border border-[var(--border)]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${fac.percent}%`,
                      backgroundColor: fac.percent >= 90 ? 'var(--critical)' : fac.percent >= 80 ? 'var(--heat)' : 'var(--brand)',
                    }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-numbers text-[var(--text-muted)] pt-1">
                  <span>Surge Influx Pressure: <strong className="text-[var(--critical)]">{fac.pressure}</strong></span>
                  <span>
                    Rapid Immersion Cooling Beds Available: <strong className="text-[var(--brand)]">{fac.availableCoolingBeds} of {fac.coolingBeds} open</strong>
                  </span>
                  <span>Total Beds Remaining: <strong className="text-[var(--text)]">{fac.total - fac.occupied} beds</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SYNDROMIC ADMISSIONS TRACKER */}
      {activeTab === 'syndromic' && (
        <div className="card-clean p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-[var(--text)]">
              Syndromic Heat Illness Influx Surveillance
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Daily emergency department diagnoses linked to thermal wet-bulb and dehydration stress.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono-numbers">
              <thead className="bg-[var(--surface-raised)] border-b border-[var(--border)] text-[var(--text-muted)]">
                <tr>
                  <th className="p-3 pl-4">Clinical Diagnosis</th>
                  <th className="p-3">Cases Today</th>
                  <th className="p-3">Cases Yesterday</th>
                  <th className="p-3">24h Surge Delta</th>
                  <th className="p-3 pr-4">Surveillance Alert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {syndromicAdmissions.map((row) => (
                  <tr key={row.condition} className="hover:bg-[var(--surface-raised)] transition-colors">
                    <td className="p-3 pl-4 font-bold text-[var(--text)] font-sans">{row.condition}</td>
                    <td className="p-3 font-bold text-base text-[var(--text)]">{row.todayCases}</td>
                    <td className="p-3 text-[var(--text-muted)]">{row.yesterdayCases}</td>
                    <td className="p-3 text-[var(--critical)] font-bold">{row.trend}</td>
                    <td className="p-3 pr-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          row.threshold === 'Exceeded'
                            ? 'bg-[var(--critical)] text-white'
                            : row.threshold === 'Alert'
                            ? 'bg-[var(--drought)] text-white'
                            : 'bg-[var(--brand-mint)]/40 text-[var(--brand)]'
                        }`}
                      >
                        {row.threshold}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MEDICAL SUPPLIES BUFFER */}
      {activeTab === 'supplies' && (
        <div className="card-clean p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-[var(--text)]">
              Essential Rehydration & Triage Supplies Buffer
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Current hospital central stores buffer vs. active clinical burn rate under 42°C heatwave.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {medicalSupplies.map((item) => (
              <div
                key={item.name}
                className="p-5 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text)]">{item.name}</h3>
                    <div className="text-[11px] text-[var(--text-muted)]">{item.category}</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono-numbers ${
                      item.status === 'CRITICAL'
                        ? 'bg-[var(--critical)] text-white'
                        : item.status === 'GUARDED'
                        ? 'bg-[var(--drought)] text-white'
                        : 'bg-[var(--brand-mint)]/40 text-[var(--brand)]'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border)] font-mono-numbers text-xs">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block">In Stock</span>
                    <strong className="text-[var(--text)]">{item.stockUnits.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block">Daily Burn</span>
                    <strong className="text-[var(--critical)]">{item.burnRatePerDay}/day</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block">Buffer Days</span>
                    <strong className="text-[var(--brand)]">{item.daysRemaining} Days</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: 108 AMBULANCE DISPATCH & CLINICAL SOP */}
      {activeTab === 'dispatch' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-clean p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--critical)] uppercase">
              <Ambulance size={16} />
              <span>108 FLEET MOBILIZATION</span>
            </div>
            <h3 className="text-base font-bold text-[var(--text)]">
              Emergency Ambulance Dispatch Readiness
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Real-time positioning of heat-equipped ambulances and mobile rehydration vans across North Chennai cluster zones.
            </p>

            <div className="space-y-3 font-mono-numbers text-xs">
              <div className="p-3 rounded bg-[var(--surface-raised)] border border-[var(--border)] flex justify-between items-center">
                <span>Average Response Time (North Zone):</span>
                <strong className="text-[var(--brand)] font-bold">11.4 Minutes</strong>
              </div>
              <div className="p-3 rounded bg-[var(--surface-raised)] border border-[var(--border)] flex justify-between items-center">
                <span>Active Mobile Hydration Vans:</span>
                <strong className="text-[var(--text)] font-bold">6 Units Deployed</strong>
              </div>
              <div className="p-3 rounded bg-[var(--surface-raised)] border border-[var(--border)] flex justify-between items-center">
                <span>Total Heat Emergency Calls Handled:</span>
                <strong className="text-[var(--critical)] font-bold">186 Calls (Past 24h)</strong>
              </div>
            </div>
          </div>

          <div className="card-clean p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--brand)] uppercase">
              <FileText size={16} />
              <span>CLINICAL PROTOCOL SOP</span>
            </div>
            <h3 className="text-base font-bold text-[var(--text)]">
              Heatstroke Triage & Rapid Cooling Protocol
            </h3>
            <div className="space-y-2 text-xs text-[var(--text)] leading-relaxed">
              <div className="p-3 rounded bg-[var(--surface-raised)] border border-[var(--border)]">
                <strong>1. Cool First, Transport Second:</strong> Immerse patient in ice water slurry bath or mist with lukewarm water while fanning continuously. Goal: Core temp &lt;39°C within 30 mins.
              </div>
              <div className="p-3 rounded bg-[var(--surface-raised)] border border-[var(--border)]">
                <strong>2. Hemodynamic Resuscitation:</strong> Administer 1,000ml chilled Normal Saline IV bolus over 60 mins. Monitor for fluid overload in elderly patients.
              </div>
              <div className="p-3 rounded bg-[var(--surface-raised)] border border-[var(--border)]">
                <strong>3. ICU Transfer Criteria:</strong> Persistent encephalopathy, seizures, or elevated serum creatinine (&gt;2.0 mg/dL).
              </div>
            </div>
          </div>
        </div>
      )}

      <DataMetadataFooter
        source="Directorate of Public Health & Greater Chennai Corporation"
        model="Hospital Bed Occupancy & Heatstroke Telemetry v2.0"
        confidence="high"
        statusLabel="CLINICAL HEALTHCARE DATA"
      />
    </div>
  );
};
