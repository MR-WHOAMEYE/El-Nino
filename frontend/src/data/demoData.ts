import {
  RegionSummary,
  RiskExplanation,
  EquityPriority,
  EnsoStatus,
  Alert,
  CommunityReport,
  SimulationResult,
  ResourceOptimizationResult,
  AIAdviceResponse
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
