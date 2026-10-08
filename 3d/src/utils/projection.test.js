/**
 * Unit verification tests for Pacific-centered equirectangular projection
 * and 25°W Atlantic cut line polygon clipping.
 */

import { projectLonLat, unprojectXZ, splitRingAtCut, toLonShift, SCALE, CUT_LON } from './projection.js';

export function runProjectionTests() {
  const results = [];

  function assert(condition, message) {
    if (!condition) {
      throw new Error(`Projection Test Failed: ${message}`);
    }
    results.push({ message, passed: true });
  }

  // 1. Invertibility of projectLonLat and unprojectXZ
  const testPoints = [
    [0, 0],
    [77.2, 28.6],    // Delhi
    [106.8, -6.2],   // Jakarta
    [155.0, 0.0],    // Pacific Center
    [-77.0, -12.0],  // Lima
    [133.0, -25.0]   // Australia
  ];

  testPoints.forEach(([lon, lat]) => {
    const [x, , z] = projectLonLat(lon, lat);
    const [unLon, unLat] = unprojectXZ(x, z);
    assert(Math.abs(lon - unLon) < 1e-4, `Invertibility lon for [${lon}, ${lat}]`);
    assert(Math.abs(lat - unLat) < 1e-4, `Invertibility lat for [${lon}, ${lat}]`);
  });

  // 2. Pacific is centered near x = 0
  const [pacX] = projectLonLat(155.0, 0);
  assert(Math.abs(pacX) < 0.5, `Pacific center (155°E) projects near x=0 (got ${pacX})`);

  // 3. Americas land on the right, Europe/Africa on the left
  const [limaX] = projectLonLat(-77.0, -12.0);
  const [londonX] = projectLonLat(0.0, 51.5);
  const [indiaX] = projectLonLat(75.0, 20.0);
  assert(limaX > 10.0, `Lima lands on the right (got ${limaX})`);
  assert(londonX < -14.0, `London lands on the far left (got ${londonX})`);
  assert(indiaX < 0 && indiaX > -12.0, `India lands between left and center (got ${indiaX})`);

  // 4. Russia, Fiji, and New Zealand remain continuous across 180°
  // Russia (Chukotka) spanning across 180°: 178°E to -178°W
  const r1Shift = toLonShift(178.0);
  const r2Shift = toLonShift(-178.0);
  assert(Math.abs(r1Shift - r2Shift) < 5.0, 'Russia crosses 180° without lonShift jump');

  const chukotkaRing = [
    [177.0, 65.0],
    [179.5, 66.0],
    [-179.0, 66.0],
    [-177.0, 65.0],
    [177.0, 65.0]
  ];
  const chukotkaSplit = splitRingAtCut(chukotkaRing);
  assert(chukotkaSplit.length === 1, 'Chukotka does not cross 25°W cut line, remains a single continuous ring');

  // Fiji spanning across 180°
  const fijiRing = [
    [177.0, -17.0],
    [179.8, -17.0],
    [-179.5, -17.0],
    [-178.0, -18.0],
    [177.0, -17.0]
  ];
  const fijiSplit = splitRingAtCut(fijiRing);
  assert(fijiSplit.length === 1, 'Fiji remains a single continuous ring');

  // 5. Polygons crossing the 25°W Atlantic cut line are split into valid sub-rings
  // Greenland test case (spans across 25°W: e.g. -35°W to -15°W)
  const greenlandRing = [
    [-35.0, 70.0],
    [-15.0, 70.0],
    [-15.0, 75.0],
    [-35.0, 75.0],
    [-35.0, 70.0]
  ];
  const greenlandSplit = splitRingAtCut(greenlandRing);
  assert(greenlandSplit.length === 2, 'Greenland ring crossing 25°W is cleanly split into 2 sub-rings');

  // Iceland test case (spans across 25°W: -26°W to -20°W)
  const icelandRing = [
    [-26.0, 64.0],
    [-20.0, 64.0],
    [-20.0, 66.0],
    [-26.0, 66.0],
    [-26.0, 64.0]
  ];
  const icelandSplit = splitRingAtCut(icelandRing);
  assert(icelandSplit.length === 2, 'Iceland ring crossing 25°W is cleanly split into 2 sub-rings');

  // Cape Verde test case (spans across 25°W: -26°W to -23°W)
  const capeVerdeRing = [
    [-26.0, 15.0],
    [-23.0, 15.0],
    [-23.0, 17.0],
    [-26.0, 17.0],
    [-26.0, 15.0]
  ];
  const capeVerdeSplit = splitRingAtCut(capeVerdeRing);
  assert(capeVerdeSplit.length === 2, 'Cape Verde ring crossing 25°W is cleanly split into 2 sub-rings');

  return { passedCount: results.length, allPassed: true };
}
