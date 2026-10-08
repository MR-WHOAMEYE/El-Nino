import {
  ApiResponse,
  EnsoStatus,
  RegionSummary,
  RiskExplanation,
  EquityPriority,
  SimulationInputs,
  SimulationResult,
  ResourceOptimizationRequest,
  ResourceOptimizationResult,
  AIAdviceRequest,
  AIAdviceResponse,
  Alert,
  CommunityReport
} from '../types';
import { apiClient } from './apiClient';
import {
  DEMO_ENSO_STATUS,
  DEMO_REGIONS,
  DEMO_RISK_EXPLANATION,
  DEMO_EQUITY_PRIORITIES,
  DEMO_ALERTS,
  DEMO_REPORTS,
  DEMO_SCENARIO_BASELINE,
  DEMO_RESOURCE_OPTIMIZATION,
  DEMO_AI_ADVICE
} from '../data/demoData';

export interface IDataProvider {
  getHealth(): Promise<ApiResponse<{ status: string; database: string }>>;
  getEnsoStatus(): Promise<ApiResponse<EnsoStatus>>;
  getRegions(): Promise<ApiResponse<RegionSummary[]>>;
  getRegion(id: string): Promise<ApiResponse<RegionSummary>>;
  getRiskExplanation(id: string): Promise<ApiResponse<RiskExplanation>>;
  getEquityPriorities(): Promise<ApiResponse<EquityPriority[]>>;
  runSimulation(inputs: SimulationInputs): Promise<ApiResponse<SimulationResult>>;
  optimizeResources(req: ResourceOptimizationRequest): Promise<ApiResponse<ResourceOptimizationResult>>;
  getAIAdvice(req: AIAdviceRequest): Promise<ApiResponse<AIAdviceResponse>>;
  getAlerts(): Promise<ApiResponse<Alert[]>>;
  getCommunityReports(): Promise<ApiResponse<CommunityReport[]>>;
  submitCommunityReport(report: Omit<CommunityReport, 'id' | 'timestamp'>): Promise<ApiResponse<CommunityReport>>;
}

const createDemoMeta = (confidence: 'low' | 'moderate' | 'high' = 'moderate') => ({
  timestamp: new Date().toISOString(),
  source: 'demo',
  confidence,
  model_version: 'demo-v1',
  is_demo: true,
});

export class DemoDataProvider implements IDataProvider {
  async getHealth(): Promise<ApiResponse<{ status: string; database: string }>> {
    return {
      success: true,
      data: { status: 'healthy (demo-mode)', database: 'in-memory-demo' },
      metadata: createDemoMeta('high'),
    };
  }

  async getEnsoStatus(): Promise<ApiResponse<EnsoStatus>> {
    return {
      success: true,
      data: DEMO_ENSO_STATUS,
      metadata: createDemoMeta('high'),
    };
  }

  async getRegions(): Promise<ApiResponse<RegionSummary[]>> {
    return {
      success: true,
      data: Object.values(DEMO_REGIONS),
      metadata: createDemoMeta('moderate'),
    };
  }

  async getRegion(id: string): Promise<ApiResponse<RegionSummary>> {
    const region = DEMO_REGIONS[id] || DEMO_REGIONS['TN-CHN'];
    return {
      success: true,
      data: region,
      metadata: createDemoMeta('moderate'),
    };
  }

  async getRiskExplanation(id: string): Promise<ApiResponse<RiskExplanation>> {
    const explanation = DEMO_RISK_EXPLANATION[id] || DEMO_RISK_EXPLANATION['TN-CHN'];
    return {
      success: true,
      data: explanation,
      metadata: createDemoMeta('moderate'),
    };
  }

  async getEquityPriorities(): Promise<ApiResponse<EquityPriority[]>> {
    return {
      success: true,
      data: DEMO_EQUITY_PRIORITIES,
      metadata: createDemoMeta('high'),
    };
  }

  async runSimulation(inputs: SimulationInputs): Promise<ApiResponse<SimulationResult>> {
    // Deterministic simulation formula matching Section E and Section 26
    // Diminishing returns calculation
    const coolingEffect = Math.min(18, inputs.cooling_centers * 0.9);
    const waterEffect = Math.min(15, inputs.water_capacity * 0.5);
    const healthEffect = Math.min(12, inputs.healthcare_capacity * 0.48);
    const earlyWarnEffect = Math.min(14, inputs.early_warning * 0.46);
    const treeEffect = Math.min(8, inputs.tree_cover * 0.53);

    const totalRiskReduction = Math.round(coolingEffect + waterEffect + healthEffect * 0.5 + treeEffect);
    const totalResilienceGain = Math.round(earlyWarnEffect + waterEffect * 0.6 + healthEffect + coolingEffect * 0.4);

    const baselineRisk = DEMO_SCENARIO_BASELINE.baseline_risk;
    const baselineResilience = DEMO_SCENARIO_BASELINE.baseline_resilience;
    const baselineVulnerablePop = DEMO_SCENARIO_BASELINE.baseline_vulnerable_population;

    const simulatedRisk = Math.max(20, baselineRisk - totalRiskReduction);
    const simulatedResilience = Math.min(95, baselineResilience + totalResilienceGain);

    const reductionRatio = (baselineRisk - simulatedRisk) / baselineRisk;
    const peopleProtected = Math.round(baselineVulnerablePop * reductionRatio * 1.6);
    const simulatedVulnerablePop = Math.max(5000, baselineVulnerablePop - peopleProtected);

    const result: SimulationResult = {
      baseline_risk: baselineRisk,
      simulated_risk: simulatedRisk,
      baseline_resilience: baselineResilience,
      simulated_resilience: simulatedResilience,
      baseline_vulnerable_population: baselineVulnerablePop,
      simulated_vulnerable_population: simulatedVulnerablePop,
      estimated_people_protected: peopleProtected,
      percentage_improvement: Math.round(((baselineRisk - simulatedRisk) / baselineRisk) * 1000) / 10,
      breakdown: {
        heat_reduction: Math.round(coolingEffect + treeEffect),
        water_stress_reduction: Math.round(waterEffect),
        health_pressure_reduction: Math.round(healthEffect),
        adaptive_gain: Math.round(earlyWarnEffect),
      },
    };

    return {
      success: true,
      data: result,
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'demo-simulation-engine',
        confidence: 'moderate',
        model_version: 'scenario-v1',
        is_demo: true,
      },
    };
  }

  async optimizeResources(req: ResourceOptimizationRequest): Promise<ApiResponse<ResourceOptimizationResult>> {
    // Deterministic heuristic allocation scaled by budget ratio
    const scale = req.budget / 1000000;
    const result: ResourceOptimizationResult = {
      total_budget: req.budget,
      allocations: DEMO_RESOURCE_OPTIMIZATION.allocations.map((a) => ({
        ...a,
        amount: Math.round(a.amount * scale),
        label_formatted: `₹${((a.amount * scale) / 100000).toFixed(1)}L`,
      })),
      estimated_population_protected: Math.round(DEMO_RESOURCE_OPTIMIZATION.estimated_population_protected * Math.sqrt(scale)),
      estimated_risk_reduction_points: Math.min(30, Math.round(DEMO_RESOURCE_OPTIMIZATION.estimated_risk_reduction_points * Math.sqrt(scale))),
      equity_focus: DEMO_RESOURCE_OPTIMIZATION.equity_focus,
    };

    return {
      success: true,
      data: result,
      metadata: createDemoMeta('moderate'),
    };
  }

  async getAIAdvice(_req: AIAdviceRequest): Promise<ApiResponse<AIAdviceResponse>> {
    return {
      success: true,
      data: DEMO_AI_ADVICE,
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'resilience-advisor-engine (fallback/demo)',
        confidence: 'moderate',
        model_version: 'advisor-v1',
        is_demo: true,
      },
    };
  }

  async getAlerts(): Promise<ApiResponse<Alert[]>> {
    return {
      success: true,
      data: DEMO_ALERTS,
      metadata: createDemoMeta('high'),
    };
  }

  async getCommunityReports(): Promise<ApiResponse<CommunityReport[]>> {
    return {
      success: true,
      data: DEMO_REPORTS,
      metadata: createDemoMeta('moderate'),
    };
  }

  async submitCommunityReport(report: Omit<CommunityReport, 'id' | 'timestamp'>): Promise<ApiResponse<CommunityReport>> {
    const newReport: CommunityReport = {
      ...report,
      id: `RPT-${Math.floor(200 + Math.random() * 800)}`,
      timestamp: new Date().toISOString(),
    };
    return {
      success: true,
      data: newReport,
      metadata: createDemoMeta('moderate'),
    };
  }
}

export class RealDataProvider implements IDataProvider {
  async getHealth(): Promise<ApiResponse<{ status: string; database: string }>> {
    return apiClient.get('/api/v1/health');
  }

  async getEnsoStatus(): Promise<ApiResponse<EnsoStatus>> {
    return apiClient.get('/api/v1/climate/status');
  }

  async getRegions(): Promise<ApiResponse<RegionSummary[]>> {
    return apiClient.get('/api/v1/regions');
  }

  async getRegion(id: string): Promise<ApiResponse<RegionSummary>> {
    return apiClient.get(`/api/v1/regions/${id}`);
  }

  async getRiskExplanation(id: string): Promise<ApiResponse<RiskExplanation>> {
    return apiClient.get(`/api/v1/risk/${id}/explanation`);
  }

  async getEquityPriorities(): Promise<ApiResponse<EquityPriority[]>> {
    return apiClient.get('/api/v1/equity/priorities');
  }

  async runSimulation(inputs: SimulationInputs): Promise<ApiResponse<SimulationResult>> {
    return apiClient.post('/api/v1/simulation/run', inputs);
  }

  async optimizeResources(req: ResourceOptimizationRequest): Promise<ApiResponse<ResourceOptimizationResult>> {
    return apiClient.post('/api/v1/resources/optimize', req);
  }

  async getAIAdvice(req: AIAdviceRequest): Promise<ApiResponse<AIAdviceResponse>> {
    return apiClient.post('/api/v1/ai/advice', req);
  }

  async getAlerts(): Promise<ApiResponse<Alert[]>> {
    return apiClient.get('/api/v1/alerts');
  }

  async getCommunityReports(): Promise<ApiResponse<CommunityReport[]>> {
    return apiClient.get('/api/v1/community/reports');
  }

  async submitCommunityReport(report: Omit<CommunityReport, 'id' | 'timestamp'>): Promise<ApiResponse<CommunityReport>> {
    return apiClient.post('/api/v1/community/reports', report);
  }
}

export const demoProvider = new DemoDataProvider();
export const realProvider = new RealDataProvider();
