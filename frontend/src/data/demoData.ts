import {
  RegionSummary,
  RiskExplanation,
  EquityPriority,
  EnsoStatus,
  Alert,
  CommunityReport,
  SimulationResult,
  ResourceOptimizationResult,
  AIAdviceResponse,
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

export const DEMO_ENSO_STATUS: EnsoStatus = {
  phase: 'El Niño',
  intensity: 'Moderate',
  trend: 'Strengthening',
  confidence_percentage: 82,
  oni_anomaly: 1.4,
  updated_at: '2026-10-08T06:00:00Z',
};

export const DEMO_REGIONS: Record<string, RegionSummary> = {
  'TN-CHN': {
    id: 'TN-CHN',
    name: 'Chennai Metro',
    parent_region: 'Tamil Nadu, India',
    coordinates: [13.0827, 80.2707],
    population: '11.2M',
    population_num: 11200000,
    overall_impact: 78,
    risk_band: 'HIGH',
    heat_risk: 87,
    water_stress: 72,
    health_risk: 81,
    flood_risk: 64,
    agriculture_risk: 55,
    vulnerability: 73,
    resilience: 61,
    adaptive_capacity: 48,
  },
  'TN-CHN-NORTH': {
    id: 'TN-CHN-NORTH',
    name: 'North Chennai (Wards 1–4)',
    parent_region: 'Tondiarpet & Vyasarpadi, TN',
    coordinates: [13.1400, 80.2900],
    population: '182K',
    population_num: 182000,
    overall_impact: 91,
    risk_band: 'CRITICAL',
    heat_risk: 94,
    water_stress: 86,
    health_risk: 92,
    flood_risk: 78,
    agriculture_risk: 22,
    vulnerability: 88,
    resilience: 42,
    adaptive_capacity: 42,
  },
  'TN-CHN-CENTRAL': {
    id: 'TN-CHN-CENTRAL',
    name: 'Central Chennai (Royapettah / T. Nagar)',
    parent_region: 'Chennai District, TN',
    coordinates: [13.0418, 80.2341],
    population: '450K',
    population_num: 450000,
    overall_impact: 74,
    risk_band: 'HIGH',
    heat_risk: 82,
    water_stress: 70,
    health_risk: 76,
    flood_risk: 58,
    agriculture_risk: 18,
    vulnerability: 68,
    resilience: 64,
    adaptive_capacity: 58,
  },
  'TN-CHN-SOUTH': {
    id: 'TN-CHN-SOUTH',
    name: 'South Chennai (Adyar / OMR)',
    parent_region: 'Chennai District, TN',
    coordinates: [12.9800, 80.2400],
    population: '380K',
    population_num: 380000,
    overall_impact: 65,
    risk_band: 'HIGH',
    heat_risk: 74,
    water_stress: 64,
    health_risk: 60,
    flood_risk: 72,
    agriculture_risk: 25,
    vulnerability: 58,
    resilience: 70,
    adaptive_capacity: 68,
  },
  'TN-CBE': {
    id: 'TN-CBE',
    name: 'Coimbatore Industrial Belt',
    parent_region: 'Western Tamil Nadu, India',
    coordinates: [11.0168, 76.9558],
    population: '2.8M',
    population_num: 2800000,
    overall_impact: 58,
    risk_band: 'ELEVATED',
    heat_risk: 64,
    water_stress: 68,
    health_risk: 52,
    flood_risk: 41,
    agriculture_risk: 62,
    vulnerability: 54,
    resilience: 68,
    adaptive_capacity: 65,
  },
  'TN-MDU': {
    id: 'TN-MDU',
    name: 'Madurai East Urban Clusters',
    parent_region: 'Southern Tamil Nadu, India',
    coordinates: [9.9252, 78.1198],
    population: '1.9M',
    population_num: 1900000,
    overall_impact: 72,
    risk_band: 'HIGH',
    heat_risk: 85,
    water_stress: 79,
    health_risk: 69,
    flood_risk: 44,
    agriculture_risk: 74,
    vulnerability: 68,
    resilience: 57,
    adaptive_capacity: 52,
  },
  'TN-KGI': {
    id: 'TN-KGI',
    name: 'Krishnagiri Agricultural Basin',
    parent_region: 'Northwest Tamil Nadu, India',
    coordinates: [12.5186, 78.2137],
    population: '1.6M',
    population_num: 1600000,
    overall_impact: 76,
    risk_band: 'HIGH',
    heat_risk: 76,
    water_stress: 81,
    health_risk: 58,
    flood_risk: 38,
    agriculture_risk: 86,
    vulnerability: 82,
    resilience: 51,
    adaptive_capacity: 44,
  },
};

// Bundled GeoJSON Ward Polygons for Offline-Safe Full-Bleed MapLibre Rendering
export const CHENNAI_WARDS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'TN-CHN-NORTH',
      properties: {
        id: 'TN-CHN-NORTH',
        name: 'North Chennai (Wards 1–4)',
        risk: 91,
        risk_band: 'CRITICAL',
        vulnerability: 88,
        resilience: 42,
        heat: 94,
        water: 86,
        health: 92,
        flood: 78,
        agriculture: 22,
        pop: '182K',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [80.270, 13.120],
            [80.305, 13.120],
            [80.315, 13.165],
            [80.275, 13.165],
            [80.270, 13.120]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      id: 'TN-CHN-CENTRAL',
      properties: {
        id: 'TN-CHN-CENTRAL',
        name: 'Central Chennai (Royapettah / T. Nagar)',
        risk: 74,
        risk_band: 'HIGH',
        vulnerability: 68,
        resilience: 64,
        heat: 82,
        water: 70,
        health: 76,
        flood: 58,
        agriculture: 18,
        pop: '450K',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [80.220, 13.030],
            [80.265, 13.030],
            [80.275, 13.090],
            [80.225, 13.090],
            [80.220, 13.030]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      id: 'TN-CHN-SOUTH',
      properties: {
        id: 'TN-CHN-SOUTH',
        name: 'South Chennai (Adyar / OMR)',
        risk: 65,
        risk_band: 'HIGH',
        vulnerability: 58,
        resilience: 70,
        heat: 74,
        water: 64,
        health: 60,
        flood: 72,
        agriculture: 25,
        pop: '380K',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [80.210, 12.940],
            [80.265, 12.940],
            [80.270, 13.020],
            [80.215, 13.020],
            [80.210, 12.940]
          ]
        ]
      }
    },
    {
      type: 'Feature',
      id: 'TN-CHN-WEST',
      properties: {
        id: 'TN-CHN-WEST',
        name: 'West Chennai (Anna Nagar / Ambattur)',
        risk: 68,
        risk_band: 'HIGH',
        vulnerability: 62,
        resilience: 66,
        heat: 78,
        water: 69,
        health: 65,
        flood: 52,
        agriculture: 30,
        pop: '510K',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [80.160, 13.060],
            [80.220, 13.060],
            [80.220, 13.125],
            [80.155, 13.125],
            [80.160, 13.060]
          ]
        ]
      }
    }
  ]
};

export const DEMO_RISK_EXPLANATION: Record<string, RiskExplanation> = {
  'TN-CHN': {
    region_id: 'TN-CHN',
    region_name: 'Chennai Metro',
    overall_score: 78,
    risk_band: 'HIGH',
    confidence: 'moderate',
    factors: [
      { factor: 'Surface Temperature Anomaly (+2.1°C)', percentage: 27, category: 'climate' },
      { factor: 'Deficit Rainfall Anomaly (-28%)', percentage: 21, category: 'climate' },
      { factor: 'Groundwater / Reservoir Stress (34% active)', percentage: 18, category: 'environment' },
      { factor: 'Dense Urban Settlement Exposure', percentage: 9, category: 'social' },
      { factor: 'Primary Healthcare Bed Deficit', percentage: 7, category: 'infrastructure' },
      { factor: 'Industrial & Port Zone Drainage Buffer', percentage: 13, category: 'infrastructure' },
      { factor: 'Historical ENSO Thermal Vulnerability', percentage: 5, category: 'climate' }
    ],
    summary: 'Compounding surface thermal anomalies and prolonged precipitation deficit interacting with dense coastal urban heat island conditions.'
  },
  'TN-CHN-NORTH': {
    region_id: 'TN-CHN-NORTH',
    region_name: 'North Chennai (Wards 1–4)',
    overall_score: 91,
    risk_band: 'CRITICAL',
    confidence: 'high',
    factors: [
      { factor: 'Severe Urban Heat Island & Metal Roof Exposure', percentage: 31, category: 'social' },
      { factor: 'High Proportion of Informal & Outdoor Laborers', percentage: 24, category: 'social' },
      { factor: 'Piped Water Insecurity & Tanker Dependency (86/100)', percentage: 19, category: 'environment' },
      { factor: 'Primary Healthcare Surge Bed Deficit', percentage: 14, category: 'infrastructure' },
      { factor: 'Historical Inundation and Drainage Stagnation', percentage: 12, category: 'climate' }
    ],
    summary: 'Compound vulnerability: extreme thermal stress combined with low canopy cover, dense informal housing, and low baseline adaptive buffer.'
  }
};

export const DEMO_EQUITY_PRIORITIES: EquityPriority[] = [
  {
    rank: 1,
    region_id: 'TN-CHN-NORTH',
    name: 'North Chennai (Wards 1–4)',
    risk: 91,
    vulnerability: 88,
    adaptive_capacity: 42,
    population: '182K',
    priority_level: 'IMMEDIATE',
    recommended_actions: [
      'Rapid deployment of misting & shaded cooling centers',
      'Targeted municipal tanker water supply augmentation',
      'Mobile primary healthcare hydration units'
    ]
  },
  {
    rank: 2,
    region_id: 'TN-KGI',
    name: 'Krishnagiri Agricultural Basin',
    risk: 76,
    vulnerability: 82,
    adaptive_capacity: 44,
    population: '145K',
    priority_level: 'IMMEDIATE',
    recommended_actions: [
      'Micro-irrigation & borewell drought contingency',
      'Veterinary shelter heat-stress response',
      'Early heat advisory broadcast to farm workers'
    ]
  },
  {
    rank: 3,
    region_id: 'TN-MDU',
    name: 'Madurai East Urban Clusters',
    risk: 72,
    vulnerability: 68,
    adaptive_capacity: 52,
    population: '210K',
    priority_level: 'HIGH',
    recommended_actions: [
      'Public shaded waiting zones near transit nodes',
      'Community water reservoir replenishment monitoring'
    ]
  },
  {
    rank: 4,
    region_id: 'TN-CHN-CENTRAL',
    name: 'Central Chennai (Royapettah / T. Nagar)',
    risk: 74,
    vulnerability: 68,
    adaptive_capacity: 58,
    population: '450K',
    priority_level: 'HIGH',
    recommended_actions: [
      'Commercial building HVAC load optimization',
      'Hospital surge heat stroke ward readiness'
    ]
  },
  {
    rank: 5,
    region_id: 'TN-CBE',
    name: 'Coimbatore Industrial Belt',
    risk: 58,
    vulnerability: 54,
    adaptive_capacity: 65,
    population: '190K',
    priority_level: 'MODERATE',
    recommended_actions: [
      'Industrial worker shift adjustments during peak heat hours'
    ]
  }
];

export const DEMO_ALERTS: Alert[] = [
  {
    id: 'ALT-2026-001',
    severity: 'CRITICAL',
    title: 'Potential Heat-Health Emergency: Wards 3 & 4 Cluster',
    location: 'North Chennai (Wards 3 & 4)',
    region_id: 'TN-CHN-NORTH',
    description: 'Consecutive modelled wet-bulb temperatures exceeding 31.5°C coupled with high density informal settlement index.',
    indicators: ['Wet-bulb > 31.5°C', 'Tanker supply deficit 38%', 'ER heat cramps surge +42%'],
    recommended_actions: [
      'Open municipal school community cooling centers immediately',
      'Prioritize emergency water bowsers to Zone 4 distribution nodes',
      'Notify outdoor construction & port logistics workers to halt between 11 AM - 3:30 PM'
    ],
    timestamp: '2026-10-08T06:30:00Z',
    is_active: true
  },
  {
    id: 'ALT-2026-002',
    severity: 'HIGH',
    title: 'Agricultural Water Stress Warning',
    location: 'Krishnagiri North Agricultural Basin',
    region_id: 'TN-KGI',
    description: 'Groundwater draft index exceeded safe replenishment threshold under current El Niño dry spell.',
    indicators: ['Soil moisture deficit -28%', 'Reservoir active storage at 34% capacity'],
    recommended_actions: [
      'Implement scheduled rotational tube-well pumping',
      'Issue advisory for drought-resilient millets and pulse hydration'
    ],
    timestamp: '2026-10-08T04:15:00Z',
    is_active: true
  }
];

export const DEMO_REPORTS: CommunityReport[] = [
  {
    id: 'RPT-101',
    region_id: 'TN-CHN-NORTH',
    category: 'Water shortage',
    severity: 'critical',
    location_name: 'Vyasarpadi Ward 32',
    coordinates: [13.118, 80.258],
    description: 'Public tap has had zero water pressure for 3 days. Commercial private tankers charging 3x normal rates.',
    timestamp: '2026-10-08T07:15:00Z'
  },
  {
    id: 'RPT-102',
    region_id: 'TN-CHN-NORTH',
    category: 'Extreme heat',
    severity: 'severe',
    location_name: 'Tondiarpet Market Junction',
    coordinates: [13.129, 80.289],
    description: 'Extreme heat under metal roofing; three elderly street vendors experienced fainting episodes.',
    timestamp: '2026-10-08T06:50:00Z'
  },
  {
    id: 'RPT-103',
    region_id: 'TN-CHN-NORTH',
    category: 'Water shortage',
    severity: 'severe',
    location_name: 'Perambur Barracks Road',
    coordinates: [13.112, 80.264],
    description: 'Local overhead tank dry since yesterday morning. Long queues formed since 5 AM.',
    timestamp: '2026-10-08T06:10:00Z'
  },
  {
    id: 'RPT-104',
    region_id: 'TN-CHN',
    category: 'Health emergency',
    severity: 'moderate',
    location_name: 'Royapettah Government Hospital Outer Zone',
    coordinates: [13.056, 80.261],
    description: 'High influx of dehydration and heat exhaustion cases among transport drivers.',
    timestamp: '2026-10-08T05:30:00Z'
  }
];

export const DEMO_SCENARIO_BASELINE: SimulationResult = {
  baseline_risk: 84,
  simulated_risk: 61,
  baseline_resilience: 54,
  simulated_resilience: 73,
  baseline_vulnerable_population: 42000,
  simulated_vulnerable_population: 23600,
  estimated_people_protected: 18400,
  percentage_improvement: 27.4,
  breakdown: {
    heat_reduction: 14,
    water_stress_reduction: 11,
    health_pressure_reduction: 9,
    adaptive_gain: 19
  }
};

export const DEMO_RESOURCE_OPTIMIZATION: ResourceOptimizationResult = {
  total_budget: 1000000,
  allocations: [
    { category: 'Cooling Centers & Shaded Refuges', amount: 250000, label_formatted: '₹2.5L', percentage: 25, expected_impact: 'Reduces heat vulnerability in Zone 4 by ~14 points' },
    { category: 'Emergency Water Tankers & Distribution', amount: 200000, label_formatted: '₹2.0L', percentage: 20, expected_impact: 'Provides stable hydration to 18,000 residents' },
    { category: 'Healthcare Hydration & ER Beds', amount: 200000, label_formatted: '₹2.0L', percentage: 20, expected_impact: 'Equips 4 primary health centers for heat emergencies' },
    { category: 'Early Warning SMS & Community Radio', amount: 100000, label_formatted: '₹1.0L', percentage: 10, expected_impact: 'Reaches 85% of informal workforce before peak hours' },
    { category: 'Agriculture & Livestock Hydration Reserve', amount: 150000, label_formatted: '₹1.5L', percentage: 15, expected_impact: 'Protects peri-urban dairy and crop nursery clusters' },
    { category: 'Operational Contingency Reserve', amount: 100000, label_formatted: '₹1.0L', percentage: 10, expected_impact: 'Buffered for localized hotspot surges' }
  ],
  estimated_population_protected: 21400,
  estimated_risk_reduction_points: 19,
  equity_focus: 'Prioritized top 2 immediate-level wards in North Chennai'
};

export const DEMO_AI_ADVICE: AIAdviceResponse = {
  recommendation: 'Prioritize a dual heat-hydration intervention in North Chennai Wards 1 to 4 before the anticipated mid-month temperature surge.',
  reasons: [
    'North Chennai exhibits compound vulnerability (Risk 91, Vulnerability 88, Adaptive Capacity 42) driven by high outdoor labor density and low tree canopy cover.',
    'Modelled water stress (86 localized) compounds thermal exhaustion risk, creating acute pressure on primary health centers.',
    'Historical ENSO analog data (2015 & 2023) demonstrates that early hydration stations reduced heat-related hospitalizations by 31% in comparable coastal wards.'
  ],
  expected_effect: 'Modelled scenario indicates a potential reduction in vulnerable population from 42,000 to 23,600 (18,400 protected) and risk reduction from 84 to 61.',
  confidence: 'moderate',
  data_used: [
    'Chennai Meteorological Anomaly Grid (demo-v1)',
    'TN Vulnerability & Census Micro-dataset',
    'Community Intelligence Real-time Cluster Feed',
    'ENSO Multivariate Oceanic Index (ONI +1.4°C)'
  ]
};

// ==========================================
// FEATURE 1: CLIMATE CONSEQUENCE GRAPH DATA
// ==========================================
export const DEMO_CONSEQUENCE_GRAPHS: Record<string, ConsequenceGraphData> = {
  'TN-CHN': {
    region_id: 'TN-CHN',
    region_name: 'Chennai Metro Region',
    root_signal: 'EL NIÑO / EXTREME HEAT TELECONNECTION',
    summary: 'A compound thermal-hydrological cascade propagating from regional oceanic anomaly through municipal infrastructure to frontline community health.',
    active_cascade_path: ['EXTREME_HEAT', 'COOLING_DEMAND', 'ELECTRICITY_GRID_STRESS', 'POWER_OUTAGE_RISK', 'WATER_PUMPING_DISRUPTION', 'WATER_AVAILABILITY_REDUCTION', 'COMMUNITY_HEALTH_RISK'],
    nodes: [
      {
        id: 'EXTREME_HEAT',
        label: 'EXTREME HEAT ANOMALY',
        category: 'signal',
        impact_percent: 18,
        affected_population: 184000,
        confidence: 82,
        severity: 'critical',
        explanation: 'Atmospheric blocking coupled with oceanic warm tongue results in persistent wet-bulb temperatures exceeding 31°C across urban wards.',
        primary_evidence: ['Surface Temperature Anomaly (+2.8°C)', 'Urban Heat Island Delta (3.4°C)', 'Historical Heatwave Return Frequency'],
        upstream_node_ids: [],
        downstream_node_ids: ['COOLING_DEMAND', 'SOIL_MOISTURE_DEFICIT']
      },
      {
        id: 'COOLING_DEMAND',
        label: 'Cooling & Chilling Demand Surge',
        category: 'infrastructural',
        impact_percent: 24,
        affected_population: 184000,
        confidence: 85,
        severity: 'high',
        explanation: 'Residential and commercial AC load spikes by 1,420 MW above baseline during 13:00–17:00 peak hours.',
        primary_evidence: ['TANGEDCO Substation Telemetry', 'Smart Meter Feeder Load', 'Appliance Saturation Index'],
        upstream_node_ids: ['EXTREME_HEAT'],
        downstream_node_ids: ['ELECTRICITY_GRID_STRESS']
      },
      {
        id: 'ELECTRICITY_GRID_STRESS',
        label: 'Distribution Grid Thermal Stress',
        category: 'infrastructural',
        impact_percent: 31,
        affected_population: 142000,
        confidence: 78,
        severity: 'high',
        explanation: 'Overheating of distribution transformers in high-density corridors reduces carrying capacity and triggers localized feeder tripping.',
        primary_evidence: ['Transformer Core Temp Sensors (>95°C)', 'Historical Feeder Outage Logs', 'Distribution Loss Delta'],
        upstream_node_ids: ['COOLING_DEMAND'],
        downstream_node_ids: ['POWER_OUTAGE_RISK']
      },
      {
        id: 'POWER_OUTAGE_RISK',
        label: 'Localized Feeder Outages',
        category: 'infrastructural',
        impact_percent: 19,
        affected_population: 98000,
        confidence: 74,
        severity: 'elevated',
        explanation: 'Intermittent rotational load shedding and localized line faults concentrate in informal settlements lacking redundant circuits.',
        primary_evidence: ['SCADA Tripping Events', 'Citizen Power Outage Reports', 'Transformer Failure Rate'],
        upstream_node_ids: ['ELECTRICITY_GRID_STRESS'],
        downstream_node_ids: ['WATER_PUMPING_DISRUPTION']
      },
      {
        id: 'WATER_PUMPING_DISRUPTION',
        label: 'Municipal Water Pumping Disruption',
        category: 'infrastructural',
        impact_percent: 28,
        affected_population: 115000,
        confidence: 79,
        severity: 'high',
        explanation: 'CMWSSB booster pumps experience intermittent stoppage, depressurizing primary piped networks across northern distribution zones.',
        primary_evidence: ['CMWSSB Pumping Head Pressure Telemetry', 'Header Pipe Pressure Loss (-1.2 bar)', 'Pumping Station Uptime Logs'],
        upstream_node_ids: ['POWER_OUTAGE_RISK'],
        downstream_node_ids: ['WATER_AVAILABILITY_REDUCTION']
      },
      {
        id: 'SOIL_MOISTURE_DEFICIT',
        label: 'Soil Moisture Depletion',
        category: 'environmental',
        impact_percent: -42,
        affected_population: 45000,
        confidence: 88,
        severity: 'high',
        explanation: 'Root-zone moisture in peri-urban belts drops below wilting point due to high evapotranspiration and deficient pre-monsoon showers.',
        primary_evidence: ['SMAP Satellite Soil Moisture (0.12 m³/m³)', 'Agricultural Evaporative Deficit', 'Ground Tensiometer Networks'],
        upstream_node_ids: ['EXTREME_HEAT'],
        downstream_node_ids: ['AGRICULTURAL_STRESS', 'WATER_AVAILABILITY_REDUCTION']
      },
      {
        id: 'AGRICULTURAL_STRESS',
        label: 'Peri-urban Crop & Dairy Stress',
        category: 'economic',
        impact_percent: 22,
        affected_population: 52000,
        confidence: 81,
        severity: 'elevated',
        explanation: 'Horticulture yields and livestock milk output drop by 22% in Tiruvallur and Kanchipuram supply basins.',
        primary_evidence: ['NDVI Vegetation Index Drop (-0.24)', 'Dairy Cooperative Supply Receipts', 'Mandi Inflow Volumes'],
        upstream_node_ids: ['SOIL_MOISTURE_DEFICIT'],
        downstream_node_ids: ['FOOD_PRICE_PRESSURE']
      },
      {
        id: 'FOOD_PRICE_PRESSURE',
        label: 'Perishable Food Price Spikes',
        category: 'economic',
        impact_percent: 16,
        affected_population: 184000,
        confidence: 76,
        severity: 'moderate',
        explanation: 'Supply disruptions increase retail prices of leafy vegetables, tomatoes, and dairy by 16% in neighborhood markets.',
        primary_evidence: ['Koyambedu Wholesale Price Index', 'Consumer Price Monitoring Cell Data'],
        upstream_node_ids: ['AGRICULTURAL_STRESS'],
        downstream_node_ids: ['LOW_INCOME_HOUSEHOLD_VULNERABILITY']
      },
      {
        id: 'WATER_AVAILABILITY_REDUCTION',
        label: 'Potable Water Deficit in Frontline Wards',
        category: 'community',
        impact_percent: 34,
        affected_population: 138000,
        confidence: 83,
        severity: 'critical',
        explanation: 'Severe reduction in tanker delivery rounds and communal tap availability triggers long queues during daytime heat.',
        primary_evidence: ['Tanker GPS Turnaround Logs', 'Citizen Hydration SOS Reports (42 in 24h)', 'Communal Borewell Level Sensors'],
        upstream_node_ids: ['WATER_PUMPING_DISRUPTION', 'SOIL_MOISTURE_DEFICIT'],
        downstream_node_ids: ['COMMUNITY_HEALTH_RISK']
      },
      {
        id: 'LOW_INCOME_HOUSEHOLD_VULNERABILITY',
        label: 'Low-Income Household Coping Deficit',
        category: 'community',
        impact_percent: 27,
        affected_population: 96000,
        confidence: 80,
        severity: 'high',
        explanation: 'Compound cost of bottled water, electricity alternatives, and food reduces disposable income for medical contingencies.',
        primary_evidence: ['Socio-economic Micro-survey 2024', 'Informal Labor Wage Stability Index'],
        upstream_node_ids: ['FOOD_PRICE_PRESSURE'],
        downstream_node_ids: ['COMMUNITY_HEALTH_RISK']
      },
      {
        id: 'COMMUNITY_HEALTH_RISK',
        label: 'Frontline Public Health Emergency',
        category: 'health',
        impact_percent: 38,
        affected_population: 184000,
        confidence: 82,
        severity: 'critical',
        explanation: 'Acute convergence of thermal strain, dehydration, and delayed primary care triggers surge in heat exhaustion and cardiovascular distress.',
        primary_evidence: ['Government Hospital ER Dehydration Admissions (+41%)', '108 Ambulance Heat Distress Calls', '10-Day Excess Mortality Signal'],
        upstream_node_ids: ['WATER_AVAILABILITY_REDUCTION', 'LOW_INCOME_HOUSEHOLD_VULNERABILITY'],
        downstream_node_ids: []
      }
    ]
  }
};

// Default fallback for any region ID
DEMO_CONSEQUENCE_GRAPHS['TN-CHN-NORTH'] = {
  ...DEMO_CONSEQUENCE_GRAPHS['TN-CHN'],
  region_id: 'TN-CHN-NORTH',
  region_name: 'North Chennai (Ward 42 / Vyasarpadi)',
  summary: 'Intense industrial and high-density corridor where thermal anomalies directly trigger grid outages and immediate drinking water supply shocks.'
};

// ==========================================
// FEATURE 2: INVISIBLE POPULATION ENGINE DATA
// ==========================================
export const DEMO_INVISIBLE_POPULATION: Record<string, InvisiblePopulationData> = {
  'TN-CHN': {
    region_id: 'TN-CHN',
    region_name: 'Chennai Metro Region',
    climate_risk: 78,
    population_total: 11200000,
    estimated_invisible_risk: 86,
    estimated_vulnerable_population: 186000,
    outdoor_worker_exposure: 'HIGH',
    cooling_access: 'LOW',
    healthcare_access: 'MODERATE',
    water_access: 'LOW',
    mobility_constraints: 'MODERATE',
    explanation: 'Conventional hazard models register moderate risk across the wider metropolitan area, but fail to account for high concentrations of gig-economy drivers, construction laborers, and uninsulated tin-roof dwellings.',
    model_label: 'Modelled estimate (SHAP adaptive-capacity weighting)',
    factors: [
      { name: 'Outdoor Workforce Density', status: 'CRITICAL', impact_score: 92, description: 'Over 28% of working adults engage in unshaded street vending, manual logistics, or construction.' },
      { name: 'Thermal Inequity / Roof Type', status: 'HIGH', impact_score: 87, description: 'Corrugated asbestos and tin roof dwellings create indoor heat retention 4.5°C higher than ambient.' },
      { name: 'First-Mile Healthcare Barrier', status: 'MODERATE', impact_score: 68, description: 'Average transit time to active heat-stroke capable ER exceeds 26 minutes during midday traffic.' },
      { name: 'Water Distribution Bottleneck', status: 'CRITICAL', impact_score: 91, description: 'Reliance on private tanker queues forces hours of direct exposure in peak sunlight.' }
    ]
  },
  'TN-CHN-NORTH': {
    region_id: 'TN-CHN-NORTH',
    region_name: 'North Chennai (Ward 42 / Vyasarpadi)',
    climate_risk: 72,
    population_total: 80000,
    estimated_invisible_risk: 93,
    estimated_vulnerable_population: 18600,
    outdoor_worker_exposure: 'HIGH',
    cooling_access: 'LOW',
    healthcare_access: 'LOW',
    water_access: 'LOW',
    mobility_constraints: 'HIGH',
    explanation: 'Conventional hazard risk is moderate (72), but adaptive capacity is low with severe outdoor labor concentration and cooling deficits. This increases the estimated human impact score to 93.',
    model_label: 'Modelled estimate (SHAP adaptive-capacity weighting)',
    factors: [
      { name: 'Outdoor Workforce Density', status: 'CRITICAL', impact_score: 96, description: 'Port logistics and heavy transport laborers with 9+ hours of continuous thermal exposure.' },
      { name: 'Public Cooling Refuge Access', status: 'CRITICAL', impact_score: 93, description: 'Zero air-conditioned civic shelters or misting centers within 2.5 km radius.' },
      { name: 'Healthcare Capacity Deficit', status: 'HIGH', impact_score: 88, description: 'Primary health center operates at 180% capacity with scarce electrolyte replenishment stock.' },
      { name: 'Municipal Piped Water Deficit', status: 'CRITICAL', impact_score: 94, description: 'Water delivery frequency dropped from daily to once every 3.5 days.' }
    ]
  }
};

// ==========================================
// FEATURE 3: RISK × CONFIDENCE INTELLIGENCE
// ==========================================
export const DEMO_CONFIDENCE_METADATA: Record<string, ConfidenceMetadata> = {
  'TN-CHN': {
    region_id: 'TN-CHN',
    overall_risk: 82,
    overall_confidence: 71,
    heat_confidence: 84,
    flood_confidence: 62,
    water_confidence: 76,
    health_confidence: 65,
    model_version: 'CLIMA-RISK-v2.4 (Ensemble XGBoost + SHAP)',
    last_calibrated: '2026-10-08T04:30:00Z',
    data_freshness: [
      { layer: 'Weather Telemetry', source: 'Open-Meteo & IMD Radars', updated_ago: '24 minutes ago', resolution: '0.1° Gridded (High)', status: 'fresh' },
      { layer: 'Surface Vegetation (NDVI)', source: 'Copernicus Sentinel-2', updated_ago: '8 days ago', resolution: '10m Multi-spectral', status: 'fresh' },
      { layer: 'Population Density', source: 'GPWv4 & 2025 Census Estimate', updated_ago: '2025 Demographic Projection', resolution: '100m Microgrid', status: 'fresh' },
      { layer: 'ENSO Phase & ONI Index', source: 'NOAA CPC / BOM Oceanic Buoys', updated_ago: 'Latest available observation', resolution: 'Equatorial Pacific Basin', status: 'fresh' },
      { layer: 'Healthcare Bed Occupancy', source: 'State Health Management Information System', updated_ago: '45 days ago (Partial)', resolution: 'District Aggregation Only', status: 'gap' }
    ]
  },
  'TN-CHN-NORTH': {
    region_id: 'TN-CHN-NORTH',
    overall_risk: 84,
    overall_confidence: 68,
    heat_confidence: 82,
    flood_confidence: 54,
    water_confidence: 72,
    health_confidence: 58,
    model_version: 'CLIMA-RISK-v2.4 (Ensemble XGBoost + SHAP)',
    last_calibrated: '2026-10-08T04:30:00Z',
    data_freshness: [
      { layer: 'Weather Telemetry', source: 'Open-Meteo & IMD Radars', updated_ago: '24 minutes ago', resolution: '0.1° Gridded (High)', status: 'fresh' },
      { layer: 'Surface Vegetation (NDVI)', source: 'Copernicus Sentinel-2', updated_ago: '8 days ago', resolution: '10m Multi-spectral', status: 'fresh' },
      { layer: 'Population Density', source: 'GPWv4 & 2025 Census Estimate', updated_ago: '2025 Demographic Projection', resolution: '100m Microgrid', status: 'fresh' },
      { layer: 'ENSO Phase & ONI Index', source: 'NOAA CPC / BOM Oceanic Buoys', updated_ago: 'Latest available observation', resolution: 'Equatorial Pacific Basin', status: 'fresh' },
      { layer: 'Local Stormwater Runoff Gauges', source: 'Municipal Sensors', updated_ago: 'Offline (Sensor Battery Deficit)', resolution: 'Ward-level', status: 'gap' }
    ]
  }
};

// ==========================================
// FEATURE 4: DATA BLIND SPOT DETECTOR DATA
// ==========================================
export const DEMO_DATA_BLIND_SPOTS: Record<string, DataBlindSpot[]> = {
  'TN-CHN': [
    {
      id: 'BLIND-01',
      region_id: 'TN-CHN',
      title: 'Healthcare capacity data incomplete',
      domain: 'Healthcare',
      severity: 'CRITICAL',
      description: 'Healthcare capacity and emergency hydration surge data is unavailable for 38% of the selected metropolitan region.',
      coverage_gap_percent: 38,
      current_confidence: 71,
      potential_confidence: 84,
      impact_note: 'Confidence could improve with additional healthcare data.',
      recommended_sensor_or_survey: 'Integrate real-time emergency room bed and hydration telemetry from secondary dispensaries.'
    },
    {
      id: 'BLIND-02',
      region_id: 'TN-CHN',
      title: 'Groundwater table monitoring gap in peri-urban belt',
      domain: 'Water Infrastructure',
      severity: 'MODERATE',
      description: 'Piezometric sensor network has 42% spatial coverage gap across southern and northern aquifer recharge zones.',
      coverage_gap_percent: 42,
      current_confidence: 76,
      potential_confidence: 87,
      impact_note: 'Confidence in 30-day water stress prognosis could improve with ground hydrometric data.',
      recommended_sensor_or_survey: 'Deploy telemetry data loggers on 18 municipal monitoring borewells.'
    },
    {
      id: 'BLIND-03',
      region_id: 'TN-CHN',
      title: 'Informal settlement demographic freshness latency',
      domain: 'Population',
      severity: 'ADVISORY',
      description: 'Migrant construction workforce inflows in northern transport corridors are under-represented by 2021 census baselines.',
      coverage_gap_percent: 24,
      current_confidence: 79,
      potential_confidence: 88,
      impact_note: 'Potentially underestimates unshaded daytime labor counts by ~22,000 individuals.',
      recommended_sensor_or_survey: 'Conduct rapid ward-level mobile GIS enumerations with community health volunteers.'
    }
  ],
  'TN-CHN-NORTH': [
    {
      id: 'BLIND-NORTH-01',
      region_id: 'TN-CHN-NORTH',
      title: 'Healthcare capacity data unavailable for 38% of Ward 42',
      domain: 'Healthcare',
      severity: 'CRITICAL',
      description: 'Healthcare capacity and primary hydration readiness data is unavailable for 38% of the selected region.',
      coverage_gap_percent: 38,
      current_confidence: 71,
      potential_confidence: 84,
      impact_note: 'Confidence could improve with additional healthcare data.',
      recommended_sensor_or_survey: 'Municipal dispensary bed and hydration inventory census.'
    },
    {
      id: 'BLIND-NORTH-02',
      region_id: 'TN-CHN-NORTH',
      title: 'Stormwater canal sediment level telemetry offline',
      domain: 'Water Infrastructure',
      severity: 'MODERATE',
      description: 'Basin Bridge drainage culverts lack ultrasonic level transmitters, obscuring local waterlogging triggers.',
      coverage_gap_percent: 65,
      current_confidence: 54,
      potential_confidence: 78,
      impact_note: 'Causes divergence between numerical flood models and citizen waterlogging reports.',
      recommended_sensor_or_survey: 'Install IoT ultrasonic culvert depth sensors.'
    }
  ]
};

// ==========================================
// FEATURE 5: MODEL vs COMMUNITY CONFLICT DETECTOR
// ==========================================
export const DEMO_MODEL_COMMUNITY_CONFLICTS: Record<string, ModelCommunityConflict[]> = {
  'TN-CHN': [
    {
      id: 'CONF-01',
      region_id: 'TN-CHN',
      location_name: 'North Chennai (Ward 42 / Vyasarpadi - Basin Bridge)',
      hazard_type: 'Local Inundation & Storm Drain Waterlogging',
      model_estimate: 'Flood risk = LOW (Score 34)',
      community_observations: '17 reports of repeated waterlogging',
      satellite_evidence: 'MODERATE (Sentinel-1 SAR surface water anomaly +0.18)',
      official_data: 'Low historical flood return categorization (1-in-10 yr)',
      conflict_severity: 'HIGH',
      recommended_action: 'Field verification recommended.',
      adjusted_confidence: 52,
      is_verified: false,
      explanation: 'The model currently estimates low flood risk based on macro topography, but recent community observations indicate repeated local waterlogging caused by silted culverts. Confidence has been adjusted downward pending ground inspection.'
    },
    {
      id: 'CONF-02',
      region_id: 'TN-CHN',
      location_name: 'Royapettah Market Corridor',
      hazard_type: 'Potable Water Tanker Scarcity',
      model_estimate: 'Water Stress = MODERATE (Score 62)',
      community_observations: '29 verified citizen reports of zero tanker arrivals over 72 hours',
      satellite_evidence: 'HIGH (Thermal anomaly indicates prolonged asphalt queue exposure)',
      official_data: 'Tanker schedule dispatched as normal per central roster',
      conflict_severity: 'MODERATE',
      recommended_action: 'Audit GPS telemetry on municipal distribution tankers.',
      adjusted_confidence: 61,
      is_verified: true,
      explanation: 'Official dispatch records report scheduled delivery, but grassroots verified logs report severe localized driver rerouting away from narrow lanes.'
    }
  ],
  'TN-CHN-NORTH': [
    {
      id: 'CONF-NORTH-01',
      region_id: 'TN-CHN-NORTH',
      location_name: 'Ward 42 (Vyasarpadi Lowlands)',
      hazard_type: 'Waterlogging & Drainage Backflow',
      model_estimate: 'Flood risk = LOW',
      community_observations: '17 reports of repeated waterlogging',
      satellite_evidence: 'MODERATE',
      official_data: 'Low historical flood zone',
      conflict_severity: 'HIGH',
      recommended_action: 'Field verification recommended.',
      adjusted_confidence: 52,
      is_verified: false,
      explanation: 'The model currently estimates low flood risk, but recent community observations indicate repeated local waterlogging. Field verification recommended.'
    }
  ]
};

// ==========================================
// FEATURE 12: COMMUNITY vs MODEL EVIDENCE OVERVIEW
// ==========================================
export const DEMO_EVIDENCE_OVERVIEW: Record<string, EvidenceOverview> = {
  'TN-CHN': {
    region_id: 'TN-CHN',
    hazard: 'Compound Thermal-Hydrological Stress',
    official_data: 'Moderate',
    satellite_data: 'Moderate',
    model_prediction: 'High',
    community_reports: 'High',
    evidence_consistency: 'Moderate',
    overall_confidence: 68,
    summary: 'Model and community reports align on elevated compound heat-water stress, while satellite and macro official datasets show moderate latency in registering localized ground impacts.'
  },
  'TN-CHN-NORTH': {
    region_id: 'TN-CHN-NORTH',
    hazard: 'Compound Heatwave & Micro-Waterlogging',
    official_data: 'Moderate',
    satellite_data: 'Moderate',
    model_prediction: 'High',
    community_reports: 'High',
    evidence_consistency: 'Moderate',
    overall_confidence: 68,
    summary: 'High citizen report density indicates critical micro-level distress that official static datasets have not yet captured.'
  }
};

// ==========================================
// FEATURE 6 & 14: INTERVENTION OPTIMIZER & PORTFOLIOS
// ==========================================
export const DEMO_INTERVENTION_PORTFOLIOS: Record<string, InterventionPortfolio[]> = {
  'TN-CHN': [
    {
      id: 'PORT-LOW',
      name: 'Low-Cost Portfolio',
      target_budget: 500000,
      allocated_budget: 480000,
      risk_reduction_percent: 12,
      equity_benefit_percent: 18,
      estimated_population_protected: 11200,
      tag: 'Fast Deployment • Rapid Hydration Relief',
      confidence: 88,
      cost_effectiveness_ratio: '₹42.8 per person protected',
      reserve_amount: 20000,
      items: [
        { category: 'Early Warning SMS & Radio', amount: 100000, description: 'Broadcast heatwave and safe water notifications to 85,000 residents' },
        { category: 'Communal Hydration Kiosks', amount: 250000, description: '15 temporary shade and ORS hydration points in dense market streets' },
        { category: 'Community Volunteer Kits', amount: 130000, description: 'Electrolyte packets and digital infrared thermometers for 60 ward volunteers' }
      ]
    },
    {
      id: 'PORT-BALANCED',
      name: 'Balanced Portfolio',
      target_budget: 1000000,
      allocated_budget: 950000,
      risk_reduction_percent: 27,
      equity_benefit_percent: 39,
      estimated_population_protected: 21400,
      tag: 'Recommended • Multi-Sector Heat & Water Balance',
      confidence: 84,
      cost_effectiveness_ratio: '₹44.4 per person protected',
      reserve_amount: 50000,
      items: [
        { category: 'Cooling Centers', amount: 250000, description: 'Deploy 6 temporary AC & misting community shelters in wards 1 to 4' },
        { category: 'Water Access', amount: 250000, description: 'Dedicated potable water tankers and pressurized distribution points' },
        { category: 'Healthcare Capacity', amount: 200000, description: 'Equip 3 urban primary health centers with IV fluid and ice packs' },
        { category: 'Early Warning', amount: 100000, description: 'Multilingual voice and SMS early warning dispatch network' },
        { category: 'Community Response', amount: 150000, description: 'Grassroots rapid response teams and doorstep elder welfare checks' }
      ]
    },
    {
      id: 'PORT-HIGH',
      name: 'High-Resilience Portfolio',
      target_budget: 2500000,
      allocated_budget: 2420000,
      risk_reduction_percent: 44,
      equity_benefit_percent: 51,
      estimated_population_protected: 36800,
      tag: 'Structural Resilience • Long-term Adaptive Capital',
      confidence: 79,
      cost_effectiveness_ratio: '₹65.7 per person protected',
      reserve_amount: 80000,
      items: [
        { category: 'Solar-Powered Cooling Hubs', amount: 800000, description: 'Permanent microgrid-backed civic cooling centers with backup batteries' },
        { category: 'Decentralized Water Filtration', amount: 750000, description: '3 RO purification units connected to high-yield municipal borewells' },
        { category: 'Mobile Health Emergency Units', amount: 450000, description: '2 equipped electric vans for rapid on-site paramedic triage' },
        { category: 'Cool Roof Coating & Urban Tree Cover', amount: 270000, description: 'Reflective paint coating on 200 municipal schools and 500 shade saplings' },
        { category: 'Resilience Telemetry & Early Warning', amount: 150000, description: 'Automated weather stations and digital alert displays at transit stops' }
      ]
    }
  ]
};

// Default clone for sub-regions
DEMO_INTERVENTION_PORTFOLIOS['TN-CHN-NORTH'] = DEMO_INTERVENTION_PORTFOLIOS['TN-CHN'];

// ==========================================
// FEATURE 8 & 9: COUNTERFACTUAL SIMULATOR DATA
// ==========================================
export const DEMO_COUNTERFACTUAL_SCENARIOS: Record<string, CounterfactualScenarioResult> = {
  'TN-CHN-NORTH': {
    region_id: 'TN-CHN-NORTH',
    scenario_name: 'Counterfactual: Add Cooling Centers + Water Access',
    description: 'Compares the business-as-usual unmitigated climate trajectory against targeted municipal cooling center and tanker water intervention.',
    methodology_label: 'Modelled scenario estimate (Not a validated climate forecast)',
    baseline: {
      risk: 82,
      resilience: 48,
      vulnerable_population: 42000
    },
    simulated: {
      risk: 61,
      resilience: 72,
      vulnerable_population: 23600,
      people_protected: 18400
    },
    trajectory: [
      { year: 2026, baseline_risk: 72, simulated_risk: 61, resilience_level: 72, note: 'Immediate protection: 18,400 vulnerable individuals buffered from acute heat' },
      { year: 2027, baseline_risk: 76, simulated_risk: 58, resilience_level: 76, note: 'Compound benefits: water network stability prevents secondary dehydration waves' },
      { year: 2028, baseline_risk: 81, simulated_risk: 54, resilience_level: 80, note: 'Longitudinal adaptive gain: civic cooling habits institutionalized across wards' }
    ]
  },
  'TN-CHN': {
    region_id: 'TN-CHN',
    scenario_name: 'Counterfactual: Add Cooling Centers + Water Access',
    description: 'Compares the business-as-usual unmitigated climate trajectory against targeted municipal cooling center and tanker water intervention.',
    methodology_label: 'Modelled scenario estimate (Not a validated climate forecast)',
    baseline: {
      risk: 82,
      resilience: 48,
      vulnerable_population: 42000
    },
    simulated: {
      risk: 61,
      resilience: 72,
      vulnerable_population: 23600,
      people_protected: 18400
    },
    trajectory: [
      { year: 2026, baseline_risk: 72, simulated_risk: 61, resilience_level: 72, note: 'Immediate protection: 18,400 vulnerable individuals buffered from acute heat' },
      { year: 2027, baseline_risk: 76, simulated_risk: 58, resilience_level: 76, note: 'Compound benefits: water network stability prevents secondary dehydration waves' },
      { year: 2028, baseline_risk: 81, simulated_risk: 54, resilience_level: 80, note: 'Longitudinal adaptive gain: civic cooling habits institutionalized across wards' }
    ]
  }
};

// ==========================================
// FEATURE 13: RESILIENCE OUTCOME LEDGER DATA
// ==========================================
export const DEMO_RESILIENCE_LEDGER: Record<string, ResilienceLedgerEntry[]> = {
  'TN-CHN': [
    {
      id: 'LEDGER-01',
      region_id: 'TN-CHN',
      area_name: 'North Chennai (Ward 42 / Vyasarpadi)',
      baseline_date: 'June 2025 (Pre-Intervention)',
      baseline_resilience: 48,
      interventions_deployed: [
        '+ 4 Municipal cooling shelters with misting fans',
        '+ 6 Dedicated water refill stations & tanker rosters',
        '+ Multilingual SMS early warning alert system',
        '+ Primary Health Center hydration protocol upgrade'
      ],
      current_date: 'October 2026 (Post-Audit)',
      current_resilience: 67,
      delta: 19,
      data_type: 'Observed change',
      verification_source: 'TNCCCR Municipal Resilience Audit & Public Health Records',
      notes: 'Significant decrease in heat stroke emergency admissions recorded during August 2026 heat spike compared to 2025 baseline.'
    },
    {
      id: 'LEDGER-02',
      region_id: 'TN-CHN',
      area_name: 'Central Chennai (Royapettah Ward 112)',
      baseline_date: 'March 2025',
      baseline_resilience: 58,
      interventions_deployed: [
        '+ Shaded bus transit corridors & cool roof paint on municipal markets',
        '+ 8 ORS hydration kiosks at bus depots'
      ],
      current_date: 'September 2026',
      current_resilience: 71,
      delta: 13,
      data_type: 'Observed change',
      verification_source: 'Metropolitan Transport Corporation & Ward Survey',
      notes: 'Commuter thermal satisfaction improved by 28%; zero workplace fatalities among outdoor transit workers.'
    },
    {
      id: 'LEDGER-03',
      region_id: 'TN-CHN',
      area_name: 'South Chennai (Velachery Ward 177)',
      baseline_date: 'November 2024',
      baseline_resilience: 44,
      interventions_deployed: [
        '+ Stormwater macro-drain desiltation & retention pond dredging',
        '+ IoT water-level sensor telemetry at 4 critical culverts'
      ],
      current_date: 'August 2026',
      current_resilience: 63,
      delta: 19,
      data_type: 'Modelled change',
      verification_source: 'Hydrological Simulation Calibrated by 2025 Monsoon Data',
      notes: 'Modelled flood inundation clearance time reduced from 36 hours to 8.5 hours.'
    }
  ]
};

DEMO_RESILIENCE_LEDGER['TN-CHN-NORTH'] = DEMO_RESILIENCE_LEDGER['TN-CHN'];

// ==========================================
// FEATURE 15: CLIMATE RESPONSE MATCHING DATA
// ==========================================
export const DEMO_RESPONSE_CAPACITY: Record<string, ResponseCapacityData> = {
  'TN-CHN': {
    region_id: 'TN-CHN',
    hazard_type: 'Extreme Heat & Hydration Emergencies',
    detected_need_count: 12,
    available_capacity_count: 12,
    coverage_percentage: 100,
    status: 'Sufficient',
    planning_note: 'Modelled planning tool estimate. Connects community demand with candidate public and NGO assets. Actual deployment requires physical verification.',
    facilities: [
      { id: 'FAC-01', name: 'School A (Govt Higher Secondary, Vyasarpadi)', type: 'School', spaces_available: 2, verified: true, coordinates: [13.112, 80.258] },
      { id: 'FAC-02', name: 'Community Hall B (Kalyana Mandapam, Ward 42)', type: 'Community Hall', spaces_available: 1, verified: true, coordinates: [13.119, 80.264] },
      { id: 'FAC-03', name: 'Hospital C (Urban Primary Health Center)', type: 'Hospital', spaces_available: 2, verified: true, coordinates: [13.125, 80.252] },
      { id: 'FAC-04', name: 'NGO D (Red Cross Disaster Resilience Hub)', type: 'NGO Center', spaces_available: 4, verified: true, coordinates: [13.108, 80.271] },
      { id: 'FAC-05', name: 'Public Building E (Ward 42 Municipal Zonal Office Annex)', type: 'Public Building', spaces_available: 3, verified: false, coordinates: [13.115, 80.267] }
    ]
  },
  'TN-CHN-NORTH': {
    region_id: 'TN-CHN-NORTH',
    hazard_type: 'Extreme Heat & Hydration Emergencies',
    detected_need_count: 12,
    available_capacity_count: 12,
    coverage_percentage: 100,
    status: 'Sufficient',
    planning_note: 'Modelled planning tool estimate. Connects community demand with candidate public and NGO assets. Actual deployment requires physical verification.',
    facilities: [
      { id: 'FAC-01', name: 'School A (Govt Higher Secondary, Vyasarpadi)', type: 'School', spaces_available: 2, verified: true, coordinates: [13.112, 80.258] },
      { id: 'FAC-02', name: 'Community Hall B (Kalyana Mandapam, Ward 42)', type: 'Community Hall', spaces_available: 1, verified: true, coordinates: [13.119, 80.264] },
      { id: 'FAC-03', name: 'Hospital C (Urban Primary Health Center)', type: 'Hospital', spaces_available: 2, verified: true, coordinates: [13.125, 80.252] },
      { id: 'FAC-04', name: 'NGO D (Red Cross Disaster Resilience Hub)', type: 'NGO Center', spaces_available: 4, verified: true, coordinates: [13.108, 80.271] },
      { id: 'FAC-05', name: 'Public Building E (Ward 42 Municipal Zonal Office Annex)', type: 'Public Building', spaces_available: 3, verified: false, coordinates: [13.115, 80.267] }
    ]
  }
};

// ==========================================
// FEATURE 10: CLIMATE TIME MACHINE DATA
// ==========================================
export const DEMO_TIME_MACHINE: Record<string, TimeMachineData> = {
  'TN-CHN': {
    region_id: 'TN-CHN',
    region_name: 'Chennai Metro Region',
    summary: 'Multi-decadal analog comparison tracking ENSO intensification from the 2015 super-event to 2026 present conditions and 2030 counterfactual scenarios.',
    periods: [
      {
        year: 2015,
        temperature_anomaly: 1.1,
        rainfall_anomaly_mm: -280,
        water_stress_index: 74,
        vegetation_health_ndvi: 0.48,
        population_exposed: 8900000,
        infrastructure_stress: 68,
        vulnerability_score: 72,
        resilience_score: 42,
        is_counterfactual: false
      },
      {
        year: 2023,
        temperature_anomaly: 1.6,
        rainfall_anomaly_mm: -140,
        water_stress_index: 80,
        vegetation_health_ndvi: 0.42,
        population_exposed: 10400000,
        infrastructure_stress: 74,
        vulnerability_score: 70,
        resilience_score: 51,
        is_counterfactual: false
      },
      {
        year: 2026,
        temperature_anomaly: 2.1,
        rainfall_anomaly_mm: -220,
        water_stress_index: 86,
        vegetation_health_ndvi: 0.38,
        population_exposed: 11200000,
        infrastructure_stress: 82,
        vulnerability_score: 73,
        resilience_score: 48,
        is_counterfactual: false
      },
      {
        year: 2030,
        temperature_anomaly: 2.7,
        rainfall_anomaly_mm: -310,
        water_stress_index: 94,
        vegetation_health_ndvi: 0.31,
        population_exposed: 12100000,
        infrastructure_stress: 91,
        vulnerability_score: 84,
        resilience_score: 38,
        is_counterfactual: false // Business-As-Usual
      },
      {
        year: 2030,
        temperature_anomaly: 2.7,
        rainfall_anomaly_mm: -310,
        water_stress_index: 62,
        vegetation_health_ndvi: 0.54,
        population_exposed: 12100000,
        infrastructure_stress: 49,
        vulnerability_score: 48,
        resilience_score: 76,
        is_counterfactual: true // With CLIMA-SHIELD Adaptation Portfolio
      }
    ]
  }
};

DEMO_TIME_MACHINE['TN-CHN-NORTH'] = DEMO_TIME_MACHINE['TN-CHN'];

