import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import {
  ResourceOptimizationResult,
  ResourceAllocationItem,
  InterventionPortfolio,
  ResponseCapacityData
} from '../types';
import { DataMetadataFooter } from '../components/common/DataMetadataFooter';
import { ResponseCapacityMap } from '../components/intelligence/ResponseCapacityMap';
import {
  Coins,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  PieChart,
  Users,
  Building2,
  TrendingUp,
  Sparkles,
  Layers
} from 'lucide-react';
import {
  DEMO_RESOURCE_OPTIMIZATION,
  DEMO_INTERVENTION_PORTFOLIOS,
  DEMO_RESPONSE_CAPACITY
} from '../data/demoData';

export const ResourceOptimizer: React.FC = () => {
  const { selectedRegion, getProvider } = useAppStore();
  const provider = getProvider();

  const [activeTab, setActiveTab] = useState<'portfolios' | 'custom_budget' | 'response_matching'>('portfolios');
  const [budget, setBudget] = useState<number>(1000000);
  const [result, setResult] = useState<ResourceOptimizationResult>(DEMO_RESOURCE_OPTIMIZATION);
  const [portfolios, setPortfolios] = useState<InterventionPortfolio[]>(
    DEMO_INTERVENTION_PORTFOLIOS['TN-CHN']
  );
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>('PORT-BALANCED');
  const [responseCapacity, setResponseCapacity] = useState<ResponseCapacityData>(
    DEMO_RESPONSE_CAPACITY['TN-CHN']
  );
  const [loading, setLoading] = useState(false);

  const runOptimization = async (targetBudget: number) => {
    try {
      setLoading(true);
      const [optRes, portRes, capRes] = await Promise.all([
        provider.optimizeResources({ budget: targetBudget, region_id: selectedRegion.id }),
        provider.optimizeInterventionPortfolios(targetBudget, selectedRegion.id),
        provider.getResponseCapacity(selectedRegion.id),
      ]);
      if (optRes.success) setResult(optRes.data);
      if (portRes.success) setPortfolios(portRes.data);
      if (capRes.success) setResponseCapacity(capRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runOptimization(budget);
  }, [selectedRegion.id]);

  const handleBudgetChange = (newBudget: number) => {
    setBudget(newBudget);
    runOptimization(newBudget);
  };

  return (
    <div className="space-y-6">
      {/* Title & Context */}
      <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand)] font-mono-numbers">
            <Coins size={16} />
            <span>MUNICIPAL RESOURCE ALLOCATION ENGINE</span>
          </div>
          <span className="px-2 py-0.5 rounded-[3px] text-[10px] font-mono-numbers font-semibold uppercase bg-[var(--surface-2)] border border-[var(--border)] text-[var(--brand)]">
            MODELLED RECOMMENDATION
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-[var(--text)] mt-1">
          Resilience Resource Optimizer
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1 max-w-2xl">
          Enter an operational contingency budget to calculate the mathematically optimal, equity-weighted allocation across cooling infrastructure, tanker water augmentation, and primary healthcare buffers.
        </p>
      </div>

      {/* Main Mode Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-[6px] bg-[var(--surface)] border border-[var(--border)] font-mono-numbers text-xs">
        <button
          onClick={() => setActiveTab('portfolios')}
          className={`flex-1 py-2 px-3 rounded-[4px] font-semibold cursor-pointer transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'portfolios'
              ? 'bg-[var(--brand)] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
          }`}
        >
          <Sparkles size={14} />
          <span>⚡ Adaptation Portfolios (Feature 6 & 14)</span>
        </button>
        <button
          onClick={() => setActiveTab('custom_budget')}
          className={`flex-1 py-2 px-3 rounded-[4px] font-semibold cursor-pointer transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'custom_budget'
              ? 'bg-[var(--brand)] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
          }`}
        >
          <Coins size={14} />
          <span>Custom Contingency Solver</span>
        </button>
        <button
          onClick={() => setActiveTab('response_matching')}
          className={`flex-1 py-2 px-3 rounded-[4px] font-semibold cursor-pointer transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'response_matching'
              ? 'bg-[var(--brand)] text-white shadow-xs'
              : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
          }`}
        >
          <Building2 size={14} />
          <span>Response Capacity Matching (Feature 15)</span>
        </button>
      </div>

      {/* TAB 1: ADAPTATION PORTFOLIOS (Features 6 & 14) */}
      {activeTab === 'portfolios' && (
        <div className="space-y-5">
          {/* 3 Portfolios Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {portfolios.map((port) => {
              const isSelected = port.id === selectedPortfolioId;
              const isBalanced = port.name.includes('Balanced');
              return (
                <div
                  key={port.id}
                  onClick={() => setSelectedPortfolioId(port.id)}
                  className={`p-5 rounded-[6px] border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[var(--brand)] bg-[var(--brand-subtle)] shadow-xs'
                      : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                      <span className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">
                        {port.name}
                      </span>
                      {isBalanced && (
                        <span className="text-[9px] px-2 py-0.5 rounded bg-[var(--brand)] text-white font-mono-numbers font-bold">
                          RECOMMENDED
                        </span>
                      )}
                    </div>

                    <div className="mt-3">
                      <div className="text-[10px] uppercase text-[var(--text-muted)]">Target Budget</div>
                      <div className="text-2xl font-bold font-mono-numbers text-[var(--text)] mt-0.5">
                        ₹{(port.target_budget / 100000).toFixed(0)}L
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-1">{port.tag}</div>
                    </div>

                    {/* Metric Gauges */}
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[var(--border)] font-mono-numbers text-xs">
                      <div>
                        <span className="text-[10px] text-[var(--text-muted)] uppercase block">Risk Reduction</span>
                        <strong className="text-base text-[#4A8C80]">-{port.risk_reduction_percent}%</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--text-muted)] uppercase block">Equity Benefit</span>
                        <strong className="text-base text-[var(--brand)]">+{port.equity_benefit_percent}%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border)] text-[11px] text-[var(--text-muted)] flex items-center justify-between">
                    <span>Protected: <strong className="text-[var(--text)]">{port.estimated_population_protected.toLocaleString()}</strong></span>
                    <span>Confidence: <strong className="text-[var(--brand)]">{port.confidence}%</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Portfolio Details Breakdown (Feature 6 itemization) */}
          {(() => {
            const currentPort = portfolios.find((p) => p.id === selectedPortfolioId) || portfolios[1];
            return (
              <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text)] uppercase tracking-wider">
                      Portfolio Itemized Allocation • {currentPort.name}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Cost effectiveness ratio: {currentPort.cost_effectiveness_ratio} • Contingency reserve: ₹{currentPort.reserve_amount.toLocaleString()}
                    </p>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded bg-[var(--surface-2)] text-[var(--text-muted)] font-mono-numbers font-semibold">
                    Modelled Recommendation
                  </span>
                </div>

                <div className="divide-y divide-[var(--border)]">
                  {currentPort.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-[var(--text)]">{item.category}</span>
                        <p className="text-[11px] text-[var(--text-muted)]">{item.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold font-mono-numbers text-sm text-[var(--text)]">
                          ₹{(item.amount / 100000).toFixed(2)}L
                        </span>
                        <div className="text-[10px] text-[var(--text-muted)] font-mono-numbers">
                          {((item.amount / currentPort.target_budget) * 100).toFixed(0)}% of portfolio
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 3: CLIMATE RESPONSE MATCHING (Feature 15) */}
      {activeTab === 'response_matching' && (
        <ResponseCapacityMap data={responseCapacity} />
      )}

      {/* TAB 2: CUSTOM BUDGET ALLOCATION SOLVER (PRESERVED) */}
      {activeTab === 'custom_budget' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Budget Input & Presets (4 Cols) */}
        <div className="lg:col-span-4 border border-[var(--border)] rounded-[6px] bg-[var(--surface)] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text)]">
              AVAILABLE CAPITAL POOL
            </h3>
            <span className="text-[10px] font-mono-numbers text-[var(--text-muted)]">INR (₹)</span>
          </div>

          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1 font-mono-numbers">
              Contingency Allocation Amount:
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm font-mono-numbers text-[var(--text-muted)]">₹</span>
              <input
                type="number"
                step={100000}
                value={budget}
                onChange={(e) => handleBudgetChange(Math.max(100000, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 text-base font-semibold font-mono-numbers rounded-[4px] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] focus:outline-none focus:border-[var(--brand)]"
              />
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-mono-numbers uppercase text-[var(--text-muted)] block">
              STANDARD CONTINGENCY PRESETS:
            </span>
            <div className="grid grid-cols-3 gap-2 font-mono-numbers text-xs">
              <button
                onClick={() => handleBudgetChange(500000)}
                className={`py-1.5 px-2 rounded-[4px] border text-center cursor-pointer transition-colors ${
                  budget === 500000 ? 'bg-[var(--brand)] text-white border-[var(--brand)]' : 'bg-[var(--surface-2)] border-[var(--border)] hover:bg-[var(--border)]'
                }`}
              >
                ₹5.0 Lakh
              </button>
              <button
                onClick={() => handleBudgetChange(1000000)}
                className={`py-1.5 px-2 rounded-[4px] border text-center cursor-pointer transition-colors ${
                  budget === 1000000 ? 'bg-[var(--brand)] text-white border-[var(--brand)]' : 'bg-[var(--surface-2)] border-[var(--border)] hover:bg-[var(--border)]'
                }`}
              >
                ₹10.0 Lakh
              </button>
              <button
                onClick={() => handleBudgetChange(2500000)}
                className={`py-1.5 px-2 rounded-[4px] border text-center cursor-pointer transition-colors ${
                  budget === 2500000 ? 'bg-[var(--brand)] text-white border-[var(--brand)]' : 'bg-[var(--surface-2)] border-[var(--border)] hover:bg-[var(--border)]'
                }`}
              >
                ₹25.0 Lakh
              </button>
            </div>
          </div>

          <div className="p-3 rounded-[4px] bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono-numbers space-y-1">
            <div className="text-[var(--text-muted)] uppercase text-[10px]">EQUITY WEIGHTING RULE:</div>
            <div className="text-[var(--text)] font-medium">{result.equity_focus}</div>
          </div>
        </div>

        {/* Impact Summary & Allocations (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Outcome Stat Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] font-mono-numbers">
              <span className="text-[10px] uppercase text-[var(--text-muted)] block">ESTIMATED POPULATION PROTECTED</span>
              <div className="text-2xl font-bold text-[var(--text)] mt-1">
                {result.estimated_population_protected.toLocaleString()} <span className="text-xs text-[var(--brand)] font-semibold">PEOPLE</span>
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-1">Weighted by acute vulnerability index</div>
            </div>

            <div className="p-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] font-mono-numbers">
              <span className="text-[10px] uppercase text-[var(--text-muted)] block">AVERAGE RISK POINT REDUCTION</span>
              <div className="text-2xl font-bold text-[var(--brand)] mt-1">
                -{result.estimated_risk_reduction_points} <span className="text-xs text-[var(--text-muted)] font-normal">POINTS</span>
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-1">Across prioritized immediate-action wards</div>
            </div>
          </div>

          {/* Allocation Breakdown Table */}
          <div className="border border-[var(--border)] rounded-[6px] bg-[var(--surface)] overflow-hidden">
            <div className="p-3.5 border-b border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between font-mono-numbers text-xs">
              <span className="font-semibold text-[var(--text)] uppercase tracking-wider">
                RECOMMENDED HEURISTIC ALLOCATION REGISTER
              </span>
              <span className="text-[var(--text-muted)]">TOTAL: ₹{(budget / 100000).toFixed(1)} LAKHS</span>
            </div>

            <div className="divide-y divide-[var(--border)]">
              {result.allocations.map((alloc: ResourceAllocationItem) => (
                <div key={alloc.category} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="font-semibold text-[var(--text)] text-sm">{alloc.category}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{alloc.expected_impact}</div>
                  </div>
                  <div className="flex items-center gap-4 font-mono-numbers self-end sm:self-center">
                    <div className="text-right">
                      <div className="font-bold text-sm text-[var(--text)]">{alloc.label_formatted}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{alloc.percentage}% of budget</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}

      <DataMetadataFooter
        source="Municipal Disaster Management Allocation Heuristic"
        model="Cost-Benefit Linear Solver (v1.1)"
        confidence="moderate"
        statusLabel="MODELLED RECOMMENDATION"
      />
    </div>
  );
};
