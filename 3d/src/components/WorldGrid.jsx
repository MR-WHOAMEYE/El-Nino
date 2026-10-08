import React, { useMemo } from 'react';
import * as THREE from 'three';
import { projectLonLat } from '../utils/projection.js';

export default function WorldGrid() {
  const { normalGridGeom, specialGridGeom } = useMemo(() => {
    const normalLines = [];
    const specialLines = [];

    // Longitude lines every 30 degrees from -180 to +180 (spanning -80°S to +80°N)
    for (let lon = -180; lon < 180; lon += 30) {
      const pTop = projectLonLat(lon, 80, 0.01);
      const pBot = projectLonLat(lon, -80, 0.01);
      normalLines.push(new THREE.Vector3(...pTop), new THREE.Vector3(...pBot));
    }

    // Latitude lines every 20-30 degrees up to ±80°
    const latitudes = [-80, -60, -30, 0, 30, 60, 80];
    latitudes.forEach((lat) => {
      for (let lon = -180; lon < 180; lon += 5) {
        const p1 = projectLonLat(lon, lat, 0.01);
        const p2 = projectLonLat(lon + 5, lat, 0.01);
        if (Math.abs(p1[0] - p2[0]) < 5.0) {
          if (lat === 0) {
            specialLines.push(new THREE.Vector3(...p1), new THREE.Vector3(...p2));
          } else {
            normalLines.push(new THREE.Vector3(...p1), new THREE.Vector3(...p2));
          }
        }
      }
    });

    // Tropics of Cancer and Capricorn (±23.5°)
    [-23.5, 23.5].forEach((lat) => {
      for (let lon = -180; lon < 180; lon += 5) {
        const p1 = projectLonLat(lon, lat, 0.01);
        const p2 = projectLonLat(lon + 5, lat, 0.01);
        if (Math.abs(p1[0] - p2[0]) < 5.0) {
          specialLines.push(new THREE.Vector3(...p1), new THREE.Vector3(...p2));
        }
      }
    });

    return {
      normalGridGeom: new THREE.BufferGeometry().setFromPoints(normalLines),
      specialGridGeom: new THREE.BufferGeometry().setFromPoints(specialLines)
    };
  }, []);

  return (
    <group>
      {/* Base Framing Plate under ocean: 47.2 wide x 21.2 deep */}
      <mesh position={[0, -0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[47.2, 21.2]} />
        <meshBasicMaterial color="#020617" />
      </mesh>

      {/* Frame Border Accent Line */}
      <mesh position={[0, -0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[47.6, 21.6]} />
        <meshBasicMaterial color="#0f172a" />
      </mesh>

      {/* Standard Lat/Long Grid Lines */}
      <lineSegments geometry={normalGridGeom}>
        <lineBasicMaterial color="#334155" transparent opacity={0.35} />
      </lineSegments>

      {/* Equator & Tropics (Brighter Accent Lines) */}
      <lineSegments geometry={specialGridGeom}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.65} />
      </lineSegments>
    </group>
  );
}
