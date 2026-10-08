from typing import List, Dict, Any, Optional
import math
from app.schemas.intelligence import (
    ConsequenceGraphSchema, ConsequenceNodeSchema,
    InvisiblePopulationSchema, InvisibleRiskFactorSchema,
    ConfidenceMetadataSchema, DataFreshnessSchema,
    DataBlindSpotSchema,
    ModelCommunityConflictSchema,
    EvidenceOverviewSchema,
    InterventionPortfolioSchema, PortfolioItemSchema,
    CounterfactualScenarioSchema, TrajectoryPointSchema,
    ResilienceLedgerEntrySchema,
    ResponseCapacitySchema, FacilityCapacitySchema,
    NLPClassifyResponse
)

# Consequence graph service
def get_consequence_graph(region_id: str) -> ConsequenceGraphSchema:
    nodes = [
        ConsequenceNodeSchema(
            id="EXTREME_HEAT",
            label="EXTREME HEAT ANOMALY",
            category="signal",
            impact_percent=18.0,
            affected_population=184000,
            confidence=82,
            severity="critical",
            explanation="Atmospheric blocking coupled with oceanic warm tongue results in persistent wet-bulb temperatures exceeding 31°C across urban wards.",
            primary_evidence=["Surface Temperature Anomaly (+2.8°C)", "Urban Heat Island Delta (3.4°C)", "Historical Heatwave Return Frequency"],
            upstream_node_ids=[],
            downstream_node_ids=["COOLING_DEMAND", "SOIL_MOISTURE_DEFICIT"]
        ),
        ConsequenceNodeSchema(
            id="COOLING_DEMAND",
            label="Cooling & Chilling Demand Surge",
            category="infrastructural",
            impact_percent=24.0,
            affected_population=184000,
            confidence=85,
            severity="high",
            explanation="Residential and commercial AC load spikes by 1,420 MW above baseline during 13:00–17:00 peak hours.",
            primary_evidence=["TANGEDCO Substation Telemetry", "Smart Meter Feeder Load", "Appliance Saturation Index"],
            upstream_node_ids=["EXTREME_HEAT"],
            downstream_node_ids=["ELECTRICITY_GRID_STRESS"]
        ),
        ConsequenceNodeSchema(
            id="ELECTRICITY_GRID_STRESS",
            label="Distribution Grid Thermal Stress",
            category="infrastructural",
            impact_percent=31.0,
            affected_population=142000,
            confidence=78,
            severity="high",
            explanation="Overheating of distribution transformers in high-density corridors reduces carrying capacity and triggers localized feeder tripping.",
            primary_evidence=["Transformer Core Temp Sensors (>95°C)", "Historical Feeder Outage Logs", "Distribution Loss Delta"],
            upstream_node_ids=["COOLING_DEMAND"],
            downstream_node_ids=["POWER_OUTAGE_RISK"]
        ),
        ConsequenceNodeSchema(
            id="POWER_OUTAGE_RISK",
            label="Localized Feeder Outages",
            category="infrastructural",
            impact_percent=19.0,
            affected_population=98000,
            confidence=74,
            severity="elevated",
            explanation="Intermittent rotational load shedding and localized line faults concentrate in informal settlements lacking redundant circuits.",
            primary_evidence=["SCADA Tripping Events", "Citizen Power Outage Reports", "Transformer Failure Rate"],
            upstream_node_ids=["ELECTRICITY_GRID_STRESS"],
            downstream_node_ids=["WATER_PUMPING_DISRUPTION"]
        ),
        ConsequenceNodeSchema(
            id="WATER_PUMPING_DISRUPTION",
            label="Municipal Water Pumping Disruption",
            category="infrastructural",
            impact_percent=28.0,
            affected_population=115000,
            confidence=79,
            severity="high",
            explanation="CMWSSB booster pumps experience intermittent stoppage, depressurizing primary piped networks across northern distribution zones.",
            primary_evidence=["CMWSSB Pumping Head Pressure Telemetry", "Header Pipe Pressure Loss (-1.2 bar)", "Pumping Station Uptime Logs"],
            upstream_node_ids=["POWER_OUTAGE_RISK"],
            downstream_node_ids=["WATER_AVAILABILITY_REDUCTION"]
        ),
        ConsequenceNodeSchema(
            id="SOIL_MOISTURE_DEFICIT",
            label="Soil Moisture Depletion",
            category="environmental",
            impact_percent=-42.0,
            affected_population=45000,
            confidence=88,
            severity="high",
            explanation="Root-zone moisture in peri-urban belts drops below wilting point due to high evapotranspiration and deficient pre-monsoon showers.",
            primary_evidence=["SMAP Satellite Soil Moisture (0.12 m³/m³)", "Agricultural Evaporative Deficit", "Ground Tensiometer Networks"],
            upstream_node_ids=["EXTREME_HEAT"],
            downstream_node_ids=["AGRICULTURAL_STRESS", "WATER_AVAILABILITY_REDUCTION"]
        ),
        ConsequenceNodeSchema(
            id="AGRICULTURAL_STRESS",
            label="Peri-urban Crop & Dairy Stress",
            category="economic",
            impact_percent=22.0,
            affected_population=52000,
            confidence=81,
            severity="elevated",
            explanation="Horticulture yields and livestock milk output drop by 22% in Tiruvallur and Kanchipuram supply basins.",
            primary_evidence=["NDVI Vegetation Index Drop (-0.24)", "Dairy Cooperative Supply Receipts", "Mandi Inflow Volumes"],
            upstream_node_ids=["SOIL_MOISTURE_DEFICIT"],
            downstream_node_ids=["FOOD_PRICE_PRESSURE"]
        ),
        ConsequenceNodeSchema(
            id="FOOD_PRICE_PRESSURE",
            label="Perishable Food Price Spikes",
            category="economic",
            impact_percent=16.0,
            affected_population=184000,
            confidence=76,
            severity="moderate",
            explanation="Supply disruptions increase retail prices of leafy vegetables, tomatoes, and dairy by 16% in neighborhood markets.",
            primary_evidence=["Koyambedu Wholesale Price Index", "Consumer Price Monitoring Cell Data"],
            upstream_node_ids=["AGRICULTURAL_STRESS"],
            downstream_node_ids=["LOW_INCOME_HOUSEHOLD_VULNERABILITY"]
        ),
        ConsequenceNodeSchema(
            id="WATER_AVAILABILITY_REDUCTION",
            label="Potable Water Deficit in Frontline Wards",
            category="community",
            impact_percent=34.0,
            affected_population=138000,
            confidence=83,
            severity="critical",
            explanation="Severe reduction in tanker delivery rounds and communal tap availability triggers long queues during daytime heat.",
            primary_evidence=["Tanker GPS Turnaround Logs", "Citizen Hydration SOS Reports (42 in 24h)", "Communal Borewell Level Sensors"],
            upstream_node_ids=["WATER_PUMPING_DISRUPTION", "SOIL_MOISTURE_DEFICIT"],
            downstream_node_ids=["COMMUNITY_HEALTH_RISK"]
        ),
        ConsequenceNodeSchema(
            id="LOW_INCOME_HOUSEHOLD_VULNERABILITY",
            label="Low-Income Household Coping Deficit",
            category="community",
            impact_percent=27.0,
            affected_population=96000,
            confidence=80,
            severity="high",
            explanation="Compound cost of bottled water, electricity alternatives, and food reduces disposable income for medical contingencies.",
            primary_evidence=["Socio-economic Micro-survey 2024", "Informal Labor Wage Stability Index"],
            upstream_node_ids=["FOOD_PRICE_PRESSURE"],
            downstream_node_ids=["COMMUNITY_HEALTH_RISK"]
        ),
        ConsequenceNodeSchema(
            id="COMMUNITY_HEALTH_RISK",
            label="Frontline Public Health Emergency",
            category="health",
            impact_percent=38.0,
            affected_population=184000,
            confidence=82,
            severity="critical",
            explanation="Acute convergence of thermal strain, dehydration, and delayed primary care triggers surge in heat exhaustion and cardiovascular distress.",
            primary_evidence=["Government Hospital ER Dehydration Admissions (+41%)", "108 Ambulance Heat Distress Calls", "10-Day Excess Mortality Signal"],
            upstream_node_ids=["WATER_AVAILABILITY_REDUCTION", "LOW_INCOME_HOUSEHOLD_VULNERABILITY"],
            downstream_node_ids=[]
        )
    ]

    return ConsequenceGraphSchema(
        region_id=region_id,
        region_name="Chennai Metropolitan Basin",
        root_signal="EL NIÑO / EXTREME HEAT TELECONNECTION",
        summary="A compound thermal-hydrological cascade propagating from regional oceanic anomaly through municipal infrastructure to frontline community health.",
        active_cascade_path=["EXTREME_HEAT", "COOLING_DEMAND", "ELECTRICITY_GRID_STRESS", "POWER_OUTAGE_RISK", "WATER_PUMPING_DISRUPTION", "WATER_AVAILABILITY_REDUCTION", "COMMUNITY_HEALTH_RISK"],
        nodes=nodes
    )

# Invisible population service
def get_invisible_population(region_id: str) -> InvisiblePopulationSchema:
    is_north = "NORTH" in region_id or "42" in region_id
    factors = [
        InvisibleRiskFactorSchema(name="Outdoor Workforce Density", status="CRITICAL", impact_score=96 if is_north else 92, description="Port logistics, informal street vending, and heavy transport laborers with 9+ hours of thermal exposure."),
        InvisibleRiskFactorSchema(name="Public Cooling Refuge Access", status="CRITICAL", impact_score=93 if is_north else 87, description="Zero air-conditioned civic shelters or misting centers within 2.5 km radius."),
        InvisibleRiskFactorSchema(name="Healthcare Capacity Deficit", status="HIGH", impact_score=88 if is_north else 78, description="Primary health center operates at 180% capacity with scarce electrolyte replenishment stock."),
        InvisibleRiskFactorSchema(name="Municipal Piped Water Deficit", status="CRITICAL", impact_score=94 if is_north else 91, description="Water delivery frequency dropped from daily to once every 3.5 days.")
    ]

    return InvisiblePopulationSchema(
        region_id=region_id,
        region_name="North Chennai (Ward 42 / Vyasarpadi)" if is_north else "Chennai Metro Region",
        climate_risk=72 if is_north else 78,
        population_total=80000 if is_north else 11200000,
        estimated_invisible_risk=93 if is_north else 86,
        estimated_vulnerable_population=18600 if is_north else 186000,
        outdoor_worker_exposure="HIGH",
        cooling_access="LOW",
        healthcare_access="LOW" if is_north else "MODERATE",
        water_access="LOW",
        mobility_constraints="HIGH" if is_north else "MODERATE",
        explanation="Conventional hazard risk is moderate, but adaptive capacity is low with severe outdoor labor concentration and cooling deficits. This increases the estimated human impact score.",
        model_label="Modelled estimate (SHAP adaptive-capacity weighting)",
        factors=factors
    )

# Confidence metadata service
def get_confidence_metadata(region_id: str) -> ConfidenceMetadataSchema:
    freshness = [
        DataFreshnessSchema(layer="Weather Telemetry", source="Open-Meteo & IMD Radars", updated_ago="24 minutes ago", resolution="0.1° Gridded (High)", status="fresh"),
        DataFreshnessSchema(layer="Surface Vegetation (NDVI)", source="Copernicus Sentinel-2", updated_ago="8 days ago", resolution="10m Multi-spectral", status="fresh"),
        DataFreshnessSchema(layer="Population Density", source="GPWv4 & 2025 Census Estimate", updated_ago="2025 Demographic Projection", resolution="100m Microgrid", status="fresh"),
        DataFreshnessSchema(layer="ENSO Phase & ONI Index", source="NOAA CPC / BOM Oceanic Buoys", updated_ago="Latest available observation", resolution="Equatorial Pacific Basin", status="fresh"),
        DataFreshnessSchema(layer="Healthcare Bed Occupancy", source="State Health Management Information System", updated_ago="45 days ago (Partial)", resolution="District Aggregation Only", status="gap")
    ]
    return ConfidenceMetadataSchema(
        region_id=region_id,
        overall_risk=82,
        overall_confidence=71,
        heat_confidence=84,
        flood_confidence=62,
        water_confidence=76,
        health_confidence=65,
        model_version="CLIMA-RISK-v2.4 (Ensemble XGBoost + SHAP)",
        last_calibrated="2026-10-08T04:30:00Z",
        data_freshness=freshness
    )

# Data blind spots service
def get_data_blindspots(region_id: str) -> List[DataBlindSpotSchema]:
    return [
        DataBlindSpotSchema(
            id="BLIND-01",
            region_id=region_id,
            title="Healthcare capacity data incomplete",
            domain="Healthcare",
            severity="CRITICAL",
            description="Healthcare capacity and emergency hydration surge data is unavailable for 38% of the selected metropolitan region.",
            coverage_gap_percent=38,
            current_confidence=71,
            potential_confidence=84,
            impact_note="Confidence could improve with additional healthcare data.",
            recommended_sensor_or_survey="Integrate real-time emergency room bed and hydration telemetry from secondary dispensaries."
        ),
        DataBlindSpotSchema(
            id="BLIND-02",
            region_id=region_id,
            title="Groundwater table monitoring gap in peri-urban belt",
            domain="Water Infrastructure",
            severity="MODERATE",
            description="Piezometric sensor network has 42% spatial coverage gap across southern and northern aquifer recharge zones.",
            coverage_gap_percent=42,
            current_confidence=76,
            potential_confidence=87,
            impact_note="Confidence in 30-day water stress prognosis could improve with ground hydrometric data.",
            recommended_sensor_or_survey="Deploy telemetry data loggers on 18 municipal monitoring borewells."
        )
    ]

# Model community conflict service
def get_model_community_conflicts(region_id: str) -> List[ModelCommunityConflictSchema]:
    return [
        ModelCommunityConflictSchema(
            id="CONF-01",
            region_id=region_id,
            location_name="North Chennai (Ward 42 / Vyasarpadi - Basin Bridge)",
            hazard_type="Local Inundation & Storm Drain Waterlogging",
            model_estimate="Flood risk = LOW (Score 34)",
            community_observations="17 reports of repeated waterlogging",
            satellite_evidence="MODERATE (Sentinel-1 SAR surface water anomaly +0.18)",
            official_data="Low historical flood return categorization (1-in-10 yr)",
            conflict_severity="HIGH",
            recommended_action="Field verification recommended.",
            adjusted_confidence=52,
            is_verified=False,
            explanation="The model currently estimates low flood risk, but recent community observations indicate repeated local waterlogging. Field verification recommended."
        )
    ]

# Evidence overview service
def get_evidence_overview(region_id: str) -> EvidenceOverviewSchema:
    return EvidenceOverviewSchema(
        region_id=region_id,
        hazard="Compound Thermal-Hydrological Stress",
        official_data="Moderate",
        satellite_data="Moderate",
        model_prediction="High",
        community_reports="High",
        evidence_consistency="Moderate",
        overall_confidence=68,
        summary="Model and community reports align on elevated compound heat-water stress, while satellite and macro official datasets show moderate latency in registering localized ground impacts."
    )

# Portfolios optimizer service
def optimize_portfolios(budget: int, region_id: str) -> List[InterventionPortfolioSchema]:
    scale = budget / 1000000.0 if budget > 0 else 1.0
    return [
        InterventionPortfolioSchema(
            id="PORT-LOW",
            name="Low-Cost Portfolio",
            target_budget=500000,
            allocated_budget=int(480000 * scale if scale != 1.0 else 480000),
            risk_reduction_percent=12,
            equity_benefit_percent=18,
            estimated_population_protected=int(11200 * math.sqrt(scale)),
            tag="Fast Deployment • Rapid Hydration Relief",
            confidence=88,
            cost_effectiveness_ratio="₹42.8 per person protected",
            reserve_amount=20000,
            items=[
                PortfolioItemSchema(category="Early Warning SMS & Radio", amount=int(100000 * scale), description="Broadcast heatwave and safe water notifications to 85,000 residents"),
                PortfolioItemSchema(category="Communal Hydration Kiosks", amount=int(250000 * scale), description="15 temporary shade and ORS hydration points in dense market streets"),
                PortfolioItemSchema(category="Community Volunteer Kits", amount=int(130000 * scale), description="Electrolyte packets and digital infrared thermometers for 60 ward volunteers")
            ]
        ),
        InterventionPortfolioSchema(
            id="PORT-BALANCED",
            name="Balanced Portfolio",
            target_budget=1000000,
            allocated_budget=int(950000 * scale if scale != 1.0 else 950000),
            risk_reduction_percent=27,
            equity_benefit_percent=39,
            estimated_population_protected=int(21400 * math.sqrt(scale)),
            tag="Recommended • Multi-Sector Heat & Water Balance",
            confidence=84,
            cost_effectiveness_ratio="₹44.4 per person protected",
            reserve_amount=50000,
            items=[
                PortfolioItemSchema(category="Cooling Centers", amount=int(250000 * scale), description="Deploy 6 temporary AC & misting community shelters in wards 1 to 4"),
                PortfolioItemSchema(category="Water Access", amount=int(250000 * scale), description="Dedicated potable water tankers and pressurized distribution points"),
                PortfolioItemSchema(category="Healthcare Capacity", amount=int(200000 * scale), description="Equip 3 urban primary health centers with IV fluid and ice packs"),
                PortfolioItemSchema(category="Early Warning", amount=int(100000 * scale), description="Multilingual voice and SMS early warning dispatch network"),
                PortfolioItemSchema(category="Community Response", amount=int(150000 * scale), description="Grassroots rapid response teams and doorstep elder welfare checks")
            ]
        ),
        InterventionPortfolioSchema(
            id="PORT-HIGH",
            name="High-Resilience Portfolio",
            target_budget=2500000,
            allocated_budget=int(2420000 * scale if scale != 1.0 else 2420000),
            risk_reduction_percent=44,
            equity_benefit_percent=51,
            estimated_population_protected=int(36800 * math.sqrt(scale)),
            tag="Structural Resilience • Long-term Adaptive Capital",
            confidence=79,
            cost_effectiveness_ratio="₹65.7 per person protected",
            reserve_amount=80000,
            items=[
                PortfolioItemSchema(category="Solar-Powered Cooling Hubs", amount=int(800000 * scale), description="Permanent microgrid-backed civic cooling centers with backup batteries"),
                PortfolioItemSchema(category="Decentralized Water Filtration", amount=int(750000 * scale), description="3 RO purification units connected to high-yield municipal borewells"),
                PortfolioItemSchema(category="Mobile Health Emergency Units", amount=int(450000 * scale), description="2 equipped electric vans for rapid on-site paramedic triage"),
                PortfolioItemSchema(category="Cool Roof Coating & Urban Tree Cover", amount=int(270000 * scale), description="Reflective paint coating on 200 municipal schools and 500 shade saplings"),
                PortfolioItemSchema(category="Resilience Telemetry & Early Warning", amount=int(150000 * scale), description="Automated weather stations and digital alert displays at transit stops")
            ]
        )
    ]

# Counterfactual scenario service
def get_counterfactual_scenario(region_id: str) -> CounterfactualScenarioSchema:
    return CounterfactualScenarioSchema(
        region_id=region_id,
        scenario_name="Counterfactual: Add Cooling Centers + Water Access",
        description="Compares the business-as-usual unmitigated climate trajectory against targeted municipal cooling center and tanker water intervention.",
        methodology_label="Modelled scenario estimate (Not a validated climate forecast)",
        baseline={
            "risk": 82,
            "resilience": 48,
            "vulnerable_population": 42000
        },
        simulated={
            "risk": 61,
            "resilience": 72,
            "vulnerable_population": 23600,
            "people_protected": 18400
        },
        trajectory=[
            TrajectoryPointSchema(year=2026, baseline_risk=72, simulated_risk=61, resilience_level=72, note="Immediate protection: 18,400 vulnerable individuals buffered from acute heat"),
            TrajectoryPointSchema(year=2027, baseline_risk=76, simulated_risk=58, resilience_level=76, note="Compound benefits: water network stability prevents secondary dehydration waves"),
            TrajectoryPointSchema(year=2028, baseline_risk=81, simulated_risk=54, resilience_level=80, note="Longitudinal adaptive gain: civic cooling habits institutionalized across wards")
        ]
    )

# Resilience ledger service
def get_resilience_ledger(region_id: str) -> List[ResilienceLedgerEntrySchema]:
    return [
        ResilienceLedgerEntrySchema(
            id="LEDGER-01",
            region_id=region_id,
            area_name="North Chennai (Ward 42 / Vyasarpadi)",
            baseline_date="June 2025 (Pre-Intervention)",
            baseline_resilience=48,
            interventions_deployed=[
                "+ 4 Municipal cooling shelters with misting fans",
                "+ 6 Dedicated water refill stations & tanker rosters",
                "+ Multilingual SMS early warning alert system",
                "+ Primary Health Center hydration protocol upgrade"
            ],
            current_date="October 2026 (Post-Audit)",
            current_resilience=67,
            delta=19,
            data_type="Observed change",
            verification_source="TNCCCR Municipal Resilience Audit & Public Health Records",
            notes="Significant decrease in heat stroke emergency admissions recorded during August 2026 heat spike compared to 2025 baseline."
        ),
        ResilienceLedgerEntrySchema(
            id="LEDGER-02",
            region_id=region_id,
            area_name="Central Chennai (Royapettah Ward 112)",
            baseline_date="March 2025",
            baseline_resilience=58,
            interventions_deployed=[
                "+ Shaded bus transit corridors & cool roof paint on municipal markets",
                "+ 8 ORS hydration kiosks at bus depots"
            ],
            current_date="September 2026",
            current_resilience=71,
            delta=13,
            data_type="Observed change",
            verification_source="Metropolitan Transport Corporation & Ward Survey",
            notes="Commuter thermal satisfaction improved by 28%; zero workplace fatalities among outdoor transit workers."
        )
    ]

# Response capacity service
def get_response_capacity(region_id: str) -> ResponseCapacitySchema:
    facilities = [
        FacilityCapacitySchema(id="FAC-01", name="School A (Govt Higher Secondary, Vyasarpadi)", type="School", spaces_available=2, verified=True, coordinates=[13.112, 80.258]),
        FacilityCapacitySchema(id="FAC-02", name="Community Hall B (Kalyana Mandapam, Ward 42)", type="Community Hall", spaces_available=1, verified=True, coordinates=[13.119, 80.264]),
        FacilityCapacitySchema(id="FAC-03", name="Hospital C (Urban Primary Health Center)", type="Hospital", spaces_available=2, verified=True, coordinates=[13.125, 80.252]),
        FacilityCapacitySchema(id="FAC-04", name="NGO D (Red Cross Disaster Resilience Hub)", type="NGO Center", spaces_available=4, verified=True, coordinates=[13.108, 80.271]),
        FacilityCapacitySchema(id="FAC-05", name="Public Building E (Ward 42 Municipal Office Annex)", type="Public Building", spaces_available=3, verified=False, coordinates=[13.115, 80.267])
    ]
    return ResponseCapacitySchema(
        region_id=region_id,
        hazard_type="Extreme Heat & Hydration Emergencies",
        detected_need_count=12,
        available_capacity_count=12,
        coverage_percentage=100,
        status="Sufficient",
        planning_note="Modelled planning tool estimate. Connects community demand with candidate public and NGO assets. Actual deployment requires physical verification.",
        facilities=facilities
    )

# NLP classification service
def classify_nlp_report(text: str) -> NLPClassifyResponse:
    lower = text.lower()
    event = "Climate impact"
    affected_issue = "Civic infrastructure and local welfare"
    severity = "moderate"
    duration = "Recent"

    if any(k in lower for k in ["water", "tanker", "drinking", "tap", "dry"]):
        event = "Water shortage"
        affected_issue = "Water availability & pressure"
    elif any(k in lower for k in ["heat", "temperature", "hot", "sun", "dizzy"]):
        event = "Extreme heat"
        affected_issue = "Thermal strain & cooling accessibility"
    elif any(k in lower for k in ["flood", "waterlog", "drain", "canal", "rain"]):
        event = "Flooding"
        affected_issue = "Stormwater drainage & road transit"
    elif any(k in lower for k in ["power", "electricity", "outage", "current"]):
        event = "Power outage"
        affected_issue = "Distribution feeder continuity"
    elif any(k in lower for k in ["hospital", "clinic", "faint", "stroke", "sick"]):
        event = "Health emergency"
        affected_issue = "First-mile emergency care"

    if any(k in lower for k in ["3 days", "three days", "4 days", "week"]):
        duration = "3 days"
    elif any(k in lower for k in ["24h", "today", "hours"]):
        duration = "24 hours"

    if any(k in lower for k in ["emergency", "severe", "critical", "died", "fainted", "collapsed", "no water for 3 days"]):
        severity = "High"

    return NLPClassifyResponse(
        event=event,
        severity=severity,
        duration=duration,
        location_extracted="Selected location",
        affected_issue=affected_issue
    )
