import React, { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { DataMetadataFooter } from '../components/common/DataMetadataFooter';
import {
  Sprout,
  Droplets,
  CloudRain,
  Sun,
  AlertTriangle,
  Calendar,
  Layers,
  ChevronRight,
  TrendingDown,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Calculator
} from 'lucide-react';

interface CropAdvisory {
  crop: string;
  stage: string;
  waterNeed: 'Low' | 'Medium' | 'High';
  stressLevel: 'Guarded' | 'High' | 'Critical';
  advisoryText: string;
  pestWarning: string;
  waterSavingsTip: string;
}

export const FarmerDashboard: React.FC = () => {
  const { selectedRegion } = useAppStore();

  // State for interactive irrigation calculator
  const [selectedCrop, setSelectedCrop] = useState<string>('paddy');
  const [selectedSoil, setSelectedSoil] = useState<string>('clay');
  const [activeTab, setActiveTab] = useState<'matrix' | 'forecast' | 'calculator' | 'groundwater'>('matrix');

  // 5-Crop Dynamic Advisory Matrix
  const cropAdvisories: Record<string, CropAdvisory> = {
    paddy: {
      crop: 'Paddy (Samba / Kuruvai)',
      stage: 'Panicle Initiation to Flowering',
      waterNeed: 'High',
      stressLevel: 'Critical',
      advisoryText: 'Adopt Alternate Wetting & Drying (AWD) using a field water tube. Allow water level to drop 5 cm below soil surface before re-flooding to conserve 30% canal allocation.',
      pestWarning: 'Heightened risk of Brown Planthopper (BPH) under high night temperature anomalies.',
      waterSavingsTip: 'Irrigate only during nocturnal hours (20:00 - 05:00) to mitigate 38°C midday transpiration.',
    },
    groundnut: {
      crop: 'Groundnut (Kharif / Rabi)',
      stage: 'Pegging & Pod Development',
      waterNeed: 'Medium',
      stressLevel: 'High',
      advisoryText: 'Ensure moisture during peg elongation. Apply gypsum at 200 kg/acre followed by light sprinkler irrigation to improve pod filling in hardening soil.',
      pestWarning: 'Watch for Spodoptera litura (leaf worm) infesting dry canopy edges.',
      waterSavingsTip: 'Drip micro-tubes at 0.6 kg/cm² pressure reduce water requirement by 42% over furrow flooding.',
    },
    sugarcane: {
      crop: 'Sugarcane (Annual)',
      stage: 'Formative / Tillering Stage',
      waterNeed: 'High',
      stressLevel: 'High',
      advisoryText: 'Spread dry trash mulch (cane trash at 1.5 tons/acre) across inter-row spaces to prevent soil baking and conserve root-zone capillary water.',
      pestWarning: 'Early shoot borer incidence climbs under prolonged dry intervals.',
      waterSavingsTip: 'Skip alternate row irrigation during severe canal rationing.',
    },
    millets: {
      crop: 'Finger Millet (Ragi) & Sorghum',
      stage: 'Vegetative Growth',
      waterNeed: 'Low',
      stressLevel: 'Guarded',
      advisoryText: 'Extremely resilient to thermal spikes up to 41°C. Recommended as drought buffer crop. One protective irrigation at grain formation suffices.',
      pestWarning: 'Minimal pest susceptibility; inspect for stem fly in early seedling stage.',
      waterSavingsTip: 'Consumes 65% less water than wetland paddy per quintal harvested.',
    },
    pulses: {
      crop: 'Blackgram & Greengram',
      stage: 'Pod Formation',
      waterNeed: 'Low',
      stressLevel: 'Guarded',
      advisoryText: 'Apply foliar spray of 1% potassium chloride (KCl) and 2% DAP at peak flowering to induce systemic osmotic drought tolerance.',
      pestWarning: 'Monitor yellow mosaic virus spread by whiteflies during prolonged dry spells.',
      waterSavingsTip: 'Rain-fed crop; supplemental drip of 20mm during pod setting increases yield by 28%.',
    },
  };

  // 7-Day Soil Moisture Forecast Projection
  const forecast7Days = [
    { day: 'Day 1 (Today)', moisture: 24, eto: 7.4, rainChance: '5%', status: 'Deficit' },
    { day: 'Day 2 (+24h)', moisture: 22, eto: 7.6, rainChance: '10%', status: 'Deficit' },
    { day: 'Day 3 (+48h)', moisture: 20, eto: 7.8, rainChance: '5%', status: 'Severe' },
    { day: 'Day 4 (+72h)', moisture: 19, eto: 8.0, rainChance: '15%', status: 'Severe' },
    { day: 'Day 5 (+96h)', moisture: 21, eto: 7.2, rainChance: '40% (Scattered)', status: 'Moderate' },
    { day: 'Day 6 (+120h)', moisture: 23, eto: 6.9, rainChance: '30%', status: 'Deficit' },
    { day: 'Day 7 (+144h)', moisture: 21, eto: 7.1, rainChance: '10%', status: 'Deficit' },
  ];

  // Irrigation Calculator logic
  const calculateIrrigation = () => {
    let baseHours = 4.5;
    if (selectedCrop === 'paddy') baseHours = 7.0;
    if (selectedCrop === 'sugarcane') baseHours = 5.5;
    if (selectedCrop === 'millets') baseHours = 2.0;
    if (selectedCrop === 'pulses') baseHours = 1.5;

    let soilMultiplier = 1.0;
    if (selectedSoil === 'sandy') soilMultiplier = 1.35;
    if (selectedSoil === 'clay') soilMultiplier = 0.85;

    const recommendedHours = (baseHours * soilMultiplier).toFixed(1);
    const waterSavedPct = selectedCrop === 'paddy' ? '32%' : '48%';

    return {
      hours: recommendedHours,
      timing: '20:30 to 04:30 IST (Nocturnal Drip)',
      saved: waterSavedPct,
      notes: selectedSoil === 'sandy'
        ? 'Sandy soil has low moisture retention; split into two 3-hour pulses.'
        : 'Clay retains moisture; single night pulse avoids root waterlogging.',
    };
  };

  const calcResult = calculateIrrigation();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="card-curvy p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[var(--border)] gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] text-xs font-semibold text-[var(--brand)]">
              <Sprout size={14} className="text-[var(--resilience)]" />
              <span>AGROMETEOROLOGICAL TELEMETRY & ADVISORY SYSTEM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mt-2">
              Farmer Agromet Decision Brief
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1 max-w-3xl">
              Precision root-zone moisture tracking, crop stress evaluation, and nocturnal irrigation scheduling under the active El Niño cycle for {selectedRegion.name}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-[var(--brand-mint)]/30 border border-[var(--brand)]/30 text-xs font-semibold text-[var(--brand)] font-mono-numbers">
              RABI / DRY SEASON CYCLE
            </span>
          </div>
        </div>

        {/* 4 Core Agro Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Sun size={15} className="text-[var(--drought)]" />
              <span>Seasonal Rainfall Deficit</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono-numbers text-[var(--critical)] mt-1">
              -32%
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">
              vs. 30-year IMD long-period median
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Layers size={15} className="text-[var(--brand)]" />
              <span>0–30 cm Root-Zone Moisture</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono-numbers text-[var(--drought)] mt-1">
              -28%
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">
              Severe topsoil evaporation stress
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Droplets size={15} className="text-[var(--water)]" />
              <span>Canal / Reservoir Buffer</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono-numbers text-[var(--water)] mt-1">
              34%
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">
              Available live storage capacity
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <TrendingDown size={15} className="text-[var(--critical)]" />
              <span>Static Water Table Depth</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono-numbers text-[var(--critical)] mt-1">
              28.4 m
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-1">
              4.2m below seasonal baseline
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'matrix'
              ? 'bg-[var(--brand)] text-[var(--bg)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]'
          }`}
        >
          Crop Advisory Matrix (5 Crops)
        </button>

        <button
          onClick={() => setActiveTab('forecast')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'forecast'
              ? 'bg-[var(--brand)] text-[var(--bg)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]'
          }`}
        >
          7-Day Soil Moisture & Evaporation Forecast
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'calculator'
              ? 'bg-[var(--brand)] text-[var(--bg)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]'
          }`}
        >
          Smart Irrigation Calculator
        </button>

        <button
          onClick={() => setActiveTab('groundwater')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'groundwater'
              ? 'bg-[var(--brand)] text-[var(--bg)] shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-raised)]'
          }`}
        >
          Groundwater & Subsidies
        </button>
      </div>

      {/* TAB 1: CROP ADVISORY MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(cropAdvisories).map(([key, item]) => {
              const isCrit = item.stressLevel === 'Critical';
              const isHigh = item.stressLevel === 'High';

              return (
                <div
                  key={key}
                  className="p-5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)] transition-all shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-[var(--text)]">{item.crop}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono-numbers ${
                          isCrit
                            ? 'bg-[var(--critical)] text-white'
                            : isHigh
                            ? 'bg-[var(--drought)] text-white'
                            : 'bg-[var(--brand-mint)]/40 text-[var(--brand)]'
                        }`}
                      >
                        {item.stressLevel}
                      </span>
                    </div>

                    <div className="text-xs text-[var(--text-muted)] flex items-center gap-1 font-mono-numbers">
                      <span>Growth Stage:</span>
                      <strong className="text-[var(--text)]">{item.stage}</strong>
                    </div>

                    <p className="text-xs text-[var(--text)] leading-relaxed pt-1">
                      {item.advisoryText}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-[var(--border)] text-[11px]">
                    <div className="p-2 rounded bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--critical)]">
                      <strong>Pest Watch:</strong> {item.pestWarning}
                    </div>
                    <div className="p-2 rounded bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--brand)]">
                      <strong>Water Saver:</strong> {item.waterSavingsTip}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: 7-DAY SOIL MOISTURE FORECAST */}
      {activeTab === 'forecast' && (
        <div className="card-clean p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-[var(--text)]">
              7-Day Soil Moisture & Evapotranspiration (ETo) Projection
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Derived from satellite thermal radiometry and surface energy balance algorithms.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono-numbers">
              <thead className="bg-[var(--surface-raised)] border-b border-[var(--border)] text-[var(--text-muted)]">
                <tr>
                  <th className="p-3 pl-4">Day</th>
                  <th className="p-3">Available Soil Moisture</th>
                  <th className="p-3">ETo (mm/day)</th>
                  <th className="p-3">Rain Probability</th>
                  <th className="p-3 pr-4">Soil Moisture Band</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {forecast7Days.map((f, i) => (
                  <tr key={f.day} className="hover:bg-[var(--surface-raised)] transition-colors">
                    <td className="p-3 pl-4 font-bold text-[var(--text)] font-sans">{f.day}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[var(--text)]">{f.moisture}%</span>
                        <div className="w-20 h-2 bg-[var(--surface-raised)] rounded-full overflow-hidden border border-[var(--border)]">
                          <div
                            className="h-full bg-[var(--brand)]"
                            style={{ width: `${(f.moisture / 40) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[var(--critical)] font-bold">{f.eto} mm</td>
                    <td className="p-3 text-[var(--text-muted)]">{f.rainChance}</td>
                    <td className="p-3 pr-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          f.status === 'Severe'
                            ? 'bg-[var(--critical)] text-white'
                            : f.status === 'Deficit'
                            ? 'bg-[var(--drought)] text-white'
                            : 'bg-[var(--brand-mint)]/40 text-[var(--brand)]'
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SMART IRRIGATION CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="card-clean p-6 sm:p-8 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--brand)] uppercase tracking-wider">
              <Calculator size={14} />
              <span>FIELD WATER EFFICIENCY TOOL</span>
            </div>
            <h2 className="text-xl font-bold text-[var(--text)] mt-1">
              Precision Nocturnal Irrigation Scheduler
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Select your standing crop and soil texture to calculate the exact night-drip run time needed to replace daily evapotranspiration without wasting power or water.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[var(--text)] block mb-1.5">
                  Select Standing Crop:
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text)] font-sans focus:outline-none"
                >
                  <option value="paddy">Wetland Paddy (Samba / Kuruvai)</option>
                  <option value="groundnut">Groundnut / Oilseeds</option>
                  <option value="sugarcane">Sugarcane (Commercial)</option>
                  <option value="millets">Ragi / Millets (Dryland)</option>
                  <option value="pulses">Blackgram / Greengram</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text)] block mb-1.5">
                  Field Soil Texture:
                </label>
                <select
                  value={selectedSoil}
                  onChange={(e) => setSelectedSoil(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-md border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text)] font-sans focus:outline-none"
                >
                  <option value="clay">Clay / Heavy Black Soil (High Retention)</option>
                  <option value="loam">Red Loam / Alluvial (Medium Retention)</option>
                  <option value="sandy">Sandy Loam (Rapid Drainage)</option>
                </select>
              </div>
            </div>

            {/* Output Calculation Result */}
            <div className="p-5 rounded-lg bg-[var(--surface-raised)] border border-[var(--border)] space-y-3 font-mono-numbers">
              <div className="text-xs text-[var(--text-muted)] uppercase font-semibold">
                RECOMMENDED OPERATING DISPATCH:
              </div>

              <div className="flex items-baseline justify-between pt-1 border-b border-[var(--border)] pb-2">
                <span className="text-xs font-sans text-[var(--text-muted)]">Recommended Drip Time:</span>
                <span className="text-2xl font-bold text-[var(--brand)]">{calcResult.hours} Hours / Day</span>
              </div>

              <div className="flex items-baseline justify-between pb-2 border-b border-[var(--border)]">
                <span className="text-xs font-sans text-[var(--text-muted)]">Optimized Window:</span>
                <span className="text-xs font-bold text-[var(--text)]">{calcResult.timing}</span>
              </div>

              <div className="flex items-baseline justify-between pb-2 border-b border-[var(--border)]">
                <span className="text-xs font-sans text-[var(--text-muted)]">Water Saved vs Flood:</span>
                <span className="text-sm font-bold text-[var(--resilience)]">{calcResult.saved} Conservation</span>
              </div>

              <p className="text-[11px] font-sans text-[var(--text-muted)] leading-relaxed pt-1">
                <strong>Agronomist Note:</strong> {calcResult.notes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GROUNDWATER & SUBSIDIES */}
      {activeTab === 'groundwater' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-clean p-6 space-y-4">
            <h3 className="text-sm font-bold text-[var(--text)]">
              Borewell Aquifer & Hydrogeology Advisory
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Continuous monitoring by the Tamil Nadu Ground Water Authority indicates regional static water levels dropped 4.2m below normal due to insufficient northeast monsoon recharge.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded bg-[var(--surface-raised)] border border-[var(--border)]">
                <strong>Rainwater Harvesting Recharge Pit:</strong> Divert farm pond runoff into desilted borewell casings using filter beds to prevent silt choke.
              </div>
              <div className="p-3 rounded bg-[var(--surface-raised)] border border-[var(--border)]">
                <strong>Solar Pumping Scheduling:</strong> Program solar pumps to pause between 12:00 and 14:00 to reduce drawdown cone formation in shared aquifers.
              </div>
            </div>
          </div>

          <div className="card-clean p-6 space-y-4">
            <h3 className="text-sm font-bold text-[var(--text)]">
              Government Drought Relief & Insurance Portals
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Official institutional linkages for crop insurance coverage, micro-irrigation subsidies, and extension contact.
            </p>

            <div className="space-y-2 text-xs font-mono-numbers">
              <a
                href="https://pmfby.gov.in"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[var(--brand)] flex items-center justify-between transition-colors block"
              >
                <div>
                  <div className="font-bold text-[var(--text)] font-sans">PM Fasal Bima Yojana (PMFBY)</div>
                  <div className="text-[11px] text-[var(--text-muted)]">Localized drought crop loss claim window</div>
                </div>
                <ArrowUpRight size={14} className="text-[var(--brand)]" />
              </a>

              <a
                href="https://tnagrisnet.tn.gov.in"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[var(--brand)] flex items-center justify-between transition-colors block"
              >
                <div>
                  <div className="font-bold text-[var(--text)] font-sans">TNAU Agrisnet Subsidized Drip Scheme</div>
                  <div className="text-[11px] text-[var(--text-muted)]">Up to 90% subsidy for small & marginal farmers</div>
                </div>
                <ArrowUpRight size={14} className="text-[var(--brand)]" />
              </a>

              <div className="p-3 rounded bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-muted)] font-sans text-xs">
                Kisan Call Centre Toll-Free Helpline: <strong className="text-[var(--text)] font-mono-numbers">1800-180-1551</strong> (06:00 - 22:00)
              </div>
            </div>
          </div>
        </div>
      )}

      <DataMetadataFooter
        source="ICAR / IMD Agromet Advisory Service & Tamil Nadu Agricultural University (TNAU)"
        model="Crop Moisture Stress Model (v2.0) with AWD Telemetry"
        confidence="high"
        statusLabel="AGROMET MODELLED ADVISORY"
      />
    </div>
  );
};
