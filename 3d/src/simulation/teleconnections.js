/**
 * ============================================================================
 * ENSO REGIONAL TELECONNECTIONS ENGINE
 * ============================================================================
 * 
 * Maps global Niño 3.4 SST anomalies to localized monthly rainfall (percentage anomaly, %)
 * and surface temperature anomalies (°C) for representative South and Southeast Asian
 * communities (plus Lima, Peru for Pacific basin contrast).
 * 
 * SCIENTIFIC FOUNDATION & RULES:
 * 1. Indian Southwest Monsoon (Jun-Sep / JJAS):
 *    El Niño shifts the ascending branch of the Walker circulation eastward, inducing
 *    subsidence and suppressed convection over Central/North India (Mumbai, Delhi, Kolkata, Dhaka).
 * 2. Indian Northeast Monsoon (Oct-Dec / OND):
 *    Tamil Nadu & Coromandel Coast (Chennai, Madurai) experience enhanced low-level moisture
 *    convergence during El Niño autumns, often experiencing above-normal rainfall or flash floods.
 * 3. Southeast Asia Dryness (Maritime Continent & Indochina):
 *    Jakarta, Manila, Bangkok, Ho Chi Minh City exhibit persistent drought and elevated temperatures
 *    under El Niño due to suppressed warm-pool convection and atmospheric subsidence.
 * 4. Eastern Pacific Peruvian Coast (Lima):
 *    Severe El Niño weakens coastal upwelling and triggers localized torrential coastal storms.
 * 
 * DISCLAIMER:
 * These coefficients represent generalized historical teleconnection tendencies
 * for educational exploration. Real atmospheric monsoons are additionally modulated by
 * the Indian Ocean Dipole (IOD), Madden-Julian Oscillation (MJO), and Atlantic variability.
 * ============================================================================
 */

export const DISTRICT_TELECONNECTIONS = {
  mumbai: {
    name: 'Mumbai',
    country: 'India',
    // Peak sensitivity during Southwest Monsoon (June=5, July=6, Aug=7, Sept=8)
    activeMonths: [5, 6, 7, 8],
    rainSensitivity: -18.5, // % rainfall anomaly per +1°C Niño 3.4
    tempSensitivity: 0.65,  // °C temp anomaly per +1°C Niño 3.4
    laNinaFactor: 0.75,     // La Niña symmetric response factor (often slightly weaker)
    confidence: 'high',
    mechanism: 'Suppressed ascending limb of Walker circulation over central-western India delays monsoon onset and enhances break-monsoon spells.'
  },
  delhi: {
    name: 'Delhi NCR',
    country: 'India',
    activeMonths: [5, 6, 7, 8],
    rainSensitivity: -16.0,
    tempSensitivity: 0.85,
    laNinaFactor: 0.70,
    confidence: 'high',
    mechanism: 'Deficit monsoon precipitation combined with anomalous pre-monsoon and mid-season heat dome occurrences.'
  },
  kolkata: {
    name: 'Kolkata',
    country: 'India',
    activeMonths: [5, 6, 7, 8, 9],
    rainSensitivity: -14.2,
    tempSensitivity: 0.55,
    laNinaFactor: 0.80,
    confidence: 'medium',
    mechanism: 'Reduced depression frequency emerging from the Bay of Bengal into the Gangetic delta.'
  },
  chennai: {
    name: 'Chennai',
    country: 'India',
    // Peak sensitivity during Northeast Monsoon (Oct=9, Nov=10, Dec=11)
    activeMonths: [9, 10, 11],
    rainSensitivity: 22.5, // Positive teleconnection! El Niño brings heavy coastal rain
    tempSensitivity: -0.25,
    laNinaFactor: 0.85,
    confidence: 'high',
    mechanism: 'Equatorial wind anomalies steer anomalous cyclonic shear zones and moisture toward the Coromandel coast in Oct-Dec.'
  },
  madurai: {
    name: 'Madurai',
    country: 'India',
    activeMonths: [9, 10, 11],
    rainSensitivity: 19.0,
    tempSensitivity: -0.20,
    laNinaFactor: 0.80,
    confidence: 'medium',
    mechanism: 'Strengthened Northeast monsoon moisture flux across southern Tamil Nadu hinterland.'
  },
  bengaluru: {
    name: 'Bengaluru',
    country: 'India',
    activeMonths: [5, 6, 7, 8, 9, 10],
    rainSensitivity: -11.5,
    tempSensitivity: 0.60,
    laNinaFactor: 0.70,
    confidence: 'medium',
    mechanism: 'Inland Deccan plateau shadow effect compounding rainfall deficits and groundwater recharge stress.'
  },
  jakarta: {
    name: 'Jakarta',
    country: 'Indonesia',
    activeMonths: [5, 6, 7, 8, 9, 10],
    rainSensitivity: -26.0,
    tempSensitivity: 0.90,
    laNinaFactor: 0.90,
    confidence: 'high',
    mechanism: 'Equatorial Pacific warm pool migration away from Maritime Continent drives atmospheric divergence and severe dry-season drought.'
  },
  manila: {
    name: 'Manila',
    country: 'Philippines',
    activeMonths: [0, 1, 2, 3, 4, 10, 11],
    rainSensitivity: -22.0,
    tempSensitivity: 0.80,
    laNinaFactor: 0.85,
    confidence: 'high',
    mechanism: 'Typhoon genesis tracks shift eastward into the open central Pacific, leaving western archipelago dry, followed by intense La Niña downpours.'
  },
  bangkok: {
    name: 'Bangkok',
    country: 'Thailand',
    activeMonths: [4, 5, 6, 7, 8, 9, 10],
    rainSensitivity: -19.5,
    tempSensitivity: 0.75,
    laNinaFactor: 0.75,
    confidence: 'high',
    mechanism: 'Weakened summer monsoon trough over the Indochinese peninsula leading to low dam storage and agricultural drought.'
  },
  ho_chi_minh: {
    name: 'Ho Chi Minh City',
    country: 'Vietnam',
    activeMonths: [4, 5, 6, 7, 8, 9, 10],
    rainSensitivity: -18.0,
    tempSensitivity: 0.70,
    laNinaFactor: 0.80,
    confidence: 'medium',
    mechanism: 'Suppressed convection over the Lower Mekong Basin compounding seasonal salinity intrusion.'
  },
  colombo: {
    name: 'Colombo',
    country: 'Sri Lanka',
    activeMonths: [4, 5, 9, 10, 11],
    rainSensitivity: -12.0,
    tempSensitivity: 0.50,
    laNinaFactor: 0.75,
    confidence: 'medium',
    mechanism: 'Bimodal monsoon interactions showing modest early summer deficits balanced by autumn rainfall volatility.'
  },
  dhaka: {
    name: 'Dhaka',
    country: 'Bangladesh',
    activeMonths: [5, 6, 7, 8, 9],
    rainSensitivity: -15.5,
    tempSensitivity: 0.65,
    laNinaFactor: 0.80,
    confidence: 'medium',
    mechanism: 'Suppressed moisture transport along the Bay of Bengal low-level jet into the Brahmaputra-Meghna delta.'
  },
  lima: {
    name: 'Lima',
    country: 'Peru',
    activeMonths: [0, 1, 2, 3],
    rainSensitivity: 45.0, // High rainfall anomaly during coastal El Niño
    tempSensitivity: 1.80,
    laNinaFactor: 0.90,
    confidence: 'high',
    mechanism: 'Direct proximity to eastern Pacific coastal warming suppresses Humboldt upwelling, triggering episodic desert cloudbursts and debris flows.'
  }
};

/**
 * Calculates current rainfall anomaly (%), temperature anomaly (°C), and hazard flag.
 * 
 * @param {string} districtId - Identifier from districts.json
 * @param {number} nino34 - Nino 3.4 SST anomaly in °C
 * @param {number} month - Current month index (0 to 11)
 * @returns {Object} Anomaly report
 */
export function calculateDistrictAnomaly(districtId, nino34, month) {
  const tele = DISTRICT_TELECONNECTIONS[districtId] || {
    activeMonths: [5, 6, 7, 8],
    rainSensitivity: -15,
    tempSensitivity: 0.5,
    laNinaFactor: 0.75,
    confidence: 'medium',
    mechanism: 'Standard tropical teleconnection'
  };

  const isActiveSeason = tele.activeMonths.includes(month);
  // Seasonal weighting: 1.0 during active months, 0.25 background during non-monsoon
  const seasonalWeight = isActiveSeason ? 1.0 : 0.25;

  let rainAnomaly = 0.0;
  let tempAnomaly = 0.0;

  if (nino34 >= 0) {
    rainAnomaly = tele.rainSensitivity * nino34 * seasonalWeight;
    tempAnomaly = tele.tempSensitivity * nino34 * seasonalWeight;
  } else {
    // La Niña typically reverses sign
    rainAnomaly = -tele.rainSensitivity * Math.abs(nino34) * tele.laNinaFactor * seasonalWeight;
    tempAnomaly = -tele.tempSensitivity * Math.abs(nino34) * tele.laNinaFactor * seasonalWeight;
  }

  // Hazard classification
  let hazardType = 'Normal';
  if (rainAnomaly <= -20.0) {
    hazardType = 'Severe Drought';
  } else if (rainAnomaly <= -10.0) {
    hazardType = 'Moderate Drought';
  } else if (rainAnomaly >= 25.0) {
    hazardType = 'Severe Flood / Excess Rain';
  } else if (rainAnomaly >= 12.0) {
    hazardType = 'Moderate Excess Rain';
  } else if (tempAnomaly >= 1.0) {
    hazardType = 'Elevated Heat Stress';
  }

  return {
    districtId,
    month,
    isActiveSeason,
    rainfallAnomaly: Number(rainAnomaly.toFixed(1)), // %
    temperatureAnomaly: Number(tempAnomaly.toFixed(2)), // °C
    hazardType,
    confidence: tele.confidence,
    mechanism: tele.mechanism
  };
}

/**
 * ============================================================================
 * CLIMATE REGIONS TELECONNECTION RULES
 * ============================================================================
 * Illustrative teleconnection coefficients mapping Niño 3.4 SST anomalies
 * to percentage rainfall and temperature deviations across continental zones.
 */
export const REGION_TELECONNECTIONS = {
  'india-north': {
    rainCoeff: -9.0,
    tempCoeff: 0.70,
    activeMonths: [5, 6, 7, 8],
    lagMonths: 2,
    confidence: 'medium',
    thresholds: { droughtBelow: -10, floodAbove: 15 },
    note: 'Southwest summer monsoon deficit with elevated pre-monsoon heat dome frequency.'
  },
  'india-west': {
    rainCoeff: -11.0,
    tempCoeff: 0.65,
    activeMonths: [5, 6, 7, 8],
    lagMonths: 1,
    confidence: 'medium',
    thresholds: { droughtBelow: -10, floodAbove: 15 },
    note: 'Delayed summer monsoon onset and prolonged break spells over Maharashtra & Gujarat.'
  },
  'india-south-east': {
    rainCoeff: 8.0, // Positive in El Niño, reversed for La Niña
    tempCoeff: -0.20,
    activeMonths: [9, 10, 11],
    lagMonths: 2,
    confidence: 'medium',
    thresholds: { droughtBelow: -10, floodAbove: 15 },
    note: 'Northeast monsoon (Oct-Dec) enhanced by low-level cyclonic shear along Coromandel coast.'
  },
  'india-east': {
    rainCoeff: -9.0,
    tempCoeff: 0.55,
    activeMonths: [5, 6, 7, 8],
    lagMonths: 2,
    confidence: 'medium',
    thresholds: { droughtBelow: -10, floodAbove: 15 },
    note: 'Suppressed Bay of Bengal depressions entering the Gangetic delta and Odisha.'
  },
  'south-asia-other': {
    rainCoeff: -8.0,
    tempCoeff: 0.50,
    activeMonths: [5, 6, 7, 8],
    lagMonths: 1,
    confidence: 'medium',
    thresholds: { droughtBelow: -10, floodAbove: 15 },
    note: 'Regional monsoon weakening impacting Indus and Brahmaputra headwaters.'
  },
  'indonesia': {
    rainCoeff: -14.0,
    tempCoeff: 0.90,
    activeMonths: [6, 7, 8, 9, 10],
    lagMonths: 1,
    confidence: 'high',
    thresholds: { droughtBelow: -12, floodAbove: 15 },
    note: 'Eastward warm pool migration halts convection, triggering severe peatland drought and haze.'
  },
  'philippines': {
    rainCoeff: -10.0,
    tempCoeff: 0.75,
    activeMonths: [9, 10, 11, 0, 1, 2],
    lagMonths: 2,
    confidence: 'medium',
    thresholds: { droughtBelow: -10, floodAbove: 15 },
    note: 'Typhoon genesis tracks displaced into central Pacific, leading to dry season water deficits.'
  },
  'indochina': {
    rainCoeff: -8.0,
    tempCoeff: 0.70,
    activeMonths: [10, 11, 0, 1, 2, 3],
    lagMonths: 2,
    confidence: 'medium',
    thresholds: { droughtBelow: -10, floodAbove: 15 },
    note: 'Suppressed dry-season rainfall and agricultural reservoir depletion across Mekong basin.'
  },
  'australia-north': {
    rainCoeff: -10.0,
    tempCoeff: 0.80,
    activeMonths: [5, 6, 7, 8, 9, 10],
    lagMonths: 1,
    confidence: 'high',
    thresholds: { droughtBelow: -10, floodAbove: 15 },
    note: 'Weakened tropical wet season and delayed Northern Australian monsoon arrival.'
  },
  'australia-east': {
    rainCoeff: -10.0,
    tempCoeff: 0.85,
    activeMonths: [5, 6, 7, 8, 9, 10],
    lagMonths: 1,
    confidence: 'high',
    thresholds: { droughtBelow: -10, floodAbove: 15 },
    note: 'Murray-Darling agricultural heartland exposed to prolonged droughts and bushfire hazard.'
  },
  'australia-west': {
    rainCoeff: -3.0,
    tempCoeff: 0.40,
    activeMonths: [5, 6, 7, 8, 9, 10],
    lagMonths: 1,
    confidence: 'low',
    thresholds: { droughtBelow: -8, floodAbove: 12 },
    note: 'Modest drying signals primarily driven by south-eastern Indian Ocean temperature gradients.'
  },
  'papua-and-pacific-islands': {
    rainCoeff: -10.0,
    tempCoeff: 0.65,
    activeMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    lagMonths: 0,
    confidence: 'medium',
    thresholds: { droughtBelow: -10, floodAbove: 15 },
    note: 'Direct exposure to shifting convective branch resulting in highland frosts and water shortages.'
  },
  'peru-ecuador-coast': {
    rainCoeff: 22.0, // High positive anomaly in El Niño
    tempCoeff: 1.80,
    activeMonths: [11, 0, 1, 2, 3],
    lagMonths: 1,
    confidence: 'high',
    thresholds: { droughtBelow: -10, floodAbove: 18 },
    note: 'Coastal Pacific warming chokes upwelling, triggering devastating flash floods and mudslides.'
  },
  'brazil-north-amazon': {
    rainCoeff: -9.0,
    tempCoeff: 0.75,
    activeMonths: [6, 7, 8, 9, 10, 11],
    lagMonths: 2,
    confidence: 'medium',
    thresholds: { droughtBelow: -10, floodAbove: 15 },
    note: 'Suppressed convection over tropical rainforest causing historical river low-flow extremes.'
  },
  'brazil-south-argentina': {
    rainCoeff: 8.0,
    tempCoeff: 0.45,
    activeMonths: [9, 10, 11, 0, 1, 2],
    lagMonths: 2,
    confidence: 'medium',
    thresholds: { droughtBelow: -10, floodAbove: 15 },
    note: 'Subtropical jet deflection channeling surplus moisture over the Pampas agricultural zone.'
  },
  'us-southwest-and-mexico': {
    rainCoeff: 6.0,
    tempCoeff: -0.30,
    activeMonths: [10, 11, 0, 1, 2],
    lagMonths: 3,
    confidence: 'medium',
    thresholds: { droughtBelow: -8, floodAbove: 12 },
    note: 'Pacific storm track shifts southward, delivering above-normal winter precipitation.'
  },
  'east-africa': {
    rainCoeff: 7.0,
    tempCoeff: 0.40,
    activeMonths: [9, 10, 11],
    lagMonths: 2,
    confidence: 'medium',
    thresholds: { droughtBelow: -8, floodAbove: 12 },
    note: 'Short Rains (Oct-Dec) amplified by warm western Indian Ocean teleconnections.'
  },
  'southern-africa': {
    rainCoeff: -8.0,
    tempCoeff: 0.70,
    activeMonths: [10, 11, 0, 1, 2],
    lagMonths: 3,
    confidence: 'medium',
    thresholds: { droughtBelow: -10, floodAbove: 15 },
    note: 'Summer rainfall deficits causing cereal harvest collapse and regional hydropower stress.'
  },
  'other-land': {
    rainCoeff: 0.0,
    tempCoeff: 0.0,
    activeMonths: [],
    lagMonths: 0,
    confidence: 'low',
    thresholds: { droughtBelow: -10, floodAbove: 15 },
    note: 'Continental terrain outside primary tropical ENSO teleconnection corridors.'
  }
};

/**
 * Computes anomaly dictionary for all climate regions under current ENSO state.
 */
export function computeRegionAnomalies(nino34, month, laNinaScale = 0.70) {
  const anomalies = {};

  Object.entries(REGION_TELECONNECTIONS).forEach(([regId, def]) => {
    const isActive = def.activeMonths.length === 0 || def.activeMonths.includes(month);
    const seasonWeight = isActive ? 1.0 : 0.25;

    let rain = 0;
    let temp = 0;

    if (nino34 >= 0) {
      rain = def.rainCoeff * nino34 * seasonWeight;
      temp = def.tempCoeff * nino34 * seasonWeight;
    } else {
      // La Niña reverses sign at ~70% magnitude
      rain = -def.rainCoeff * Math.abs(nino34) * laNinaScale * seasonWeight;
      temp = -def.tempCoeff * Math.abs(nino34) * laNinaScale * seasonWeight;
    }

    let hazard = 'normal';
    if (rain <= (def.thresholds?.droughtBelow ?? -10)) {
      hazard = 'drought';
    } else if (rain >= (def.thresholds?.floodAbove ?? 15)) {
      hazard = 'flood';
    }

    const intensity = Math.min(1.0, Math.abs(rain) / 25.0);

    anomalies[regId] = {
      regionId: regId,
      rainfallAnomaly: Number(rain.toFixed(1)),
      temperatureAnomaly: Number(temp.toFixed(2)),
      hazard,
      intensity: Number(intensity.toFixed(2)),
      confidence: def.confidence,
      note: def.note
    };
  });

  return anomalies;
}

/**
 * Generates an illustrative 12-month anomaly trajectory for a district under a specified Nino 3.4 anomaly.
 */
export function generateAnnualProfile(districtId, nino34) {
  const profile = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let m = 0; m < 12; m++) {
    const anomaly = calculateDistrictAnomaly(districtId, nino34, m);
    profile.push({
      monthIndex: m,
      monthName: monthNames[m],
      rainfallAnomaly: anomaly.rainfallAnomaly,
      temperatureAnomaly: anomaly.temperatureAnomaly,
      hazardType: anomaly.hazardType
    });
  }
  return profile;
}


