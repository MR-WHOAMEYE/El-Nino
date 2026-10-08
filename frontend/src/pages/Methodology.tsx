import React from 'react';
import { DataMetadataFooter } from '../components/common/DataMetadataFooter';
import { BookOpen, CheckCircle2, XCircle, AlertCircle, ArrowRight, Layers } from 'lucide-react';

export const Methodology: React.FC = () => {
  const pipeline = [
    { step: '01', title: 'Macro Climate Signals', desc: 'Ingestion of multi-basin oceanic indices (NOAA Oceanic Niño Index, Indian Ocean Dipole, ERA5 global reanalysis).' },
    { step: '02', title: 'Local Environmental Data', desc: 'Downscaling to surface level: temperature anomalies, precipitation deficits, topsoil moisture, and vegetative indices.' },
    { step: '03', title: 'Geospatial Grid & Built Environment', desc: 'PostGIS spatial join of urban heat island layers, elevation contours, piped drainage networks, and land use.' },
    { step: '04', title: 'Risk Composite Engine', desc: 'Ensemble model (XGBoost / Random Forest) estimating compounding physical risk scores from multi-parameter inputs.' },
    { step: '05', title: 'Socio-Demographic Vulnerability', desc: 'Ward-level sensitivity weights: population density, informal metal roof housing, outdoor workforce, and pediatric/elderly ratio.' },
    { step: '06', title: 'Equity Prioritization Ranking', desc: 'Mathematical equity index = normalize(Risk × Vulnerability × (1 − Adaptive Capacity)) to rank immediate intervention needs.' },
    { step: '07', title: 'Decision Support & Simulation', desc: 'Transparent policy simulator assessing risk reduction and people protected under diminishing returns constraints.' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] p-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand)] font-mono-numbers">
          <BookOpen size={16} />
          <span>SCIENTIFIC TRANSPARENCY & ASSUMPTIONS</span>
        </div>
        <h1 className="text-2xl font-semibold text-[var(--text)] mt-1">
          Platform Methodology & Decision-Support Pipeline
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1 max-w-2xl">
          CLIMA-SHIELD is an auditable decision-support system designed to translate complex climate science into equitable, localized municipal decisions. All underlying formulas, models, and boundaries are documented openly.
        </p>
      </div>

      {/* The 7-Step Pipeline */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] p-6 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text)] font-mono-numbers">
          End-to-End Analytical Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {pipeline.map((p) => (
            <div key={p.step} className="p-4 rounded-[4px] border border-[var(--border)] bg-[var(--surface-2)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono-numbers text-xs font-bold px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--brand)]">
                  STEP {p.step}
                </span>
              </div>
              <h3 className="text-xs font-bold text-[var(--text)]">{p.title}</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What the Model CAN and CANNOT Do */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Can Do */}
        <div className="border border-[var(--brand)]/40 rounded-[6px] bg-[var(--surface)] p-5 space-y-3">
          <div className="flex items-center gap-2 font-mono-numbers text-xs font-bold text-[var(--brand)] uppercase pb-2 border-b border-[var(--border)]">
            <CheckCircle2 size={16} />
            <span>WHAT THE PLATFORM DOES</span>
          </div>
          <ul className="space-y-2 text-xs text-[var(--text)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--brand)] font-bold">•</span>
              <span>Identifies spatial hotspots where compounding climate risks intersect with high human vulnerability.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--brand)] font-bold">•</span>
              <span>Provides explainable attribution (SHAP-style contribution bars) for every composite score.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--brand)] font-bold">•</span>
              <span>Allows planners to simulate policy interventions with diminishing returns before allocating budget.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--brand)] font-bold">•</span>
              <span>Enables color-independent accessibility using patterns, explicit text badges, and tabular numerals.</span>
            </li>
          </ul>
        </div>

        {/* Cannot Do */}
        <div className="border border-[var(--critical)]/40 rounded-[6px] bg-[var(--surface)] p-5 space-y-3">
          <div className="flex items-center gap-2 font-mono-numbers text-xs font-bold text-[var(--critical)] uppercase pb-2 border-b border-[var(--border)]">
            <XCircle size={16} />
            <span>WHAT THE PLATFORM DOES NOT CLAIM</span>
          </div>
          <ul className="space-y-2 text-xs text-[var(--text)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--critical)] font-bold">•</span>
              <span>Does NOT claim that El Niño directly causes localized disasters in isolation.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--critical)] font-bold">•</span>
              <span>Does NOT replace official meteorological agencies (IMD/NOAA) or emergency disaster authorities.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--critical)] font-bold">•</span>
              <span>Never guarantees absolute numeric outcomes; all scenario results are modelled projections.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--critical)] font-bold">•</span>
              <span>Never presents synthetic or prototype demo data as validated official field records.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Uncertainty Communication */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] p-5 space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text)] font-mono-numbers">
          Representation of Scientific Uncertainty
        </h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Every score and card in CLIMA-SHIELD is stamped with an explicit confidence rating (Low, Moderate, High), model version identifier, telemetry source, and demo/live flag. This ensures operational decisions reflect the stochastic nature of climate modeling rather than false certainty.
        </p>
      </div>

      <DataMetadataFooter
        source="IPCC AR6 WGII Framework & WMO Decision Support Guidelines"
        model="Methodological Documentation v1.0"
        confidence="high"
      />
    </div>
  );
};
