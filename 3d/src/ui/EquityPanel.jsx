import React from 'react';
import { useSimStore } from '../store/useSimStore.js';
import { INTERVENTION_CATALOG } from '../simulation/counterfactual.js';
import { Scale, Sliders, DollarSign, RefreshCw, ShieldCheck } from 'lucide-react';

export default function EquityPanel() {
  const equityWeights = useSimStore((state) => state.equityWeights);
  const setEquityWeights = useSimStore((state) => state.setEquityWeights);
  const equityMetrics = useSimStore((state) => state.equityMetrics);
  const evaluatedDistricts = useSimStore((state) => state.evaluatedDistricts);
  const selectedInterventionId = useSimStore((state) => state.selectedInterventionId);
  const setSelectedIntervention = useSimStore((state) => state.setSelectedIntervention);
  const policyBudget = useSimStore((state) => state.policyBudget);
  const setPolicyBudget = useSimStore((state) => state.setPolicyBudget);
  const budgetAllocationResult = useSimStore((state) => state.budgetAllocationResult);
  const beforeAfterMode = useSimStore((state) => state.beforeAfterMode);
  const setBeforeAfterMode = useSimStore((state) => state.setBeforeAfterMode);
  const stabilityReport = useSimStore((state) => state.stabilityReport);
  const runStabilityTest = useSimStore((state) => state.runStabilityTest);

  const selectedIntervention = INTERVENTION_CATALOG.find(i => i.id === selectedInterventionId) || INTERVENTION_CATALOG[0];

  // SVG Lorenz curve points
  const lorenzPoints = React.useMemo(() => {
    if (!equityMetrics?.lorenzCurve) return '';
    const width = 220;
    const height = 90;
    const pad = 8;
    return equityMetrics.lorenzCurve.map((pt) => {
      const x = pad + (pt.popShare / 100) * (width - pad * 2);
      const y = height - pad - (pt.damageShare / 100) * (height - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }, [equityMetrics?.lorenzCurve]);

  return (
    <div className="space-y-4 text-xs select-none">
      {/* 1. Equity & Vulnerability Weighting Sliders */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-slate-200 font-semibold">
          <span className="flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            <span>Vulnerability Formula Weights</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Customizable</span>
        </div>

        <div className="space-y-2 text-[11px]">
          <div>
            <div className="flex justify-between text-slate-400 mb-0.5">
              <span>Poverty Rate</span>
              <span className="font-mono text-slate-200">{(equityWeights.poverty * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.05"
              value={equityWeights.poverty}
              onChange={(e) => setEquityWeights({ poverty: parseFloat(e.target.value) })}
              className="w-full accent-sky-500 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-0.5">
              <span>Agrarian / Crop Dependence</span>
              <span className="font-mono text-slate-200">{(equityWeights.cropDependence * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.05"
              value={equityWeights.cropDependence}
              onChange={(e) => setEquityWeights({ cropDependence: parseFloat(e.target.value) })}
              className="w-full accent-sky-500 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-0.5">
              <span>Irrigation Deficit (1 - Coverage)</span>
              <span className="font-mono text-slate-200">{(equityWeights.irrigationDeficit * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.05"
              value={equityWeights.irrigationDeficit}
              onChange={(e) => setEquityWeights({ irrigationDeficit: parseFloat(e.target.value) })}
              className="w-full accent-sky-500 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-0.5">
              <span>Housing & Infrastructure Fragility</span>
              <span className="font-mono text-slate-200">{(equityWeights.housingFragility * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.8"
              step="0.05"
              value={equityWeights.housingFragility}
              onChange={(e) => setEquityWeights({ housingFragility: parseFloat(e.target.value) })}
              className="w-full accent-sky-500 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 2. Side-by-Side Equity Metrics & Lorenz Curve */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-slate-200 font-semibold">
          <span className="flex items-center space-x-1.5">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Equity Gap & Inequality</span>
          </span>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
            Gini: {equityMetrics.giniCoefficient}
          </span>
        </div>

        {/* Comparison Bars */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-900 p-2 rounded border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Average Population Risk</span>
            <span className="text-sm font-mono font-bold text-slate-200">{equityMetrics.averageRisk}</span>
          </div>
          <div className="bg-slate-900 p-2 rounded border border-slate-800">
            <span className="text-[10px] text-amber-400/90 block mb-0.5">Bottom 20% Vulnerable</span>
            <span className="text-sm font-mono font-bold text-amber-400">{equityMetrics.vulnerable20Risk}</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800/60">
          Vulnerable communities face <span className="font-bold text-amber-400 font-mono">{equityMetrics.equityGapRatio}x</span> higher risk than the population average under this climate state.
        </div>

        {/* Lorenz Inequality Chart */}
        <div className="space-y-1">
          <div className="text-[10px] text-slate-400 font-medium">Lorenz Curve (Population vs Climate Damage):</div>
          <div className="h-28 w-full bg-slate-900/80 rounded border border-slate-800 p-2 flex flex-col justify-center">
            <svg viewBox="0 0 220 90" className="w-full h-full overflow-visible">
              {/* Equality 45 degree line */}
              <line x1="8" y1="82" x2="212" y2="8" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
              {/* Lorenz curve */}
              {lorenzPoints && (
                <polyline
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={lorenzPoints}
                />
              )}
            </svg>
          </div>
        </div>
      </div>


      {/* 3. Counterfactual Policy Interventions & Budget Allocator */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-slate-200 font-semibold">
          <span className="flex items-center space-x-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Counterfactual Budget Allocator</span>
          </span>
          {/* Before / After 3D Toggle */}
          <div className="flex bg-slate-900 rounded p-0.5 border border-slate-800 text-[10px]">
            <button
              onClick={() => setBeforeAfterMode('before')}
              className={`px-2 py-0.5 rounded font-medium ${
                beforeAfterMode === 'before' ? 'bg-rose-950 text-rose-300' : 'text-slate-400'
              }`}
            >
              Before
            </button>
            <button
              onClick={() => setBeforeAfterMode('after')}
              className={`px-2 py-0.5 rounded font-medium ${
                beforeAfterMode === 'after' ? 'bg-emerald-950 text-emerald-300' : 'text-slate-400'
              }`}
            >
              After Action
            </button>
          </div>
        </div>

        {/* Intervention Selection */}
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Select Resilience Intervention:</label>
          <select
            value={selectedInterventionId}
            onChange={(e) => setSelectedIntervention(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            {INTERVENTION_CATALOG.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} ({i.category}) — ₹{i.costPerPerson}/person
              </option>
            ))}
          </select>
        </div>

        {/* Budget Slider */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
            <span>Funding Pool:</span>
            <span className="font-mono text-emerald-400 font-bold">₹{policyBudget} Million INR</span>
          </div>
          <input
            type="range"
            min="50"
            max="1500"
            step="50"
            value={policyBudget}
            onChange={(e) => setPolicyBudget(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>

        {/* Budget Allocation Result Card */}
        {budgetAllocationResult && (
          <div className="bg-slate-900/90 p-2.5 rounded border border-slate-800 space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Districts Fully Funded:</span>
              <span className="font-mono font-bold text-emerald-400">
                {budgetAllocationResult.fundedCount} of {evaluatedDistricts.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Equity Gap Reduction:</span>
              <span className="font-mono font-bold text-sky-400">
                -{budgetAllocationResult.equityGapImprovement}x
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Gini Improvement:</span>
              <span className="font-mono font-bold text-sky-400">
                -{budgetAllocationResult.giniImprovement}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 4. 200x Monte Carlo Stability Stress Test */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-slate-200 font-semibold">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Decision Robustness (200x MC Test)</span>
          </span>
          <button
            onClick={runStabilityTest}
            className="px-2 py-1 rounded bg-sky-950 hover:bg-sky-900 border border-sky-800 text-sky-300 text-[10px] font-semibold flex items-center space-x-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Run Test</span>
          </button>
        </div>

        <p className="text-[10px] text-slate-400 leading-normal">
          Perturbs socio-economic weights and ENSO forecast uncertainty across 200 Monte Carlo runs to evaluate recommendation consistency.
        </p>

        {stabilityReport && (
          <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
            {Object.values(stabilityReport).map((res) => (
              <div key={res.districtId} className="flex items-center justify-between bg-slate-900 px-2 py-1 rounded text-[10px]">
                <span className="text-slate-300 font-medium">{res.name}</span>
                <span
                  className={`font-mono font-bold ${
                    res.isStable ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  Top 3 in {res.top3Percentage}% runs
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
