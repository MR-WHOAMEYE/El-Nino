export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface Region {
  id: string;
  name: string;
  country: string;
  zone: string;
  population: number;
  povertyRate: number; // percentage 0-100
  historicalDroughtExposure: number; // 0-100
  overallVulnerabilityScore: number; // 0-100
  climateRiskLevel: RiskLevel;
  oniAnomaly: number; // °C e.g. +1.9
  rainfallDeficitPercent: number; // e.g. -42%
  soilMoistureDeficit: number; // %
  surfaceWaterStorageCap: number; // %
  cropYieldForecastLoss: number; // %
  staplePriceInflation: number; // %
  dnaScores: {
    ecological: number;
    infrastructure: number;
    economic: number;
    socialEquity: number;
    governance: number;
  };
  coordinates: { x: number; y: number }; // SVG representation coordinates
}

export interface Intervention {
  id: string;
  name: string;
  category: 'water' | 'agriculture' | 'financial' | 'ecosystem' | 'early_action';
  categoryLabel: string;
  description: string;
  costPerCapita: number; // USD
  totalEstimatedCost: number; // USD
  resilienceLiftPercent: number; // e.g. +34%
  cropProtectionPercent: number; // e.g. +28%
  waterSecurityGainPercent: number; // e.g. +45%
  readinessTimeline: string; // e.g. "30-60 days"
  evidenceLevel: 'Proven' | 'High' | 'Emerging';
  coBenefits: string[];
  recommendedFor: RiskLevel[];
}

export interface CommunityReport {
  id: string;
  regionId: string;
  regionName: string;
  type: 'water_shortage' | 'crop_wilting' | 'river_dry' | 'livestock_stress' | 'food_inflation';
  typeLabel: string;
  title: string;
  description: string;
  severity: RiskLevel;
  locationDetails: string;
  timestamp: string;
  reporterRole: string;
  verified: boolean;
  upvotes: number;
}

export interface SimulationParams {
  regionId: string;
  elNinoIntensity: 'weak' | 'moderate' | 'strong' | 'extreme';
  timeHorizon: '2024-2025' | '2025-2026' | '5-year-long-term';
  rainfallReductionCustom: number; // %
  tempSpikeCustom: number; // °C
  appliedInterventionIds: string[];
}

export interface SimulationOutcome {
  baselineCropLoss: number; // %
  baselineWaterStress: number; // %
  baselineDisplacedFamilies: number;
  baselineEconomicLossMillion: number;
  
  mitigatedCropLoss: number; // %
  mitigatedWaterStress: number; // %
  mitigatedDisplacedFamilies: number;
  mitigatedEconomicLossMillion: number;

  impactAvoidedMillion: number;
  resilienceGainPercent: number;
  familiesProtected: number;
}

export interface EquityAllocationResult {
  regionId: string;
  regionName: string;
  population: number;
  povertyRate: number;
  vulnerabilityScore: number;
  pureGdpAllocation: number;
  equitableAllocation: number;
  equityLiftDelta: number;
  percentageShare: number;
  keyJustification: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: 'citizen' | 'authority';
  workOrJob?: string;
  agency?: string;
  isLoggedIn: boolean;
}
