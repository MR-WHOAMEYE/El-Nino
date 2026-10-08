/**
 * Physical & numerical constants for the simplified Recharge-Oscillator
 * and Bjerknes feedback ENSO educational simulator.
 * All units and interpretations are documented below.
 */

export const SIMULATION_CONFIG = {
  // --- Atmospheric Wind Forcing ---
  // Baseline trade wind strength (dimensionless normalized 0-1, where 0.6 = climatological neutral trade winds)
  TRADE_WIND_BASELINE: 0.6,
  // Minimum and maximum allowable trade wind values in manual controls
  TRADE_WIND_MIN: 0.1,
  TRADE_WIND_MAX: 1.0,

  // --- Warm Pool Spatial Coordinate ---
  // warmPoolX coordinate: 0.0 corresponds to Western Pacific Warm Pool (~130°E),
  // 0.25 corresponds to neutral mean state (~160°E),
  // 1.0 corresponds to Eastern Pacific (~90°W off Ecuador / Peru).
  WARM_POOL_NEUTRAL_X: 0.25,
  // Spatial displacement sensitivity of warm pool center per unit of Niño 3.4 SST anomaly
  WARM_POOL_DISPLACEMENT_COEFF: 0.20,
  // Relaxation time scale (lag in months) for warm pool migration relative to instant SST anomaly
  WARM_POOL_LAG_MONTHS: 2.0,

  // --- Recharge Oscillator Dynamical Coefficients ---
  // d(nino34)/dt = a * windForcing + b * heatContent + c * nino34 - d * nino34^3
  // a: Coupling strength between equatorial trade wind anomaly and eastern Pacific SST change (deg C / month / wind_unit)
  COEFF_A_WIND: 1.60,
  // b: Influence of western Pacific subsurface heat content recharge on surface anomaly growth (deg C / month / heat_unit)
  COEFF_B_HEAT: 1.25,
  // c: Linear Bjerknes positive feedback coefficient (growth rate, 1/month)
  COEFF_C_BJERKNES: 0.75,
  // d: Non-linear damping / cubic saturation term to prevent unbounded runaway (1 / (deg C^2 * month))
  COEFF_D_CUBIC_DAMPING: 0.11,

  // d(heatContent)/dt = -e * nino34 - f * heatContent
  // e: Sverdrup heat discharge rate caused by eastern warming / Kelvin wave export (heat_unit / (deg C * month))
  COEFF_E_DISCHARGE: 0.45,
  // f: Background thermocline memory relaxation rate (1/month)
  COEFF_F_HEAT_DAMPING: 0.28,

  // --- Seasonal Phase Locking ---
  // ENSO events historically peak in boreal winter (Nov - Jan, months 10 to 0).
  // Amplitude of seasonal modulation in Bjerknes feedback strength
  SEASONAL_LOCK_AMPLITUDE: 0.35,
  // Month index of peak coupling (11 = December)
  SEASONAL_PEAK_MONTH: 11,

  // --- ENSO Phase Thresholds (NOAA / BoM standard) ---
  // Sea surface temperature anomaly in Niño 3.4 region (°C)
  NINO34_EL_NINO_THRESHOLD: 0.5,
  NINO34_STRONG_EL_NINO_THRESHOLD: 1.5,
  NINO34_LA_NINA_THRESHOLD: -0.5,
  NINO34_STRONG_LA_NINA_THRESHOLD: -1.5,

  // --- Thermocline Tilting ---
  // Thermocline depth slope difference (normalized 0 to 1). 1 = steep normal/La Niña upwelling, 0 = flattened El Niño
  THERMOCLINE_NORMAL_SLOPE: 0.85,
  THERMOCLINE_EL_NINO_MIN_SLOPE: 0.15,

  // --- Seeded Noise ---
  NOISE_AMPLITUDE: 0.04,

  // --- Time Integration Defaults ---
  DEFAULT_DT_MONTHS: 0.1, // Smooth sub-month integration steps
  MONTHS_IN_YEAR: 12,

  // --- 3D Scene Visual Scales ---
  MAP_EXTENTS: {
    lonMin: -180,
    lonMax: 180,
    latMin: -60,
    latMax: 60
  },
  // Projection scaling and elevation constants
  PROJECTION: {
    // Scene units per degree (0.1 means 360° span = 36 scene units, 120° latitude span = 12 scene units)
    SCALE: 0.1,
    // Cut line in the mid-Atlantic (25° West) so the Pacific basin remains seamless and central
    CUT_LON: -25.0,
    // Elevation heights in 3D world units
    OCEAN_Y: 0.0,
    LAND_BASE_Y: 0.02,
    LAND_HEIGHT: 0.18
  },
  OCEAN_GRID: {
    widthSegments: 128,
    heightSegments: 64,
    lowGraphicsWidth: 64,
    lowGraphicsHeight: 32
  },
  PARTICLES: {
    high: 3200,
    low: 1200
  }
};
