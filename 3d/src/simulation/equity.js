/**
 * ============================================================================
 * CLIMATE RESILIENCE EQUITY & VULNERABILITY ENGINE
 * ============================================================================
 * Computes multidimensional socioeconomic vulnerability, hazard risk,
 * Lorenz inequality distributions, and recommendation stability under uncertainty.
 */

import { calculateDistrictAnomaly } from './teleconnections.js';
import { createPRNG, clamp } from './enso.js';

export const DEFAULT_EQUITY_WEIGHTS = {
  poverty: 0.35,
  cropDependence: 0.25,
  irrigationDeficit: 0.20,
  housingFragility: 0.20
};

/**
 * Calculates normalized composite vulnerability score (0.0 to 1.0)
 * Vulnerability = w1*Poverty + w2*CropDependence + w3*(1 - Irrigation) + w4*HousingFragility
 */
export function calculateVulnerabilityScore(district, weights = DEFAULT_EQUITY_WEIGHTS) {
  const sumWeights = (weights.poverty + weights.cropDependence + weights.irrigationDeficit + weights.housingFragility) || 1.0;
  const wPoverty = weights.poverty / sumWeights;
  const wCrop = weights.cropDependence / sumWeights;
  const wIrrig = weights.irrigationDeficit / sumWeights;
  const wHousing = weights.housingFragility / sumWeights;

  const irrigationDeficit = 1.0 - (district.irrigationCoverage || 0);
  const score =
    (district.povertyRate || 0) * wPoverty +
    (district.cropDependence || 0) * wCrop +
    irrigationDeficit * wIrrig +
    (district.housingFragility || 0) * wHousing;

  return clamp(score, 0.05, 0.98);
}

/**
 * Computes risk analysis for all districts given current ENSO state.
 * Risk = abs(rainfall anomaly) * vulnerability score
 */
export function evaluateAllDistricts(districts, nino34, month, weights = DEFAULT_EQUITY_WEIGHTS, activeIntervention = null) {
  return districts.map((district) => {
    const anomaly = calculateDistrictAnomaly(district.id, nino34, month);
    const vulnerability = calculateVulnerabilityScore(district, weights);

    // Raw physical hazard magnitude (using % rainfall anomaly as primary driver)
    const hazardMagnitude = Math.abs(anomaly.rainfallAnomaly);

    // Baseline unmitigated risk index
    const baseRisk = (hazardMagnitude * vulnerability);

    // If an intervention is active, calculate mitigated risk
    let mitigatedVulnerability = vulnerability;
    let mitigatedHazardMagnitude = hazardMagnitude;

    if (activeIntervention) {
      if (activeIntervention.targetHazard === 'drought' && anomaly.rainfallAnomaly < 0) {
        mitigatedHazardMagnitude *= (1.0 - activeIntervention.effectiveness);
        mitigatedVulnerability *= (1.0 - (activeIntervention.vulnerabilityReduction || 0.1));
      } else if (activeIntervention.targetHazard === 'flood' && anomaly.rainfallAnomaly > 0) {
        mitigatedHazardMagnitude *= (1.0 - activeIntervention.effectiveness);
        mitigatedVulnerability *= (1.0 - (activeIntervention.vulnerabilityReduction || 0.1));
      } else if (activeIntervention.targetHazard === 'all') {
        mitigatedHazardMagnitude *= (1.0 - activeIntervention.effectiveness * 0.7);
        mitigatedVulnerability *= (1.0 - (activeIntervention.vulnerabilityReduction || 0.15));
      }
    }

    const effectiveRisk = mitigatedHazardMagnitude * mitigatedVulnerability;
    const damageIndex = (effectiveRisk * (district.population / 1000000));

    return {
      ...district,
      rainfallAnomaly: anomaly.rainfallAnomaly,
      temperatureAnomaly: anomaly.temperatureAnomaly,
      hazardType: anomaly.hazardType,
      confidence: anomaly.confidence,
      mechanism: anomaly.mechanism,
      vulnerabilityScore: Number(vulnerability.toFixed(3)),
      mitigatedVulnerability: Number(mitigatedVulnerability.toFixed(3)),
      baseRisk: Number(baseRisk.toFixed(2)),
      effectiveRisk: Number(effectiveRisk.toFixed(2)),
      damageIndex: Number(damageIndex.toFixed(2)),
      avoidedRisk: Number((baseRisk - effectiveRisk).toFixed(2))
    };
  }).sort((a, b) => b.effectiveRisk - a.effectiveRisk);
}

/**
 * Computes Lorenz-style distribution and Gini inequality coefficient for climate risk.
 * Compares average population impact against bottom 20% most vulnerable.
 */
export function computeEquityMetrics(evaluatedDistricts) {
  if (!evaluatedDistricts || evaluatedDistricts.length === 0) {
    return {
      averageRisk: 0,
      vulnerable20Risk: 0,
      equityGapRatio: 1.0,
      giniCoefficient: 0,
      lorenzCurve: []
    };
  }

  // Sort by vulnerability ascending to construct Lorenz curve of cumulative population vs cumulative impact
  const sortedByVuln = [...evaluatedDistricts].sort((a, b) => a.vulnerabilityScore - b.vulnerabilityScore);
  const totalPop = sortedByVuln.reduce((acc, d) => acc + d.population, 0);
  const totalDamage = sortedByVuln.reduce((acc, d) => acc + (d.damageIndex || 0.01), 0);

  let cumPop = 0;
  let cumDamage = 0;
  const lorenzCurve = [{ popShare: 0, damageShare: 0 }];

  let giniAreaUnderCurve = 0;
  let prevPopShare = 0;
  let prevDamageShare = 0;

  for (const d of sortedByVuln) {
    cumPop += d.population;
    cumDamage += (d.damageIndex || 0.01);

    const popShare = cumPop / totalPop;
    const damageShare = cumDamage / totalDamage;

    // Trapezoidal integration for Gini
    giniAreaUnderCurve += ((damageShare + prevDamageShare) / 2) * (popShare - prevPopShare);

    lorenzCurve.push({
      popShare: Number((popShare * 100).toFixed(1)),
      damageShare: Number((damageShare * 100).toFixed(1)),
      name: d.name
    });

    prevPopShare = popShare;
    prevDamageShare = damageShare;
  }

  // Gini coefficient = 1 - 2 * (area under Lorenz curve)
  const giniCoefficient = Math.max(0, Math.min(1, 1 - 2 * giniAreaUnderCurve));

  // Compute average risk vs top vulnerable 20% by population
  const totalRiskWeighted = evaluatedDistricts.reduce((sum, d) => sum + d.effectiveRisk * d.population, 0);
  const averageRisk = totalRiskWeighted / totalPop;

  // Find top 20% most vulnerable population
  const sortedByVulnDesc = [...evaluatedDistricts].sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore);
  let target20Pop = totalPop * 0.20;
  let accumPop20 = 0;
  let accumRisk20 = 0;

  for (const d of sortedByVulnDesc) {
    const popTaken = Math.min(d.population, target20Pop - accumPop20);
    accumRisk20 += d.effectiveRisk * popTaken;
    accumPop20 += popTaken;
    if (accumPop20 >= target20Pop) break;
  }

  const vulnerable20Risk = accumPop20 > 0 ? (accumRisk20 / accumPop20) : averageRisk;
  const equityGapRatio = averageRisk > 0 ? (vulnerable20Risk / averageRisk) : 1.0;

  return {
    averageRisk: Number(averageRisk.toFixed(1)),
    vulnerable20Risk: Number(vulnerable20Risk.toFixed(1)),
    equityGapRatio: Number(equityGapRatio.toFixed(2)),
    giniCoefficient: Number(giniCoefficient.toFixed(3)),
    lorenzCurve
  };
}

/**
 * Monte Carlo Stress Test:
 * Perturbs equity weights and teleconnection responses 200 times.
 * Calculates what percentage of runs each district remains in the top 3 highest risk list.
 */
export function runRecommendationStabilityTest(districts, nino34, month, baseWeights = DEFAULT_EQUITY_WEIGHTS, runs = 200) {
  const prng = createPRNG(98765);
  const top3AppearanceCount = {};
  districts.forEach(d => { top3AppearanceCount[d.id] = 0; });

  for (let r = 0; r < runs; r++) {
    // Perturb weights by +/- 25%
    const perturbedWeights = {
      poverty: baseWeights.poverty * (0.75 + prng() * 0.5),
      cropDependence: baseWeights.cropDependence * (0.75 + prng() * 0.5),
      irrigationDeficit: baseWeights.irrigationDeficit * (0.75 + prng() * 0.5),
      housingFragility: baseWeights.housingFragility * (0.75 + prng() * 0.5)
    };

    // Perturb Nino 3.4 slightly to simulate forecast uncertainty (+/- 0.3°C)
    const perturbedNino = nino34 + (prng() - 0.5) * 0.6;

    const evaluated = evaluateAllDistricts(districts, perturbedNino, month, perturbedWeights);
    const top3 = evaluated.slice(0, 3);
    top3.forEach(d => {
      top3AppearanceCount[d.id] = (top3AppearanceCount[d.id] || 0) + 1;
    });
  }

  const stabilityResults = {};
  districts.forEach(d => {
    const frequency = top3AppearanceCount[d.id] / runs;
    stabilityResults[d.id] = {
      districtId: d.id,
      name: d.name,
      top3Percentage: Number((frequency * 100).toFixed(0)),
      isStable: frequency >= 0.65
    };
  });

  return stabilityResults;
}
