/**
 * ============================================================================
 * WORLD LAND GEOMETRY BUILDER & REGIONAL MESH COMPOSER
 * ============================================================================
 * 
 * - Parses Natural Earth land polygons from GeoJSON.
 * - Resolves 25°W cut line crossings cleanly without stretched triangles.
 * - Triangulates 2D rings using earcut.
 * - Extrudes vertical slabs with flat top and side walls.
 * - Merges by climate region with `aRegionId` and `aEdge` vertex attributes.
 * - Extracts glowing perimeter coastline segments.
 * ============================================================================
 */

import * as THREE from 'three';
import earcut from 'earcut';
import { projectLonLat, splitRingAtCut } from './projection.js';
import { SIMULATION_CONFIG } from '../simulation/config.js';
import regionsData from '../data/regions.json';

const LAND_BASE_Y = SIMULATION_CONFIG.PROJECTION?.LAND_BASE_Y ?? 0.02;
const LAND_HEIGHT = SIMULATION_CONFIG.PROJECTION?.LAND_HEIGHT ?? 0.18;
const Y_TOP = LAND_BASE_Y + LAND_HEIGHT;
const Y_BOTTOM = LAND_BASE_Y;

/**
 * Maps a geographic coordinate to a region index (0 to N-1).
 */
export function getRegionIndexForPoint(lon, lat) {
  // Check specific bounding boxes in order
  for (let i = 0; i < regionsData.length; i++) {
    const reg = regionsData[i];
    if (reg.id === 'other-land') continue;
    const b = reg.bounds;
    if (lon >= b.minLon && lon <= b.maxLon && lat >= b.minLat && lat <= b.maxLat) {
      return i;
    }
  }
  // Default to other-land
  const otherIdx = regionsData.findIndex((r) => r.id === 'other-land');
  return otherIdx >= 0 ? otherIdx : regionsData.length - 1;
}

/**
 * Builds regional 3D extruded land geometries and coastline line segments.
 *
 * @param {Object} geojsonData - GeoJSON FeatureCollection of world land
 * @returns {{ regionGeometries: Map<number, THREE.BufferGeometry>, coastlinesGeometry: THREE.BufferGeometry }}
 */
export function buildWorldLandMeshes(geojsonData) {
  // Buckets of vertex data for each climate region
  const regionBuckets = new Map();
  for (let i = 0; i < regionsData.length; i++) {
    regionBuckets.set(i, {
      positions: [],
      normals: [],
      regionIds: [],
      edges: []
    });
  }

  const coastlinePoints = [];

  const features = geojsonData.features || [];

  features.forEach((feature) => {
    const geom = feature.geometry;
    if (!geom) return;

    let polygonList = [];
    if (geom.type === 'Polygon') {
      polygonList = [geom.coordinates];
    } else if (geom.type === 'MultiPolygon') {
      polygonList = geom.coordinates;
    }

    polygonList.forEach((polyRings) => {
      if (!polyRings || polyRings.length === 0) return;
      const exteriorRing = polyRings[0];
      if (exteriorRing.length < 3) return;

      // Check if ring crosses cut line; split if necessary
      const subExteriorRings = splitRingAtCut(exteriorRing);

      subExteriorRings.forEach((ring) => {
        if (ring.length < 3) return;

        // Compute centroid to determine climate region
        let sumLon = 0;
        let sumLat = 0;
        for (let i = 0; i < ring.length - 1; i++) {
          sumLon += ring[i][0];
          sumLat += ring[i][1];
        }
        const centroidLon = sumLon / (ring.length - 1);
        const centroidLat = sumLat / (ring.length - 1);

        const regionIdx = getRegionIndexForPoint(centroidLon, centroidLat);
        const bucket = regionBuckets.get(regionIdx) || regionBuckets.get(regionBuckets.size - 1);

        // Project 2D vertices to flat plane
        const flatCoords = [];
        const ringProjected = [];

        for (let i = 0; i < ring.length - 1; i++) {
          const [lon, lat] = ring[i];
          const [x, , z] = projectLonLat(lon, lat);
          flatCoords.push(x, z);
          ringProjected.push([x, z]);
        }

        const numVerts = ringProjected.length;
        if (numVerts < 3) return;

        // Triangulate top face using earcut
        const triangles = earcut(flatCoords, [], 2);

        // 1. Top face
        for (let t = 0; t < triangles.length; t += 3) {
          const i0 = triangles[t];
          const i1 = triangles[t + 1];
          const i2 = triangles[t + 2];

          const p0 = ringProjected[i0];
          const p1 = ringProjected[i1];
          const p2 = ringProjected[i2];

          // Vertex 0
          bucket.positions.push(p0[0], Y_TOP, p0[1]);
          bucket.normals.push(0, 1, 0);
          bucket.regionIds.push(regionIdx);
          bucket.edges.push(0.0);

          // Vertex 1
          bucket.positions.push(p1[0], Y_TOP, p1[1]);
          bucket.normals.push(0, 1, 0);
          bucket.regionIds.push(regionIdx);
          bucket.edges.push(0.0);

          // Vertex 2
          bucket.positions.push(p2[0], Y_TOP, p2[1]);
          bucket.normals.push(0, 1, 0);
          bucket.regionIds.push(regionIdx);
          bucket.edges.push(0.0);
        }

        // 2. Extruded vertical side walls around perimeter
        for (let i = 0; i < numVerts; i++) {
          const nextIdx = (i + 1) % numVerts;
          const [x0, z0] = ringProjected[i];
          const [x1, z1] = ringProjected[nextIdx];

          // Outward normal in XZ plane
          const dx = x1 - x0;
          const dz = z1 - z0;
          const len = Math.sqrt(dx * dx + dz * dz) || 1.0;
          const nx = dz / len;
          const nz = -dx / len;

          // Quad triangle 1: (p0_top, p0_bot, p1_top)
          bucket.positions.push(x0, Y_TOP, z0);
          bucket.normals.push(nx, 0, nz);
          bucket.regionIds.push(regionIdx);
          bucket.edges.push(1.0);

          bucket.positions.push(x0, Y_BOTTOM, z0);
          bucket.normals.push(nx, 0, nz);
          bucket.regionIds.push(regionIdx);
          bucket.edges.push(1.0);

          bucket.positions.push(x1, Y_TOP, z1);
          bucket.normals.push(nx, 0, nz);
          bucket.regionIds.push(regionIdx);
          bucket.edges.push(1.0);

          // Quad triangle 2: (p1_top, p0_bot, p1_bot)
          bucket.positions.push(x1, Y_TOP, z1);
          bucket.normals.push(nx, 0, nz);
          bucket.regionIds.push(regionIdx);
          bucket.edges.push(1.0);

          bucket.positions.push(x0, Y_BOTTOM, z0);
          bucket.normals.push(nx, 0, nz);
          bucket.regionIds.push(regionIdx);
          bucket.edges.push(1.0);

          bucket.positions.push(x1, Y_BOTTOM, z1);
          bucket.normals.push(nx, 0, nz);
          bucket.regionIds.push(regionIdx);
          bucket.edges.push(1.0);

          // Coastline stroke segment at top edge
          coastlinePoints.push(
            new THREE.Vector3(x0, Y_TOP + 0.005, z0),
            new THREE.Vector3(x1, Y_TOP + 0.005, z1)
          );
        }
      });
    });
  });

  // Assemble Three.js BufferGeometries
  const regionGeometries = new Map();

  regionBuckets.forEach((bucket, regIdx) => {
    if (bucket.positions.length === 0) return;

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(bucket.positions, 3));
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(bucket.normals, 3));
    geom.setAttribute('aRegionId', new THREE.Float32BufferAttribute(bucket.regionIds, 1));
    geom.setAttribute('aEdge', new THREE.Float32BufferAttribute(bucket.edges, 1));

    geom.computeBoundingSphere();
    geom.computeBoundingBox();

    regionGeometries.set(regIdx, geom);
  });

  // Merged coastline outline geometry
  const coastlinesGeometry = new THREE.BufferGeometry().setFromPoints(coastlinePoints);

  return { regionGeometries, coastlinesGeometry };
}
