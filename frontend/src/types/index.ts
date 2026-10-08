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
