import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useSimStore } from '../store/useSimStore.js';

const RINGS_KM = [
  { km: 3000, radius: 2.7 },
  { km: 6000, radius: 5.4 },
  { km: 9000, radius: 8.1 },
  { km: 12000, radius: 10.8 }
];

export default function DistanceRings() {
  const warmPoolX = useSimStore((state) => state.warmPoolX);
  const showDistanceRings = useSimStore((state) => state.showDistanceRings ?? true);

  // Pacific warm pool center in scene coordinates
  const wpCenterX = THREE.MathUtils.lerp(-2.5, 11.5, warmPoolX);

  // Preallocated ring line geometries
  const ringGeometries = useMemo(() => {
    return RINGS_KM.map((r) => {
      const segments = 64;
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(r.radius * Math.cos(theta), 0.02, r.radius * Math.sin(theta)));
      }
      return new THREE.BufferGeometry().setFromPoints(points);
    });
  }, []);

  if (!showDistanceRings) return null;

  return (
    <group position={[wpCenterX, 0.02, 0]}>
      {RINGS_KM.map((r, idx) => (
        <line key={r.km} geometry={ringGeometries[idx]}>
          <lineBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.32}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </line>
      ))}
    </group>
  );
}
