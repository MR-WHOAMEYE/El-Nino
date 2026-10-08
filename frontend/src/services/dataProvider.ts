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
  CommunityReport,
  ConsequenceGraphData,
  InvisiblePopulationData,
  ConfidenceMetadata,
  DataBlindSpot,
  ModelCommunityConflict,
  EvidenceOverview,
  InterventionPortfolio,
  CounterfactualScenarioResult,
  ResilienceLedgerEntry,
  ResponseCapacityData,
  TimeMachineData
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
  DEMO_AI_ADVICE,
  DEMO_CONSEQUENCE_GRAPHS,
  DEMO_INVISIBLE_POPULATION,
  DEMO_CONFIDENCE_METADATA,
  DEMO_DATA_BLIND_SPOTS,
  DEMO_MODEL_COMMUNITY_CONFLICTS,
  DEMO_EVIDENCE_OVERVIEW,
  DEMO_INTERVENTION_PORTFOLIOS,
  DEMO_COUNTERFACTUAL_SCENARIOS,
  DEMO_RESILIENCE_LEDGER,
  DEMO_RESPONSE_CAPACITY,
  DEMO_TIME_MACHINE
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

  // NEW CLIMATE INTELLIGENCE LAYER METHODS
  getConsequenceGraph(regionId: string): Promise<ApiResponse<ConsequenceGraphData>>;
  getInvisiblePopulation(regionId: string): Promise<ApiResponse<InvisiblePopulationData>>;
  getConfidenceMetadata(regionId: string): Promise<ApiResponse<ConfidenceMetadata>>;
  getDataBlindSpots(regionId: string): Promise<ApiResponse<DataBlindSpot[]>>;
  getModelCommunityConflicts(regionId: string): Promise<ApiResponse<ModelCommunityConflict[]>>;
  getEvidenceOverview(regionId: string): Promise<ApiResponse<EvidenceOverview>>;
  optimizeInterventionPortfolios(budget: number, regionId?: string): Promise<ApiResponse<InterventionPortfolio[]>>;
  getCounterfactualScenario(regionId?: string): Promise<ApiResponse<CounterfactualScenarioResult>>;
  getResilienceLedger(regionId?: string): Promise<ApiResponse<ResilienceLedgerEntry[]>>;
  getResponseCapacity(regionId?: string): Promise<ApiResponse<ResponseCapacityData>>;
  getTimeMachineData(regionId?: string): Promise<ApiResponse<TimeMachineData>>;
  classifyCommunityReportNLP(text: string): Promise<ApiResponse<{
    event: string;
    severity: string;
    duration: string;
    location_extracted: string;
    affected_issue: string;
  }>>;
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

  // --- NEW CLIMATE INTELLIGENCE LAYER (DEMO IMPLEMENTATIONS) ---

  async getConsequenceGraph(regionId: string): Promise<ApiResponse<ConsequenceGraphData>> {
    const graph = DEMO_CONSEQUENCE_GRAPHS[regionId] || DEMO_CONSEQUENCE_GRAPHS['TN-CHN'];
    return {
      success: true,
      data: graph,
      metadata: createDemoMeta('high'),
    };
  }

  async getInvisiblePopulation(regionId: string): Promise<ApiResponse<InvisiblePopulationData>> {
    const data = DEMO_INVISIBLE_POPULATION[regionId] || DEMO_INVISIBLE_POPULATION['TN-CHN'];
    return {
      success: true,
      data,
      metadata: createDemoMeta('moderate'),
    };
  }

  async getConfidenceMetadata(regionId: string): Promise<ApiResponse<ConfidenceMetadata>> {
    const data = DEMO_CONFIDENCE_METADATA[regionId] || DEMO_CONFIDENCE_METADATA['TN-CHN'];
    return {
      success: true,
      data,
      metadata: createDemoMeta('high'),
    };
  }

  async getDataBlindSpots(regionId: string): Promise<ApiResponse<DataBlindSpot[]>> {
    const data = DEMO_DATA_BLIND_SPOTS[regionId] || DEMO_DATA_BLIND_SPOTS['TN-CHN'];
    return {
      success: true,
      data,
      metadata: createDemoMeta('high'),
    };
  }

  async getModelCommunityConflicts(regionId: string): Promise<ApiResponse<ModelCommunityConflict[]>> {
    const data = DEMO_MODEL_COMMUNITY_CONFLICTS[regionId] || DEMO_MODEL_COMMUNITY_CONFLICTS['TN-CHN'];
    return {
      success: true,
      data,
      metadata: createDemoMeta('moderate'),
    };
  }

  async getEvidenceOverview(regionId: string): Promise<ApiResponse<EvidenceOverview>> {
    const data = DEMO_EVIDENCE_OVERVIEW[regionId] || DEMO_EVIDENCE_OVERVIEW['TN-CHN'];
    return {
      success: true,
      data,
      metadata: createDemoMeta('moderate'),
    };
  }

  async optimizeInterventionPortfolios(budget: number, regionId?: string): Promise<ApiResponse<InterventionPortfolio[]>> {
    const target = regionId || 'TN-CHN';
    const portfolios = (DEMO_INTERVENTION_PORTFOLIOS[target] || DEMO_INTERVENTION_PORTFOLIOS['TN-CHN']).map((p) => {
      // Dynamic budget rescale if user changed budget
      const scale = budget / 1000000;
      return {
        ...p,
        allocated_budget: Math.round(p.allocated_budget * (scale > 0 ? (budget / p.target_budget) * 0.95 : 1)),
        estimated_population_protected: Math.round(p.estimated_population_protected * Math.sqrt(scale > 0 ? scale : 1)),
      };
    });

    return {
      success: true,
      data: portfolios,
      metadata: createDemoMeta('high'),
    };
  }

  async getCounterfactualScenario(regionId?: string): Promise<ApiResponse<CounterfactualScenarioResult>> {
    const target = regionId || 'TN-CHN';
    const data = DEMO_COUNTERFACTUAL_SCENARIOS[target] || DEMO_COUNTERFACTUAL_SCENARIOS['TN-CHN'];
    return {
      success: true,
      data,
      metadata: createDemoMeta('moderate'),
    };
  }

  async getResilienceLedger(regionId?: string): Promise<ApiResponse<ResilienceLedgerEntry[]>> {
    const target = regionId || 'TN-CHN';
    const data = DEMO_RESILIENCE_LEDGER[target] || DEMO_RESILIENCE_LEDGER['TN-CHN'];
    return {
      success: true,
      data,
      metadata: createDemoMeta('high'),
    };
  }

  async getResponseCapacity(regionId?: string): Promise<ApiResponse<ResponseCapacityData>> {
    const target = regionId || 'TN-CHN';
    const data = DEMO_RESPONSE_CAPACITY[target] || DEMO_RESPONSE_CAPACITY['TN-CHN'];
    return {
      success: true,
      data,
      metadata: createDemoMeta('high'),
    };
  }

  async getTimeMachineData(regionId?: string): Promise<ApiResponse<TimeMachineData>> {
    const target = regionId || 'TN-CHN';
    const data = DEMO_TIME_MACHINE[target] || DEMO_TIME_MACHINE['TN-CHN'];
    return {
      success: true,
      data,
      metadata: createDemoMeta('high'),
    };
  }

  async classifyCommunityReportNLP(text: string): Promise<ApiResponse<{
    event: string;
    severity: string;
    duration: string;
    location_extracted: string;
    affected_issue: string;
  }>> {
    const lower = text.toLowerCase();
    let event = 'Climate impact';
    let affected_issue = 'Civic infrastructure and local welfare';
    let severity = 'moderate';
    let duration = 'Recent';

    if (lower.includes('water') || lower.includes('tanker') || lower.includes('drinking') || lower.includes('tap') || lower.includes('dry')) {
      event = 'Water shortage';
      affected_issue = 'Water availability & pressure';
    } else if (lower.includes('heat') || lower.includes('temperature') || lower.includes('hot') || lower.includes('sun') || lower.includes('dizzy')) {
      event = 'Extreme heat';
      affected_issue = 'Thermal strain & cooling accessibility';
    } else if (lower.includes('flood') || lower.includes('waterlog') || lower.includes('drain') || lower.includes('canal') || lower.includes('rain')) {
      event = 'Flooding';
      affected_issue = 'Stormwater drainage & road transit';
    } else if (lower.includes('power') || lower.includes('electricity') || lower.includes('outage') || lower.includes('current')) {
      event = 'Power outage';
      affected_issue = 'Distribution feeder continuity';
    } else if (lower.includes('hospital') || lower.includes('clinic') || lower.includes('faint') || lower.includes('stroke') || lower.includes('sick')) {
      event = 'Health emergency';
      affected_issue = 'First-mile emergency care';
    }

    if (lower.includes('3 days') || lower.includes('three days') || lower.includes('4 days') || lower.includes('week')) {
      duration = '3 days';
    } else if (lower.includes('24h') || lower.includes('today') || lower.includes('hours')) {
      duration = '24 hours';
    }

    if (lower.includes('emergency') || lower.includes('severe') || lower.includes('critical') || lower.includes('died') || lower.includes('fainted') || lower.includes('collapsed') || lower.includes('no water for 3 days')) {
      severity = 'High';
    }

    return {
      success: true,
      data: {
        event,
        severity,
        duration,
        location_extracted: 'Selected community ward',
        affected_issue,
      },
      metadata: createDemoMeta('high'),
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

  // Real data client with graceful demo fallback
  async getConsequenceGraph(regionId: string): Promise<ApiResponse<ConsequenceGraphData>> {
    try {
      return await apiClient.get(`/api/v1/consequences/${regionId}/graph`);
    } catch {
      return demoProvider.getConsequenceGraph(regionId);
    }
  }

  async getInvisiblePopulation(regionId: string): Promise<ApiResponse<InvisiblePopulationData>> {
    try {
      return await apiClient.get(`/api/v1/invisible-population/${regionId}`);
    } catch {
      return demoProvider.getInvisiblePopulation(regionId);
    }
  }

  async getConfidenceMetadata(regionId: string): Promise<ApiResponse<ConfidenceMetadata>> {
    try {
      return await apiClient.get(`/api/v1/confidence/${regionId}`);
    } catch {
      return demoProvider.getConfidenceMetadata(regionId);
    }
  }

  async getDataBlindSpots(regionId: string): Promise<ApiResponse<DataBlindSpot[]>> {
    try {
      return await apiClient.get(`/api/v1/data-blindspots/${regionId}`);
    } catch {
      return demoProvider.getDataBlindSpots(regionId);
    }
  }

  async getModelCommunityConflicts(regionId: string): Promise<ApiResponse<ModelCommunityConflict[]>> {
    try {
      return await apiClient.get(`/api/v1/model-community-conflicts/${regionId}`);
    } catch {
      return demoProvider.getModelCommunityConflicts(regionId);
    }
  }

  async getEvidenceOverview(regionId: string): Promise<ApiResponse<EvidenceOverview>> {
    try {
      return await apiClient.get(`/api/v1/community/evidence/${regionId}`);
    } catch {
      return demoProvider.getEvidenceOverview(regionId);
    }
  }

  async optimizeInterventionPortfolios(budget: number, regionId?: string): Promise<ApiResponse<InterventionPortfolio[]>> {
    try {
      return await apiClient.post('/api/v1/interventions/portfolios', { budget, region_id: regionId || 'TN-CHN' });
    } catch {
      return demoProvider.optimizeInterventionPortfolios(budget, regionId);
    }
  }

  async getCounterfactualScenario(regionId?: string): Promise<ApiResponse<CounterfactualScenarioResult>> {
    try {
      return await apiClient.post('/api/v1/scenarios/counterfactual', { region_id: regionId || 'TN-CHN' });
    } catch {
      return demoProvider.getCounterfactualScenario(regionId);
    }
  }

  async getResilienceLedger(regionId?: string): Promise<ApiResponse<ResilienceLedgerEntry[]>> {
    try {
      return await apiClient.get(`/api/v1/resilience/ledger/${regionId || 'TN-CHN'}`);
    } catch {
      return demoProvider.getResilienceLedger(regionId);
    }
  }

  async getResponseCapacity(regionId?: string): Promise<ApiResponse<ResponseCapacityData>> {
    try {
      return await apiClient.get(`/api/v1/response-capacity/${regionId || 'TN-CHN'}`);
    } catch {
      return demoProvider.getResponseCapacity(regionId);
    }
  }

  async getTimeMachineData(regionId?: string): Promise<ApiResponse<TimeMachineData>> {
    try {
      return await apiClient.get(`/api/v1/climate/time-machine/${regionId || 'TN-CHN'}`);
    } catch {
      return demoProvider.getTimeMachineData(regionId);
    }
  }

  async classifyCommunityReportNLP(text: string): Promise<ApiResponse<{
    event: string;
    severity: string;
    duration: string;
    location_extracted: string;
    affected_issue: string;
  }>> {
    try {
      return await apiClient.post('/api/v1/community/classify', { text });
    } catch {
      return demoProvider.classifyCommunityReportNLP(text);
    }
  }
}

export const demoProvider = new DemoDataProvider();
export const realProvider = new RealDataProvider();

