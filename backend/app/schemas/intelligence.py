from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ConsequenceNodeSchema(BaseModel):
    id: str
    label: str
    category: str
    impact_percent: float
    affected_population: int
    confidence: int
    severity: str
    explanation: str
    primary_evidence: List[str]
    upstream_node_ids: List[str]
    downstream_node_ids: List[str]

class ConsequenceGraphSchema(BaseModel):
    region_id: str
    region_name: str
    root_signal: str
    summary: str
    nodes: List[ConsequenceNodeSchema]
    active_cascade_path: List[str]

class InvisibleRiskFactorSchema(BaseModel):
    name: str
    status: str
    impact_score: int
    description: str

class InvisiblePopulationSchema(BaseModel):
    region_id: str
    region_name: str
    climate_risk: int
    population_total: int
    estimated_invisible_risk: int
    estimated_vulnerable_population: int
    outdoor_worker_exposure: str
    cooling_access: str
    healthcare_access: str
    water_access: str
    mobility_constraints: str
    explanation: str
    model_label: str
    factors: List[InvisibleRiskFactorSchema]

class DataFreshnessSchema(BaseModel):
    layer: str
    source: str
    updated_ago: str
    resolution: str
    status: str

class ConfidenceMetadataSchema(BaseModel):
    region_id: str
    overall_risk: int
    overall_confidence: int
    heat_confidence: int
    flood_confidence: int
    water_confidence: int
    health_confidence: int
    model_version: str
    last_calibrated: str
    data_freshness: List[DataFreshnessSchema]

class DataBlindSpotSchema(BaseModel):
    id: str
    region_id: str
    title: str
    domain: str
    severity: str
    description: str
    coverage_gap_percent: int
    current_confidence: int
    potential_confidence: int
    impact_note: str
    recommended_sensor_or_survey: str

class ModelCommunityConflictSchema(BaseModel):
    id: str
    region_id: str
    location_name: str
    hazard_type: str
    model_estimate: str
    community_observations: str
    satellite_evidence: str
    official_data: str
    conflict_severity: str
    recommended_action: str
    adjusted_confidence: int
    is_verified: bool
    explanation: str

class EvidenceOverviewSchema(BaseModel):
    region_id: str
    hazard: str
    official_data: str
    satellite_data: str
    model_prediction: str
    community_reports: str
    evidence_consistency: str
    overall_confidence: int
    summary: str

class PortfolioItemSchema(BaseModel):
    category: str
    amount: int
    description: str

class InterventionPortfolioSchema(BaseModel):
    id: str
    name: str
    target_budget: int
    allocated_budget: int
    risk_reduction_percent: int
    equity_benefit_percent: int
    estimated_population_protected: int
    tag: str
    confidence: int
    cost_effectiveness_ratio: str
    reserve_amount: int
    items: List[PortfolioItemSchema]

class OptimizePortfolioRequest(BaseModel):
    budget: int = Field(default=1000000)
    region_id: Optional[str] = "TN-CHN"

class TrajectoryPointSchema(BaseModel):
    year: int
    baseline_risk: int
    simulated_risk: int
    resilience_level: int
    note: str

class CounterfactualScenarioSchema(BaseModel):
    region_id: str
    scenario_name: str
    description: str
    methodology_label: str
    baseline: Dict[str, Any]
    simulated: Dict[str, Any]
    trajectory: List[TrajectoryPointSchema]

class ResilienceLedgerEntrySchema(BaseModel):
    id: str
    region_id: str
    area_name: str
    baseline_date: str
    baseline_resilience: int
    interventions_deployed: List[str]
    current_date: str
    current_resilience: int
    delta: int
    data_type: str
    verification_source: str
    notes: str

class FacilityCapacitySchema(BaseModel):
    id: str
    name: str
    type: str
    spaces_available: int
    verified: bool
    coordinates: List[float]

class ResponseCapacitySchema(BaseModel):
    region_id: str
    hazard_type: str
    detected_need_count: int
    available_capacity_count: int
    coverage_percentage: int
    status: str
    planning_note: str
    facilities: List[FacilityCapacitySchema]

class NLPClassifyRequest(BaseModel):
    text: str

class NLPClassifyResponse(BaseModel):
    event: str
    severity: str
    duration: str
    location_extracted: str
    affected_issue: str
