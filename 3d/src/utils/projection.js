/**
 * ============================================================================
 * PACIFIC-CENTERED EQUIRECTANGULAR PROJECTION UTILITY
 * ============================================================================
 * 
 * Cut line: 25° West in the Atlantic Ocean.
 * 
 * Mathematical mapping:
 * - lonShift = ((lon + 25 + 360) % 360)   // Range [0, 360), where 0 corresponds to 25°W
 * - x = (lonShift - 180) * SCALE            // Pacific (155°E - 180°) is centered near x = 0
 * - z = -lat * SCALE                        // Equator at z = 0, North is -Z, South is +Z
 * - y = elevation                           // Vertical height in scene units
 * 
 * Geographic layout:
 * - Far left (x ≈ -18 to -10): Europe, Africa, Mediterranean, and Western Eurasia.
 * - Center (x ≈ -10 to +8): Indian Ocean, India, Maritime Continent, Pacific Basin, Australia.
 * - Far right (x ≈ +8 to +18): North and South America (including Peru / Lima on eastern Pacific margin).
 * 
 * Continuity:
 * - Russia (Chukotka), Fiji, and New Zealand cross 180° longitude, but do NOT cross the 25°W cut line.
 *   Consequently, their coordinates remain smooth and continuous without splitting.
 * - Polygons crossing 25°W (such as Greenland) are clipped along lonShift = 0 and 360 into clean halves.
 * ============================================================================
 */

import { SIMULATION_CONFIG } from '../simulation/config.js';

export const SCALE = SIMULATION_CONFIG.PROJECTION?.SCALE ?? 0.1;
export const CUT_LON = SIMULATION_CONFIG.PROJECTION?.CUT_LON ?? -25.0;

/**
 * Projects spherical geographic longitude and latitude into 3D scene space.
 * @param {number} lon - Longitude in degrees [-180, 180]
 * @param {number} lat - Latitude in degrees [-90, 90]
 * @param {number} [elevation=0] - Vertical offset (Y-axis)
 * @returns {[number, number, number]} 3D coordinates [x, y, z]
 */
export function projectLonLat(lon, lat, elevation = 0) {
  const lonShift = ((lon - CUT_LON + 360) % 360);
  const x = (lonShift - 180) * SCALE;
  const z = -lat * SCALE;
  return [x, elevation, z];
}

/**
 * Inverse mapping from 3D flat plane coordinates back to longitude and latitude.
 * @param {number} x - 3D X coordinate
 * @param {number} z - 3D Z coordinate
 * @returns {[number, number]} [lon, lat]
 */
export function unprojectXZ(x, z) {
  const lonShift = (x / SCALE) + 180;
  let lon = ((lonShift + CUT_LON + 540) % 360) - 180;
  const lat = -z / SCALE;
  return [lon, lat];
}

/**
 * Converts a longitude to normalized shifted longitude [0, 360) relative to 25°W.
 */
export function toLonShift(lon) {
  return ((lon - CUT_LON + 360) % 360);
}

/**
 * Detects if a polygon ring crosses the 25°W Atlantic cut line (lonShift jump > 180°).
 * If it does, cleanly splits it into separate valid sub-rings along the cut line
 * so no extruded triangles or line segments stretch across the entire world canvas.
 *
 * @param {Array<[number, number]>} ring - Array of [lon, lat] coordinates
 * @returns {Array<Array<[number, number]>>} Array of continuous sub-rings
 */
export function splitRingAtCut(ring) {
  if (!ring || ring.length < 3) return [];

  // Check if any segment crosses the cut line (jump > 180°)
  let crossesCut = false;
  for (let i = 0; i < ring.length - 1; i++) {
    const s1 = toLonShift(ring[i][0]);
    const s2 = toLonShift(ring[i + 1][0]);
    if (Math.abs(s1 - s2) > 180) {
      crossesCut = true;
      break;
    }
  }

  if (!crossesCut) {
    return [ring];
  }

  // Polygon crosses the 25°W cut line. Split along lonShift = 0 and 360.
  // Left side: points where lonShift is near 0 (East of 25W, e.g. lonShift < 180)
  // Right side: points where lonShift is near 360 (West of 25W, e.g. lonShift >= 180)
  const leftRing = [];
  const rightRing = [];

  for (let i = 0; i < ring.length - 1; i++) {
    const p1 = ring[i];
    const p2 = ring[i + 1];
    const s1 = toLonShift(p1[0]);
    const s2 = toLonShift(p2[0]);

    const isLeft1 = s1 < 180;
    const isLeft2 = s2 < 180;

    if (isLeft1) {
      leftRing.push(p1);
    } else {
      rightRing.push(p1);
    }

    if (isLeft1 !== isLeft2) {
      // Crossing occurred between p1 and p2!
      // Compute crossing latitude via linear interpolation along cut line
      let s1Adj = s1;
      let s2Adj = s2;
      if (s1 < 180 && s2 >= 180) {
        // Leaving left side (crossing lonShift = 0 from positive, into 360)
        s2Adj -= 360;
      } else if (s1 >= 180 && s2 < 180) {
        // Entering left side (crossing lonShift = 360 into 0)
        s1Adj -= 360;
      }

      const denom = (s2Adj - s1Adj);
      const t = denom !== 0 ? (0 - s1Adj) / denom : 0.5;
      const latCross = p1[1] + t * (p2[1] - p1[1]);

      // Left side touches cut at CUT_LON + 0.001
      leftRing.push([CUT_LON + 0.001, latCross]);
      // Right side touches cut at CUT_LON - 0.001
      rightRing.push([CUT_LON - 0.001, latCross]);
    }
  }

  const result = [];
  // Close rings if they contain at least 3 points
  if (leftRing.length >= 3) {
    const first = leftRing[0];
    const last = leftRing[leftRing.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      leftRing.push([first[0], first[1]]);
    }
    result.push(leftRing);
  }

  if (rightRing.length >= 3) {
    const first = rightRing[0];
    const last = rightRing[rightRing.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      rightRing.push([first[0], first[1]]);
    }
    result.push(rightRing);
  }

  return result.length > 0 ? result : [ring];
}
