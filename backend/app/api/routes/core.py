from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Body
from app.schemas.envelope import ApiResponse, ResponseMetadata

router = APIRouter(prefix="", tags=["core-telemetry"])

def core_meta():
    return ResponseMetadata(
        source="fastapi-core-telemetry",
        confidence="high",
        model_version="CLIMA-CORE-v1.0",
        is_demo=False
    )

@router.get("/climate/status", response_model=ApiResponse[dict])
async def get_climate_status():
    return ApiResponse(
        success=True,
        data={
            "phase": "El Niño",
            "intensity": "Moderate",
            "trend": "Strengthening",
            "confidence_percentage": 82,
            "oni_anomaly": 1.4,
            "updated_at": "2026-10-08T06:00:00Z"
        },
        metadata=core_meta()
    )

@router.get("/regions", response_model=ApiResponse[List[dict]])
async def get_regions():
    return ApiResponse(
        success=True,
        data=[
            {
                "id": "TN-CHN",
                "name": "Chennai Metro",
                "parent_region": "Tamil Nadu, India",
                "coordinates": [13.0827, 80.2707],
                "population": "11.2M",
                "population_num": 11200000,
                "overall_impact": 78,
                "risk_band": "HIGH",
                "heat_risk": 87,
                "water_stress": 72,
                "health_risk": 81,
                "flood_risk": 64,
                "agriculture_risk": 55,
                "vulnerability": 73,
                "resilience": 61,
                "adaptive_capacity": 48
            },
            {
                "id": "TN-CHN-NORTH",
                "name": "North Chennai (Wards 1–4)",
                "parent_region": "Tondiarpet & Vyasarpadi, TN",
                "coordinates": [13.1400, 80.2900],
                "population": "182K",
                "population_num": 182000,
                "overall_impact": 91,
                "risk_band": "CRITICAL",
                "heat_risk": 94,
                "water_stress": 86,
                "health_risk": 92,
                "flood_risk": 78,
                "agriculture_risk": 22,
                "vulnerability": 88,
                "resilience": 42,
                "adaptive_capacity": 42
            }
        ],
        metadata=core_meta()
    )

@router.get("/regions/{region_id}", response_model=ApiResponse[dict])
async def get_region_by_id(region_id: str):
    is_north = "NORTH" in region_id or "42" in region_id
    return ApiResponse(
        success=True,
        data={
            "id": region_id,
            "name": "North Chennai (Ward 42 / Vyasarpadi)" if is_north else "Chennai Metro",
            "parent_region": "Tamil Nadu, India",
            "coordinates": [13.1400, 80.2900] if is_north else [13.0827, 80.2707],
            "population": "80,000" if is_north else "11.2M",
            "population_num": 80000 if is_north else 11200000,
            "overall_impact": 91 if is_north else 78,
            "risk_band": "CRITICAL" if is_north else "HIGH",
            "heat_risk": 94 if is_north else 87,
            "water_stress": 86 if is_north else 72,
            "health_risk": 92 if is_north else 81,
            "flood_risk": 78 if is_north else 64,
            "agriculture_risk": 22 if is_north else 55,
            "vulnerability": 88 if is_north else 73,
            "resilience": 42 if is_north else 61,
            "adaptive_capacity": 42 if is_north else 48
        },
        metadata=core_meta()
    )

@router.get("/risk/{region_id}/explanation", response_model=ApiResponse[dict])
async def get_risk_explanation(region_id: str):
    return ApiResponse(
        success=True,
        data={
            "region_id": region_id,
            "region_name": "Chennai Basin",
            "overall_score": 82,
            "risk_band": "HIGH",
            "confidence": "high",
            "summary": "Compound heat-water stress driven by anomalous sea-surface temperatures.",
            "factors": [
                {"factor": "Surface Temperature Anomaly", "percentage": 27, "category": "climate"},
                {"factor": "Precipitation Deficit Anomaly", "percentage": 28, "category": "climate"},
                {"factor": "Informal Housing & Tanker Deficit", "percentage": 86, "category": "social"}
            ]
        },
        metadata=core_meta()
    )

@router.get("/equity/priorities", response_model=ApiResponse[List[dict]])
async def get_equity_priorities():
    return ApiResponse(
        success=True,
        data=[
            {
                "rank": 1,
                "region_id": "TN-CHN-NORTH",
                "name": "North Chennai (Ward 42 / Vyasarpadi)",
                "risk": 91,
                "vulnerability": 88,
                "adaptive_capacity": 42,
                "population": "182,000",
                "priority_level": "IMMEDIATE",
                "recommended_actions": ["Deploy 4 cooling shelters", "Augment drinking water tankers"]
            }
        ],
        metadata=core_meta()
    )

@router.post("/simulation/run", response_model=ApiResponse[dict])
async def run_simulation(inputs: dict = Body(...)):
    cooling = inputs.get("cooling_centers", 0) * 0.9
    water = inputs.get("water_capacity", 0) * 0.5
    reduction = int(cooling + water)
    return ApiResponse(
        success=True,
        data={
            "baseline_risk": 82,
            "simulated_risk": max(30, 82 - reduction),
            "baseline_resilience": 48,
            "simulated_resilience": min(95, 48 + int(reduction * 1.2)),
            "baseline_vulnerable_population": 42000,
            "simulated_vulnerable_population": max(10000, 42000 - int(reduction * 500)),
            "estimated_people_protected": int(reduction * 500),
            "percentage_improvement": round((reduction / 82.0) * 100, 1),
            "breakdown": {
                "heat_reduction": int(cooling),
                "water_stress_reduction": int(water),
                "health_pressure_reduction": 8,
                "adaptive_gain": 14
            }
        },
        metadata=core_meta()
    )

@router.post("/resources/optimize", response_model=ApiResponse[dict])
async def optimize_resources(req: dict = Body(...)):
    budget = req.get("budget", 1000000)
    scale = budget / 1000000.0
    return ApiResponse(
        success=True,
        data={
            "total_budget": budget,
            "allocations": [
                {"category": "Cooling Centers & Shaded Refuges", "amount": int(250000 * scale), "label_formatted": f"₹{(2.5 * scale):.1f}L", "percentage": 25, "expected_impact": "Reduces heat vulnerability"},
                {"category": "Emergency Water Tankers & Distribution", "amount": int(250000 * scale), "label_formatted": f"₹{(2.5 * scale):.1f}L", "percentage": 25, "expected_impact": "Provides stable hydration"},
                {"category": "Healthcare Hydration & ER Beds", "amount": int(200000 * scale), "label_formatted": f"₹{(2.0 * scale):.1f}L", "percentage": 20, "expected_impact": "Equips primary health centers"}
            ],
            "estimated_population_protected": int(21400 * (scale ** 0.5)),
            "estimated_risk_reduction_points": min(30, int(19 * (scale ** 0.5))),
            "equity_focus": "Prioritized top immediate wards"
        },
        metadata=core_meta()
    )

@router.post("/ai/advice", response_model=ApiResponse[dict])
async def get_ai_advice(req: dict = Body(...)):
    return ApiResponse(
        success=True,
        data={
            "recommendation": "Prioritize a dual heat-hydration intervention in North Chennai Wards 1 to 4 before the mid-month temperature surge.",
            "reasons": [
                "North Chennai exhibits compound vulnerability (Risk 91, Vulnerability 88, Adaptive Capacity 42).",
                "Modelled water stress (86 localized) compounds thermal exhaustion risk."
            ],
            "expected_effect": "Modelled scenario indicates a potential reduction in vulnerable population from 42,000 to 23,600.",
            "confidence": "high",
            "data_used": ["Chennai Meteorological Anomaly Grid", "TN Census Micro-dataset"]
        },
        metadata=core_meta()
    )

@router.get("/alerts", response_model=ApiResponse[List[dict]])
async def get_alerts():
    return ApiResponse(
        success=True,
        data=[
            {
                "id": "ALT-01",
                "severity": "CRITICAL",
                "title": "Wet-Bulb Temperature Alert",
                "location": "North Chennai",
                "region_id": "TN-CHN-NORTH",
                "description": "Peak daytime temperature exceeds 42.8°C with high relative humidity.",
                "indicators": ["Heat Index > 45°C", "Hospital ER surge"],
                "recommended_actions": ["Activate public misting shelters"],
                "timestamp": "2026-10-08T06:00:00Z",
                "is_active": True
            }
        ],
        metadata=core_meta()
    )

@router.get("/community/reports", response_model=ApiResponse[List[dict]])
async def get_community_reports():
    return ApiResponse(
        success=True,
        data=[
            {
                "id": "RPT-101",
                "region_id": "TN-CHN",
                "category": "Water shortage",
                "severity": "severe",
                "location_name": "Vyasarpadi Market Street, Ward 42",
                "coordinates": [13.118, 80.259],
                "description": "Municipal tanker has not arrived for 72 hours. Communal well salt intrusion observed.",
                "timestamp": "2026-10-08T07:15:00Z"
            }
        ],
        metadata=core_meta()
    )

@router.post("/community/reports", response_model=ApiResponse[dict])
async def submit_report(report: dict = Body(...)):
    report["id"] = "RPT-LIVE-999"
    report["timestamp"] = "2026-10-08T12:00:00Z"
    return ApiResponse(success=True, data=report, metadata=core_meta())
