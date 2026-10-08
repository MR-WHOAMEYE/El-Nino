from typing import List, Optional
from fastapi import APIRouter, Body
from app.schemas.envelope import ApiResponse, ResponseMetadata
from app.schemas.intelligence import (
    ConsequenceGraphSchema,
    InvisiblePopulationSchema,
    ConfidenceMetadataSchema,
    DataBlindSpotSchema,
    ModelCommunityConflictSchema,
    EvidenceOverviewSchema,
    InterventionPortfolioSchema,
    OptimizePortfolioRequest,
    CounterfactualScenarioSchema,
    ResilienceLedgerEntrySchema,
    ResponseCapacitySchema,
    NLPClassifyRequest,
    NLPClassifyResponse
)
from app.services.intelligence_services import (
    get_consequence_graph,
    get_invisible_population,
    get_confidence_metadata,
    get_data_blindspots,
    get_model_community_conflicts,
    get_evidence_overview,
    optimize_portfolios,
    get_counterfactual_scenario,
    get_resilience_ledger,
    get_response_capacity,
    classify_nlp_report
)

router = APIRouter(prefix="", tags=["climate-intelligence"])

def meta(confidence: str = "high"):
    return ResponseMetadata(
        source="fastapi-climate-intelligence-engine",
        confidence=confidence,
        model_version="CLIMA-INTEL-v2.5",
        is_demo=False
    )

@router.get("/consequences/{region_id}", response_model=ApiResponse[ConsequenceGraphSchema])
@router.get("/consequences/{region_id}/graph", response_model=ApiResponse[ConsequenceGraphSchema])
async def read_consequence_graph(region_id: str):
    data = get_consequence_graph(region_id)
    return ApiResponse(success=True, data=data, metadata=meta("high"))

@router.get("/invisible-population/{region_id}", response_model=ApiResponse[InvisiblePopulationSchema])
async def read_invisible_population(region_id: str):
    data = get_invisible_population(region_id)
    return ApiResponse(success=True, data=data, metadata=meta("moderate"))

@router.get("/confidence/{region_id}", response_model=ApiResponse[ConfidenceMetadataSchema])
async def read_confidence_metadata(region_id: str):
    data = get_confidence_metadata(region_id)
    return ApiResponse(success=True, data=data, metadata=meta("high"))

@router.get("/data-blindspots/{region_id}", response_model=ApiResponse[List[DataBlindSpotSchema]])
async def read_data_blindspots(region_id: str):
    data = get_data_blindspots(region_id)
    return ApiResponse(success=True, data=data, metadata=meta("high"))

@router.get("/model-community-conflicts/{region_id}", response_model=ApiResponse[List[ModelCommunityConflictSchema]])
async def read_model_community_conflicts(region_id: str):
    data = get_model_community_conflicts(region_id)
    return ApiResponse(success=True, data=data, metadata=meta("moderate"))

@router.get("/community/evidence/{region_id}", response_model=ApiResponse[EvidenceOverviewSchema])
async def read_community_evidence(region_id: str):
    data = get_evidence_overview(region_id)
    return ApiResponse(success=True, data=data, metadata=meta("moderate"))

@router.post("/interventions/portfolios", response_model=ApiResponse[List[InterventionPortfolioSchema]])
@router.post("/interventions/optimize", response_model=ApiResponse[List[InterventionPortfolioSchema]])
async def create_intervention_portfolios(req: OptimizePortfolioRequest):
    data = optimize_portfolios(req.budget, req.region_id or "TN-CHN")
    return ApiResponse(success=True, data=data, metadata=meta("high"))

@router.post("/scenarios/counterfactual", response_model=ApiResponse[CounterfactualScenarioSchema])
async def create_counterfactual_scenario(body: dict = Body(default={})):
    region_id = body.get("region_id", "TN-CHN")
    data = get_counterfactual_scenario(region_id)
    return ApiResponse(success=True, data=data, metadata=meta("moderate"))

@router.get("/resilience/ledger/{region_id}", response_model=ApiResponse[List[ResilienceLedgerEntrySchema]])
async def read_resilience_ledger(region_id: str):
    data = get_resilience_ledger(region_id)
    return ApiResponse(success=True, data=data, metadata=meta("high"))

@router.get("/response-capacity/{region_id}", response_model=ApiResponse[ResponseCapacitySchema])
async def read_response_capacity(region_id: str):
    data = get_response_capacity(region_id)
    return ApiResponse(success=True, data=data, metadata=meta("high"))

@router.post("/community/classify", response_model=ApiResponse[NLPClassifyResponse])
async def classify_report(req: NLPClassifyRequest):
    data = classify_nlp_report(req.text)
    return ApiResponse(success=True, data=data, metadata=meta("high"))
