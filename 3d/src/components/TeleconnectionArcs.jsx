import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimStore } from '../store/useSimStore.js';
import { projectLonLat } from '../utils/projection.js';
import { computeAllRegionDistances } from '../utils/teleconnectionsDistance.js';

// Far-reach target regions to highlight
const KEY_REGIONS = [
  'india-north',
  'india-west',
  'india-south-east',
  'indonesia',
  'australia-east',
  'peru-ecuador-coast',
  'east-africa',
  'southern-africa',
  'us-southwest-and-mexico'
];

export default function TeleconnectionArcs() {
  const warmPoolX = useSimStore((state) => state.warmPoolX);
  const nino34 = useSimStore((state) => state.nino34);
  const month = useSimStore((state) => state.month);
  const selectedRegionId = useSimStore((state) => state.selectedRegionId);
  const colorBlindMode = useSimStore((state) => state.colorBlindMode);
  const showTeleconnections = useSimStore((state) => state.showTeleconnections ?? true);

  const wpCenterX = THREE.MathUtils.lerp(-2.5, 11.5, warmPoolX);
  const startPt = useMemo(() => new THREE.Vector3(wpCenterX, 0.25, 0), [wpCenterX]);

  // Compute all distance data
  const regionDistances = useMemo(() => {
    return computeAllRegionDistances(warmPoolX, nino34, month).filter((r) =>
      KEY_REGIONS.includes(r.id)
    );
  }, [warmPoolX, nino34, month]);

  // Construct quadratic Bezier curves
  const arcs = useMemo(() => {
    return regionDistances.map((reg) => {
      const [lon, lat] = reg.anchor;
      const [destX, destY, destZ] = projectLonLat(lon, lat, 0.22);
      const endPt = new THREE.Vector3(destX, destY, destZ);

      // Midpoint lifted based on distance (higher for farther places)
      const dist = startPt.distanceTo(endPt);
      const midX = (startPt.x + endPt.x) / 2;
      const midZ = (startPt.z + endPt.z) / 2;
      const arcHeight = Math.min(3.8, Math.max(1.2, dist * 0.28));
      const midPt = new THREE.Vector3(midX, arcHeight, midZ);

      const curve = new THREE.QuadraticBezierCurve3(startPt, midPt, endPt);
      const points = curve.getPoints(36);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      return {
        region: reg,
        curve,
        geometry,
        destPt: endPt,
        dist
      };
    });
  }, [regionDistances, startPt]);

  // Pulse markers traversing each curve with zero object allocations in useFrame
  const pulsesRef = useRef([]);
  const tempVec = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    arcs.forEach((arc, i) => {
      const speed = 0.45 / Math.max(0.6, arc.dist * 0.15);
      const t = (elapsed * speed + (i * 0.18)) % 1.0;
      if (pulsesRef.current[i]) {
        arc.curve.getPoint(t, tempVec);
        pulsesRef.current[i].position.copy(tempVec);
      }
    });
  });


  if (!showTeleconnections) return null;

  return (
    <group>
      {arcs.map((arc, idx) => {
        const isDrought = arc.region.rainfallAnomaly < 0;
        const isSelected = selectedRegionId === arc.region.id;

        let arcColor = '#38bdf8'; // Blue for surplus/flood
        if (isDrought) {
          arcColor = colorBlindMode ? '#d97706' : '#f43f5e'; // Amber / Rose for drought
        }

        return (
          <group key={arc.region.id}>
            {/* Glowing Bezier Curve */}
            <line geometry={arc.geometry}>
              <lineBasicMaterial
                color={arcColor}
                transparent
                opacity={isSelected ? 0.85 : 0.45}
                linewidth={isSelected ? 2 : 1}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </line>

            {/* Traveling Energy Pulse Sphere */}
            <mesh
              ref={(el) => (pulsesRef.current[idx] = el)}
              scale={isSelected ? 0.22 : 0.14}
            >
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial
                color={arcColor}
                transparent
                opacity={0.9}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
