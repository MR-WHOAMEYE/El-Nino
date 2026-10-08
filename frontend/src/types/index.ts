export type UserRole = 'Government' | 'Citizen' | 'Farmer' | 'Healthcare' | 'Admin';

export type RiskBand = 'LOW' | 'GUARDED' | 'ELEVATED' | 'HIGH' | 'CRITICAL';

export type PriorityLevel = 'IMMEDIATE' | 'HIGH' | 'MODERATE' | 'MONITOR';

export type ConfidenceLevel = 'low' | 'moderate' | 'high';

export interface ResponseMetadata {
  timestamp: string;
  source: string;
  confidence: ConfidenceLevel;
  model_version: string;
  is_demo?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
  metadata: ResponseMetadata;
}

export interface RegionSummary {
  id: string;
  name: string;
  parent_region?: string;
  coordinates: [number, number]; // [lat, lng]
  population: string;
  population_num: number;
  overall_impact: number;
  risk_band: RiskBand;
  heat_risk: number;
  water_stress: number;
  health_risk: number;
  flood_risk: number;
  agriculture_risk: number;
  vulnerability: number;
  resilience: number;
  adaptive_capacity: number;
}

export interface ContributingFactor {
  factor: string;
  percentage: number;
  category: 'climate' | 'environment' | 'social' | 'infrastructure';
  trend?: 'increasing' | 'stable' | 'decreasing';
}

export interface RiskExplanation {
  region_id: string;
  region_name: string;
  overall_score: number;
  risk_band: RiskBand;
  confidence: ConfidenceLevel;
  factors: ContributingFactor[];
  summary: string;
}

export interface EquityPriority {
  rank: number;
  region_id: string;
  name: string;
  risk: number;
  vulnerability: number;
  adaptive_capacity: number;
  population: string;
  priority_level: PriorityLevel;
  recommended_actions: string[];
}

export interface SimulationInputs {
  cooling_centers: number; // 0 to 20
  water_capacity: number;  // 0 to 30 %
  tree_cover: number;      // 0 to 15 %
  healthcare_capacity: number; // 0 to 25 %
  emergency_response: number;  // 0 to 20 %
  early_warning: number;       // 0 to 30 %
}

export interface SimulationResult {
  baseline_risk: number;
  simulated_risk: number;
  baseline_resilience: number;
  simulated_resilience: number;
  baseline_vulnerable_population: number;
  simulated_vulnerable_population: number;
  estimated_people_protected: number;
  percentage_improvement: number;
  breakdown: {
    heat_reduction: number;
    water_stress_reduction: number;
    health_pressure_reduction: number;
    adaptive_gain: number;
  };
}

export interface AIAdviceRequest {
  region_id: string;
  question: string;
  context?: Record<string, any>;
}

export interface AIAdviceResponse {
  recommendation: string;
  reasons: string[];
  expected_effect: string;
  confidence: ConfidenceLevel;
  data_used: string[];
}

export interface EnsoStatus {
  phase: 'El Niño' | 'La Niña' | 'Neutral';
  intensity: 'Weak' | 'Moderate' | 'Strong' | 'Very Strong';
  trend: 'Strengthening' | 'Peaking' | 'Weakening';
  confidence_percentage: number;
  oni_anomaly: number; // e.g. +1.4 C
  updated_at: string;
}

export interface Alert {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'ADVISORY';
  title: string;
  location: string;
  region_id: string;
  description: string;
  indicators: string[];
  recommended_actions: string[];
  timestamp: string;
  is_active: boolean;
}

export interface CommunityReport {
  id: string;
  region_id: string;
  category: 'Water shortage' | 'Extreme heat' | 'Flooding' | 'Crop damage' | 'Power outage' | 'Infrastructure damage' | 'Health emergency';
  severity: 'low' | 'moderate' | 'severe' | 'critical';
  location_name: string;
  coordinates: [number, number];
  description: string;
  timestamp: string;
}

export interface ResourceOptimizationRequest {
  budget: number; // e.g. 1000000
  region_id: string;
}

export interface ResourceAllocationItem {
  category: string;
  amount: number;
  label_formatted: string;
  percentage: number;
  expected_impact: string;
}

export interface ResourceOptimizationResult {
  total_budget: number;
  allocations: ResourceAllocationItem[];
  estimated_population_protected: number;
  estimated_risk_reduction_points: number;
  equity_focus: string;
}

// ==========================================
// NEW CLIMATE INTELLIGENCE LAYER TYPES
// ==========================================

export interface ConsequenceNode {
  id: string;
  label: string;
  category: 'signal' | 'environmental' | 'infrastructural' | 'economic' | 'community' | 'health';
  impact_percent: number; // e.g. +18
  affected_population: number; // e.g. 184000
  confidence: number; // e.g. 82
  explanation: string;
  primary_evidence: string[];
  upstream_node_ids: string[];
  downstream_node_ids: string[];
  severity: 'moderate' | 'elevated' | 'high' | 'critical';
}

export interface ConsequenceGraphData {
  region_id: string;
  region_name: string;
  root_signal: string; // e.g. "EL NIÑO / EXTREME HEAT"
  summary: string;
  nodes: ConsequenceNode[];
  active_cascade_path: string[];
}

export interface InvisibleRiskFactor {
  name: string;
  status: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  impact_score: number;
  description: string;
}

export interface InvisiblePopulationData {
  region_id: string;
  region_name: string;
  climate_risk: number; // conventional risk e.g. 72
  population_total: number;
  estimated_invisible_risk: number; // e.g. 93
  estimated_vulnerable_population: number; // e.g. 18600
  outdoor_worker_exposure: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  cooling_access: 'LOW' | 'MODERATE' | 'ADEQUATE';
  healthcare_access: 'LOW' | 'MODERATE' | 'ADEQUATE';
  water_access: 'LOW' | 'MODERATE' | 'ADEQUATE';
  mobility_constraints: 'LOW' | 'MODERATE' | 'HIGH';
  factors: InvisibleRiskFactor[];
  explanation: string;
  model_label: string;
}

export interface DataFreshnessItem {
  layer: string;
  source: string;
  updated_ago: string;
  resolution: string;
  status: 'fresh' | 'stale' | 'gap';
}

export interface ConfidenceMetadata {
  region_id: string;
  overall_risk: number;
  overall_confidence: number; // e.g. 71%
  heat_confidence: number;
  flood_confidence: number;
  water_confidence: number;
  health_confidence: number;
  data_freshness: DataFreshnessItem[];
  model_version: string;
  last_calibrated: string;
}

export interface DataBlindSpot {
  id: string;
  region_id: string;
  title: string;
  domain: 'Healthcare' | 'Water Infrastructure' | 'Population' | 'Satellite' | 'Weather' | 'Community';
  severity: 'CRITICAL' | 'MODERATE' | 'ADVISORY';
  description: string;
  coverage_gap_percent: number; // e.g. 38%
  current_confidence: number; // e.g. 71%
  potential_confidence: number; // e.g. 84%
  impact_note: string;
  recommended_sensor_or_survey: string;
}

export interface ModelCommunityConflict {
  id: string;
  region_id: string;
  location_name: string;
  hazard_type: string;
  model_estimate: string; // e.g. "Low (Score 34)"
  community_observations: string; // e.g. "17 reports of repeated waterlogging"
  satellite_evidence: string; // e.g. "Moderate (NDWI Anomaly +0.18)"
  official_data: string;
  conflict_severity: 'HIGH' | 'MODERATE' | 'LOW';
  recommended_action: string; // e.g. "Field verification recommended."
  adjusted_confidence: number; // e.g. 54%
  is_verified: boolean;
  explanation: string;
}

export interface EvidenceOverview {
  region_id: string;
  hazard: string;
  official_data: 'Low' | 'Moderate' | 'High';
  satellite_data: 'Low' | 'Moderate' | 'High';
  model_prediction: 'Low' | 'Moderate' | 'High';
  community_reports: 'Low' | 'Moderate' | 'High';
  evidence_consistency: 'Low' | 'Moderate' | 'High';
  overall_confidence: number;
  summary: string;
}

export interface InterventionOption {
  id: string;
  name: string;
  cost: number; // in INR
  estimated_people_protected: number;
  estimated_risk_reduction_points: number;
  equity_benefit: 'HIGH' | 'MODERATE' | 'VERY HIGH';
  coverage_percentage: number;
  implementation_difficulty: 'LOW' | 'MEDIUM' | 'HIGH';
  time_to_impact_weeks: number;
  confidence: number; // e.g. 84%
}

export interface InterventionPortfolio {
  id: string;
  name: 'Low-Cost Portfolio' | 'Balanced Portfolio' | 'High-Resilience Portfolio';
  target_budget: number;
  allocated_budget: number;
  risk_reduction_percent: number; // e.g. 12%, 27%, 44%
  equity_benefit_percent: number; // e.g. 18%, 39%, 51%
  estimated_population_protected: number;
  items: {
    category: string;
    amount: number;
    description: string;
  }[];
  reserve_amount: number;
  cost_effectiveness_ratio: string;
  confidence: number;
  tag: string;
}

export interface TrajectoryPoint {
  year: number;
  baseline_risk: number;
  simulated_risk: number;
  resilience_level: number;
  note: string;
}

export interface CounterfactualScenarioResult {
  region_id: string;
  scenario_name: string;
  description: string;
  baseline: {
    risk: number;
    resilience: number;
    vulnerable_population: number;
  };
  simulated: {
    risk: number;
    resilience: number;
    vulnerable_population: number;
    people_protected: number;
  };
  trajectory: TrajectoryPoint[];
  methodology_label: string;
}

export interface ResilienceLedgerEntry {
  id: string;
  region_id: string;
  area_name: string;
  baseline_date: string;
  baseline_resilience: number;
  interventions_deployed: string[];
  current_date: string;
  current_resilience: number;
  delta: number;
  data_type: 'Observed change' | 'Modelled change';
  verification_source: string;
  notes: string;
}

export interface FacilityCapacityItem {
  id: string;
  name: string;
  type: 'School' | 'Community Hall' | 'Hospital' | 'NGO Center' | 'Public Building';
  spaces_available: number;
  verified: boolean;
  coordinates: [number, number];
}

export interface ResponseCapacityData {
  region_id: string;
  hazard_type: string;
  detected_need_count: number; // e.g. 12 cooling centers
  available_capacity_count: number; // e.g. 12
  coverage_percentage: number; // e.g. 100%
  status: 'Sufficient' | 'Partial' | 'Deficit';
  facilities: FacilityCapacityItem[];
  planning_note: string;
}

export interface TimeMachinePeriod {
  year: number;
  temperature_anomaly: number;
  rainfall_anomaly_mm: number;
  water_stress_index: number;
  vegetation_health_ndvi: number;
  population_exposed: number;
  infrastructure_stress: number;
  vulnerability_score: number;
  resilience_score: number;
  is_counterfactual?: boolean;
}

export interface TimeMachineData {
  region_id: string;
  region_name: string;
  periods: TimeMachinePeriod[];
  summary: string;
}

