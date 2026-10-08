/**
 * ============================================================================
 * GREAT-CIRCLE TELECONNECTION DISTANCE & LAG ENGINE
 * ============================================================================
 * Calculates real-world geographic distances (in kilometers) from the shifting
 * equatorial Pacific Warm Pool to distant continental climate regions.
 */

import regionsData from '../data/regions.json';
import { REGION_TELECONNECTIONS, computeRegionAnomalies } from '../simulation/teleconnections.js';

const EARTH_RADIUS_KM = 6371;

/**
 * Returns the geographic [lon, lat] of the warm pool center on Earth.
 * When warmPoolX = 0 (far west Pacific), center is at ~130°E (lon = 130).
 * When warmPoolX = 0.25 (neutral), center is at ~160°E (lon = 160).
 * When warmPoolX = 1.0 (far east Pacific), center is at ~90°W (lon = -90 / 270°E).
 */
export function getWarmPoolCoordinates(warmPoolX) {
  // lon in [-180, 180]
  // 0 -> 130°E, 0.25 -> 160°E, 0.417 -> 180°, 1.0 -> -90°W
  let lon = 130 + warmPoolX * (140 / 0.75);
  if (lon > 180) {
    lon = lon - 360;
  }
  return [lon, 0.0];
}

/**
 * Great-circle distance between two geographic points using Haversine formula.
 * @returns {number} Distance in kilometers
 */
export function computeGreatCircleDistance(lon1, lat1, lon2, lat2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c);
}

/**
 * Computes all regions' distance from the current warm pool center,
 * sorted by geographic distance (nearest to farthest).
 */
export function computeAllRegionDistances(warmPoolX, nino34, month) {
  const [wpLon, wpLat] = getWarmPoolCoordinates(warmPoolX);
  const regionalAnomalies = computeRegionAnomalies(nino34, month);

  return regionsData
    .filter((r) => r.id !== 'other-land')
    .map((region) => {
      const [anchorLon, anchorLat] = region.labelAnchor || [0, 0];
      const distanceKm = computeGreatCircleDistance(wpLon, wpLat, anchorLon, anchorLat);
      const tele = REGION_TELECONNECTIONS[region.id] || {
        lagMonths: 2,
        confidence: 'medium',
        note: region.note
      };
      const anomaly = regionalAnomalies[region.id] || {
        rainfallAnomaly: 0,
        temperatureAnomaly: 0,
        hazard: 'normal',
        intensity: 0
      };

      return {
        id: region.id,
        name: region.name,
        anchor: [anchorLon, anchorLat],
        distanceKm,
        lagMonths: tele.lagMonths,
        rainfallAnomaly: anomaly.rainfallAnomaly,
        temperatureAnomaly: anomaly.temperatureAnomaly,
        hazard: anomaly.hazard,
        intensity: anomaly.intensity,
        confidence: tele.confidence,
        note: region.note || tele.note
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
