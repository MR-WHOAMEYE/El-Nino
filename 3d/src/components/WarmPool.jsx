import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimStore } from '../store/useSimStore.js';

export default function WarmPool() {
  const meshRef = useRef(null);
  const warmPoolX = useSimStore((state) => state.warmPoolX);
  const nino34 = useSimStore((state) => state.nino34);

  // Smooth lerp target position
  const currentX = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Map normalized warmPoolX (0.0 to 1.0) across equatorial Pacific:
    // 0.0 corresponds to Western Pacific (~130°E, x ≈ -2.5)
    // 0.25 corresponds to neutral state (~160°E, x ≈ 0.5)
    // 1.0 corresponds to Eastern Pacific (~90°W, x ≈ 11.5)
    const targetX = THREE.MathUtils.lerp(-2.5, 11.5, warmPoolX);
    currentX.current = THREE.MathUtils.lerp(currentX.current, targetX, delta * 3.0);

    meshRef.current.position.x = currentX.current;

    // Scale and opacity swell during strong El Niño
    const intensity = Math.max(0.5, 0.8 + nino34 * 0.25);
    meshRef.current.scale.set(2.8 * intensity, 1.0, 1.6 * intensity);
  });

  return (
    <group position={[0, 0.04, 0]}>
      {/* Soft warm-pool glowing thermal disc */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 1.0, 32]} />
        <meshBasicMaterial
          color={nino34 >= 0 ? '#f97316' : '#0284c7'}
          transparent
          opacity={0.38}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
