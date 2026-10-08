import React, { useMemo } from 'react';
import * as THREE from 'three';
import coastlinesData from '../data/coastlines.json';
import { projectGeoToScene } from './DistrictColumns.jsx';

export default function Coastlines() {
  const lineGeometries = useMemo(() => {
    const geometries = [];

    coastlinesData.features.forEach((feature) => {
      const coords = feature.geometry.coordinates;
      const points = [];

      coords.forEach(([lon, lat]) => {
        const [x, , z] = projectGeoToScene(lat, lon);
        points.push(new THREE.Vector3(x, 0.08, z));
      });

      if (points.length > 1) {
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        geometries.push(geom);
      }
    });

    return geometries;
  }, []);

  return (
    <group>
      {lineGeometries.map((geom, idx) => (
        <line key={idx} geometry={geom}>
          <lineBasicMaterial color="#94a3b8" linewidth={1.5} transparent opacity={0.65} />
        </line>
      ))}
    </group>
  );
}
