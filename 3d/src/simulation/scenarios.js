/**
 * ============================================================================
 * ENSO SCENARIO PRESETS
 * ============================================================================
 * Standard canonical climate regimes for classroom, hackathon, and policy demos.
 */

export const SCENARIO_PRESETS = [
  {
    id: 'normal',
    name: 'Neutral / Climatological Normal',
    description: 'Equatorial trade winds blow steadily from east to west, confining the warm pool to the western Pacific. Ocean upwelling remains robust along South America, maintaining standard monsoon cycles.',
    initialState: {
      tradeWind: 0.60,
      warmPoolX: 0.25,
      thermoclineSlope: 0.85,
      heatContent: 0.05,
      nino34: 0.05,
      month: 0,
      year: 1,
      westerlyBurstActive: false,
      kelvinWavePosition: -1.0
    },
    cameraPreset: 'overview',
    recommendedSpeed: 1.0
  },
  {
    id: 'weakening_winds',
    name: 'Weakening Trade Winds (Onset Phase)',
    description: 'Easterly trade winds begin relaxing across the western-central Pacific basin. Reduced wind stress halts deep cold-water upwelling and triggers downwelling equatorial Kelvin wave pulses.',
    initialState: {
      tradeWind: 0.38,
      warmPoolX: 0.32,
      thermoclineSlope: 0.65,
      heatContent: 0.40,
      nino34: 0.65,
      month: 3,
      year: 1,
      westerlyBurstActive: true,
      kelvinWavePosition: 0.15
    },
    cameraPreset: 'walker',
    recommendedSpeed: 1.2
  },
  {
    id: 'warm_water_shift',
    name: 'Warm Water Shift (Eastward Migration)',
    description: 'The vast Indo-Pacific warm pool migrates thousands of kilometers eastward across the International Date Line. Deep convection and torrential rainfall track the warm pool, destabilizing Asian monsoons.',
    initialState: {
      tradeWind: 0.28,
      warmPoolX: 0.58,
      thermoclineSlope: 0.42,
      heatContent: 0.25,
      nino34: 1.45,
      month: 7,
      year: 1,
      westerlyBurstActive: false,
      kelvinWavePosition: -1.0
    },
    cameraPreset: 'crossSection',
    recommendedSpeed: 1.0
  },
  {
    id: 'strong_el_nino',
    name: 'Super El Niño (1997/98 & 2015/16 Analogue)',
    description: 'Trade winds nearly collapse or reverse in the central Pacific as Niño 3.4 SST anomalies exceed +2.2°C. Severe agricultural droughts grip Southeast Asia and central India while coastal Peru experiences catastrophic flooding.',
    initialState: {
      tradeWind: 0.18,
      warmPoolX: 0.78,
      thermoclineSlope: 0.20,
      heatContent: -0.15,
      nino34: 2.45,
      month: 10,
      year: 1,
      westerlyBurstActive: false,
      kelvinWavePosition: -1.0
    },
    cameraPreset: 'indiaFocus',
    recommendedSpeed: 0.8
  },
  {
    id: 'la_nina_onset',
    name: 'La Niña Onset (Cooling Rebound)',
    description: 'Equatorial upper-ocean heat discharge triggers a rapid rebound as trade winds re-accelerate. Cold upwelling surges along the equator, establishing the Pacific cold tongue.',
    initialState: {
      tradeWind: 0.74,
      warmPoolX: 0.18,
      thermoclineSlope: 0.95,
      heatContent: -0.55,
      nino34: -0.75,
      month: 4,
      year: 2,
      westerlyBurstActive: false,
      kelvinWavePosition: -1.0
    },
    cameraPreset: 'southeastAsiaFocus',
    recommendedSpeed: 1.2
  },
  {
    id: 'strong_la_nina',
    name: 'Strong La Niña (Intense Cold Phase)',
    description: 'Trade winds blow with ferocious strength, compacting warm waters into the Maritime Continent. Monsoonal floods inundate Southeast Asia while coastal South America endures extreme arid conditions.',
    initialState: {
      tradeWind: 0.88,
      warmPoolX: 0.10,
      thermoclineSlope: 1.10,
      heatContent: -0.85,
      nino34: -1.85,
      month: 11,
      year: 2,
      westerlyBurstActive: false,
      kelvinWavePosition: -1.0
    },
    cameraPreset: 'overview',
    recommendedSpeed: 1.0
  },
  {
    id: 'double_dip_la_nina',
    name: 'Multi-Year / Double-Dip La Niña',
    description: 'Persistent subsurface cooling prevents the ocean-atmosphere system from returning to neutral for consecutive annual cycles. Compounding water stress and recurrent flood disasters test regional civil infrastructure.',
    initialState: {
      tradeWind: 0.82,
      warmPoolX: 0.12,
      thermoclineSlope: 1.05,
      heatContent: -0.92,
      nino34: -1.50,
      month: 6,
      year: 3,
      westerlyBurstActive: false,
      kelvinWavePosition: -1.0
    },
    cameraPreset: 'overview',
    recommendedSpeed: 1.5
  }
];
