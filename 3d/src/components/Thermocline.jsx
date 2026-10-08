import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimStore } from '../store/useSimStore.js';

export default function Thermocline() {
  const meshRef = useRef(null);
  const showThermocline = useSimStore((state) => state.showThermocline);
  const thermoclineSlope = useSimStore((state) => state.thermoclineSlope);
  const kelvinWavePos = useSimStore((state) => state.kelvinWavePosition);

  // Plane geometry for equatorial subsurface thermocline slice
  // Spans equatorial Pacific from Western Pacific (~130°E, x ≈ -3) to South American coast (~80°W, x ≈ 12)
  const geom = useMemo(() => {
    return new THREE.PlaneGeometry(15, 3.5, 48, 12);
  }, []);

  // Material with glowing gradient showing transition from warm upper layer (20°C isotherm) to cold abyssal ocean
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uSlope: { value: 0.8 },
        uKelvinPos: { value: -1.0 },
        uTime: { value: 0 }
      },
      vertexShader: `
        uniform float uSlope;
        uniform float uKelvinPos;
        uniform float uTime;
        varying vec2 vUv;
        varying float vDepth;

        void main() {
          vUv = uv;
          vec3 pos = position;

          // Slope: u ranges from 0 (West, ~130°E) to 1 (East, ~90°W)
          // Normal: West deep (-4.8), East shallow (-1.2)
          // Flattened (El Niño): both around -3.2
          float westDepth = -3.2 - (uSlope * 1.8);
          float eastDepth = -3.2 + (uSlope * 2.0);
          float depthProfile = mix(westDepth, eastDepth, uv.x);

          // Kelvin wave pulse ripple (downwelling depression moving eastward)
          if (uKelvinPos >= 0.0) {
            float waveDist = abs(uv.x - uKelvinPos);
            float kelvinPulse = exp(-pow(waveDist * 8.0, 2.0)) * -1.8;
            depthProfile += kelvinPulse;
          }

          // Subtle internal wave oscillations
          float internalWave = sin(pos.x * 0.3 + uTime * 1.8) * 0.15;
          pos.y = depthProfile + internalWave;

          vDepth = pos.y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        varying float vDepth;

        void main() {
          // 20°C Isotherm boundary coloration: Glowing cyan/gold boundary layer
          vec3 warmLayer = vec3(0.95, 0.65, 0.20);
          vec3 coldAbyss = vec3(0.08, 0.25, 0.55);

          float t = smoothstep(-5.5, -1.0, vDepth);
          vec3 col = mix(coldAbyss, warmLayer, t);

          // Grid line cues
          float grid = step(0.96, fract(vUv.x * 10.0)) * 0.18;

          gl_FragColor = vec4(col + vec3(grid), 0.72);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    material.uniforms.uTime.value += delta;
    // Smooth lerp slope to prevent snapping
    material.uniforms.uSlope.value = THREE.MathUtils.lerp(
      material.uniforms.uSlope.value,
      thermoclineSlope,
      delta * 3.0
    );
    material.uniforms.uKelvinPos.value = kelvinWavePos;
  });

  if (!showThermocline) return null;

  return (
    <group position={[4.0, -0.8, 0]}>
      {/* Equatorial subsurface slice: oriented along the equator (Z=0) */}
      <mesh ref={meshRef} geometry={geom} material={material} rotation={[0, 0, 0]} />
    </group>
  );
}
