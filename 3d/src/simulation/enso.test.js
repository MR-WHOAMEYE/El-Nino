/**
 * Verification test suite for ENSO physical dynamics,
 * teleconnection mapping, equity metrics, and counterfactual budget allocation.
 */

import { createInitialState, step, classifyPhase } from './enso.js';
import { calculateDistrictAnomaly } from './teleconnections.js';
import { calculateVulnerabilityScore, evaluateAllDistricts, computeEquityMetrics } from './equity.js';
import { allocateBudgetOptimally } from './counterfactual.js';
import districtsData from '../data/districts.json';

export function runSimulatorSelfTests() {
  const results = [];

  function assert(condition, message) {
    if (!condition) {
      throw new Error(`Test Failed: ${message}`);
    }
    results.push({ message, passed: true });
  }

  // 1. Initial State Baseline
  const s0 = createInitialState();
  assert(s0.tradeWind === 0.6, 'Baseline trade winds initialized to 0.6');
  assert(s0.phase === 'Neutral', 'Initial phase classified as Neutral');
  assert(s0.nino34 === 0.0, 'Initial Nino 3.4 SST anomaly is 0.0');

  // 2. Baseline integration stability (stays near neutral with neutral forcing)
  let sNeutral = { ...s0 };
  for (let i = 0; i < 20; i++) {
    sNeutral = step(sNeutral, {}, 0.1);
  }
  assert(Math.abs(sNeutral.nino34) < 0.6, 'Baseline state remains near neutral without external forcing');

  // 3. Weak winds produce warming (El Niño growth)
  let sWeak = createInitialState({ tradeWind: 0.25 });
  for (let i = 0; i < 30; i++) {
    sWeak = step(sWeak, {}, 0.1);
  }
  assert(sWeak.nino34 > 0.5, 'Weak trade winds trigger positive SST warming');
  assert(sWeak.phase.includes('El Niño'), 'Warming classifies as El Niño');
  assert(sWeak.warmPoolX > s0.warmPoolX, 'Warm pool migrates eastward');
  assert(sWeak.thermoclineSlope < s0.thermoclineSlope, 'Thermocline slope flattens during warming');

  // 4. Strong winds produce cooling (La Niña)
  let sStrong = createInitialState({ tradeWind: 0.90 });
  for (let i = 0; i < 30; i++) {
    sStrong = step(sStrong, {}, 0.1);
  }
  assert(sStrong.nino34 < -0.5, 'Strong trade winds trigger negative SST cooling');
  assert(sStrong.phase.includes('La Niña'), 'Cooling classifies as La Niña');

  // 5. Phase Threshold Classifier
  assert(classifyPhase(0.2) === 'Neutral', '0.2C classified as Neutral');
  assert(classifyPhase(0.8) === 'El Niño', '0.8C classified as El Niño');
  assert(classifyPhase(2.1) === 'Strong El Niño', '2.1C classified as Strong El Niño');
  assert(classifyPhase(-0.9) === 'La Niña', '-0.9C classified as La Niña');
  assert(classifyPhase(-1.8) === 'Strong La Niña', '-1.8C classified as Strong La Niña');

  // 6. Regional Teleconnections
  const mumbaiElNino = calculateDistrictAnomaly('mumbai', 1.8, 6); // June monsoon
  assert(mumbaiElNino.rainfallAnomaly < 0, 'Mumbai experiences rainfall deficit during El Niño summer monsoon');

  const chennaiElNino = calculateDistrictAnomaly('chennai', 1.8, 10); // November NE monsoon
  assert(chennaiElNino.rainfallAnomaly > 0, 'Chennai experiences positive rainfall boost during El Niño autumn NE monsoon');

  // 7. Equity Engine & Gini computation
  const evalDistricts = evaluateAllDistricts(districtsData, 1.8, 6);
  assert(evalDistricts.length >= 12, 'All 12+ districts evaluated');
  const equity = computeEquityMetrics(evalDistricts);
  assert(equity.giniCoefficient >= 0 && equity.giniCoefficient <= 1, 'Gini coefficient bounded between 0 and 1');
  assert(equity.equityGapRatio > 0, 'Equity gap ratio is positive and computed');

  // 8. Counterfactual Budget Allocator
  const allocation = allocateBudgetOptimally(districtsData, 1.8, 6, 500, 'irrigation_drip');
  assert(allocation.fundedCount > 0, 'Budget allocator successfully allocated funds');
  assert(allocation.postEquity.averageRisk <= allocation.baselineEquity.averageRisk, 'Allocation reduces overall population risk');

  return { passedCount: results.length, allPassed: true };
}
