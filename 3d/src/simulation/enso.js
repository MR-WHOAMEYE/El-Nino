/**
 * ============================================================================
 * ENSO RECHARGE-OSCILLATOR & BJERKNES FEEDBACK MODEL
 * ============================================================================
 * 
 * SCIENTIFIC BACKGROUND & EDUCATIONAL SIMPLIFICATION:
 * The El Niño-Southern Oscillation (ENSO) is an irregular coupled ocean-atmosphere
 * periodic fluctuation. Jin (1997) and Cane & Zebiak formulated the "Recharge-Oscillator"
 * conceptual framework:
 * 1. Positive Bjerknes Feedback: Anomalous warming in the central/eastern Pacific relaxes
 *    the zonal sea surface temperature (SST) gradient, weakening the trade winds. Weaker
 *    trades reduce equatorial upwelling and thermocline tilt, compounding the warming.
 * 2. Negative Heat Content Recharge/Discharge: The warmed eastern basin flattens the
 *    thermocline, which causes Sverdrup transport to diverge warm water poleward,
 *    eventually exhausting equatorial upper-ocean heat content (discharge phase).
 * 3. Delayed Rebound / La Niña: With subsurface heat depleted, cool water upwells along
 *    the equator, strengthening the trade winds and overshooting into a cold phase (La Niña).
 * 
 * DISCLAIMER:
 * This model is a 2-degree-of-freedom deterministic educational simplification
 * designed for intuitive interaction and climate equity education. It captures the
 * cyclic rhythm, phase transitions, and teleconnection triggers without requiring
 * solving full primitive Navier-Stokes and ocean general circulation models (OGCMs).
 * ============================================================================
 */

import { SIMULATION_CONFIG } from './config.js';

/**
 * Seeded pseudo-random number generator (Mulberry32) for reproducible demos.
 */
export function createPRNG(seed = 123456789) {
  let s = Math.floor(seed);
  return function nextRandom() {
    s |= 0;
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Creates a pristine initial simulation state.
 */
export function createInitialState(customOverrides = {}) {
  return {
    tradeWind: SIMULATION_CONFIG.TRADE_WIND_BASELINE,
    warmPoolX: SIMULATION_CONFIG.WARM_POOL_NEUTRAL_X,
    thermoclineSlope: SIMULATION_CONFIG.THERMOCLINE_NORMAL_SLOPE,
    heatContent: 0.05,
    nino34: 0.0,
    phase: 'Neutral',
    month: 0, // 0 = Jan, 11 = Dec
    year: 1,
    elapsedMonths: 0.0,
    westerlyBurstActive: false,
    kelvinWavePosition: -1.0, // -1 means inactive; 0.0 to 1.0 = traversing west to east
    seed: 4242,
    ...customOverrides
  };
}

/**
 * Classifies the ENSO phase based on the standard Niño 3.4 index.
 * @param {number} nino34 - SST anomaly in degrees Celsius
 * @returns {'Strong El Niño' | 'El Niño' | 'Neutral' | 'La Niña' | 'Strong La Niña'}
 */
export function classifyPhase(nino34) {
  if (nino34 >= SIMULATION_CONFIG.NINO34_STRONG_EL_NINO_THRESHOLD) {
    return 'Strong El Niño';
  }
  if (nino34 >= SIMULATION_CONFIG.NINO34_EL_NINO_THRESHOLD) {
    return 'El Niño';
  }
  if (nino34 <= SIMULATION_CONFIG.NINO34_STRONG_LA_NINA_THRESHOLD) {
    return 'Strong La Niña';
  }
  if (nino34 <= SIMULATION_CONFIG.NINO34_LA_NINA_THRESHOLD) {
    return 'La Niña';
  }
  return 'Neutral';
}

/**
 * Deterministic single-step integration of the coupled ENSO model.
 * Pure function: takes current state, parameter overrides, and time increment in months.
 *
 * @param {Object} state - Current simulation state
 * @param {Object} [params] - Optional custom tuning parameters
 * @param {number} [dtMonths=0.1] - Time step in fractional months
 * @returns {Object} Next simulation state
 */
export function step(state, params = {}, dtMonths = SIMULATION_CONFIG.DEFAULT_DT_MONTHS) {
  const p = { ...SIMULATION_CONFIG, ...params };
  const prng = createPRNG((state.seed || 1) + Math.floor(state.elapsedMonths * 100));

  // Current variables
  let {
    tradeWind,
    warmPoolX,
    thermoclineSlope,
    heatContent,
    nino34,
    month,
    year,
    elapsedMonths,
    westerlyBurstActive,
    kelvinWavePosition,
    seed
  } = state;

  // 1. Wind forcing: deviation from climatological mean (weaker winds -> positive forcing)
  // Wind anomaly is positive when trade winds weaken below 0.6
  let windForcing = p.TRADE_WIND_BASELINE - tradeWind;

  // If a westerly wind burst is active, inject an abrupt positive anomaly pulse
  if (westerlyBurstActive) {
    windForcing += 0.45;
  }

  // 2. Seasonal phase-locking: ENSO coupling strengthens towards boreal autumn/winter
  const seasonalAngle = (month / 12) * Math.PI * 2;
  const seasonalFactor = 1.0 + p.SEASONAL_LOCK_AMPLITUDE * Math.cos(seasonalAngle - (p.SEASONAL_PEAK_MONTH / 12) * Math.PI * 2);

  // 3. Recharge-Oscillator coupled differential equations:
  // d(nino34)/dt:
  // + a * windForcing (wind relaxation warms east Pacific)
  // + b * heatContent (high western heat primes eastward thermocline surge)
  // + c * nino34 * seasonalFactor (Bjerknes positive feedback)
  // - d * nino34^3 (cubic saturation dampens extreme swings)
  const dNinoDt =
    p.COEFF_A_WIND * windForcing +
    p.COEFF_B_HEAT * heatContent +
    p.COEFF_C_BJERKNES * seasonalFactor * nino34 -
    p.COEFF_D_CUBIC_DAMPING * Math.pow(nino34, 3) +
    (prng() - 0.5) * p.NOISE_AMPLITUDE;

  // d(heatContent)/dt:
  // - e * nino34 (warm eastern surface exports heat poleward via geostrophic diverge)
  // - f * heatContent (gradual dissipation toward equilibrium)
  const dHeatDt =
    -p.COEFF_E_DISCHARGE * nino34 -
    p.COEFF_F_HEAT_DAMPING * heatContent;

  // Forward Euler integration
  nino34 = clamp(nino34 + dNinoDt * dtMonths, -3.2, 3.8);
  heatContent = clamp(heatContent + dHeatDt * dtMonths, -1.2, 1.2);

  // 4. Warm Pool Zonal Migration (warmPoolX):
  // Target position is derived from Nino 3.4 SST anomaly:
  // During neutral, sits at 0.25 (western Pacific).
  // Strong El Niño shifts it toward 0.85 (central/eastern Pacific).
  // Strong La Niña contracts it west toward 0.08.
  const targetWarmPoolX = clamp(
    p.WARM_POOL_NEUTRAL_X + (nino34 / 3.0) * 0.60,
    0.05,
    0.95
  );

  // Smooth lag filter (exponential easing with lag ~ 2 months)
  const alphaWarmPool = clamp(dtMonths / p.WARM_POOL_LAG_MONTHS, 0.01, 1.0);
  warmPoolX = warmPoolX + (targetWarmPoolX - warmPoolX) * alphaWarmPool;

  // 5. Thermocline Tilt Slope:
  // Neutral/La Niña: high tilt (warm water piled up west, cold upwelling east).
  // El Niño: tilt collapses toward flat as warm water sloshes eastward.
  if (nino34 >= 0) {
    const flattenFactor = clamp(Math.abs(warmPoolX - p.WARM_POOL_NEUTRAL_X) * 1.5, 0, 0.85);
    thermoclineSlope = clamp(p.THERMOCLINE_NORMAL_SLOPE - flattenFactor, p.THERMOCLINE_EL_NINO_MIN_SLOPE, 1.0);
  } else {
    // La Niña: slope steepens beyond baseline
    const steepenFactor = clamp(Math.abs(nino34) * 0.12, 0, 0.25);
    thermoclineSlope = clamp(p.THERMOCLINE_NORMAL_SLOPE + steepenFactor, 0.5, 1.1);
  }

  // 6. Kelvin wave propagation tracker
  if (westerlyBurstActive) {
    if (kelvinWavePosition < 0.0) {
      kelvinWavePosition = 0.0;
    } else {
      kelvinWavePosition += dtMonths * 0.45; // Takes ~2.2 months to cross Pacific
      if (kelvinWavePosition >= 1.0) {
        kelvinWavePosition = -1.0;
        westerlyBurstActive = false; // Wave has hit South American coast
      }
    }
  }

  // 7. Time advancement
  const newElapsedMonths = elapsedMonths + dtMonths;
  const newMonth = Math.floor(newElapsedMonths) % 12;
  const newYear = 1 + Math.floor(newElapsedMonths / 12);

  return {
    tradeWind,
    warmPoolX,
    thermoclineSlope,
    heatContent,
    nino34,
    phase: classifyPhase(nino34),
    month: newMonth,
    year: newYear,
    elapsedMonths: newElapsedMonths,
    westerlyBurstActive,
    kelvinWavePosition,
    seed: seed + 1
  };
}
