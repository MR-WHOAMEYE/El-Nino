import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimStore } from '../store/useSimStore.js';

// Expanded ocean plane dimensions: 46 scene units wide, 20 scene units deep
// Covers all continental margins, eastern South America, Greenland, and Arctic/Antarctic approaches
export const OCEAN_WIDTH = 46.0;
export const OCEAN_HEIGHT = 20.0;

export default function Ocean() {
  const meshRef = useRef(null);
  const lowGraphicsMode = useSimStore((state) => state.lowGraphicsMode);
  const colorBlindMode = useSimStore((state) => state.colorBlindMode);
  const warmPoolX = useSimStore((state) => state.warmPoolX);
  const nino34 = useSimStore((state) => state.nino34);

  // Resolution adapts based on low graphics mode
  const widthSegments = lowGraphicsMode ? 80 : 160;
  const heightSegments = lowGraphicsMode ? 40 : 80;

  // Preallocated SST DataTexture (64 x 32)
  const texWidth = 64;
  const texHeight = 32;
  const { sstTexture, sstData } = useMemo(() => {
    const data = new Uint8Array(texWidth * texHeight * 4);
    const texture = new THREE.DataTexture(data, texWidth, texHeight, THREE.RGBAFormat);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return { sstTexture: texture, sstData: data };
  }, []);

  // Update DataTexture pixels when warmPoolX or nino34 change
  useEffect(() => {
    // Pacific warm pool center target in world X units
    const xTarget = THREE.MathUtils.lerp(-2.5, 11.5, warmPoolX);
    const poolIntensity = nino34;

    for (let y = 0; y < texHeight; y++) {
      const v = y / (texHeight - 1);
      // Map v [0, 1] to world zScene [-10.0, +10.0]
      const zScene = (v - 0.5) * OCEAN_HEIGHT;
      const dZ = zScene / 2.5;

      for (let x = 0; x < texWidth; x++) {
        const u = x / (texWidth - 1);
        // Map u [0, 1] to world xScene [-23.0, +23.0]
        const xScene = (u - 0.5) * OCEAN_WIDTH;
        const idx = (y * texWidth + x) * 4;

        // Gaussian warm pool blob centered around xTarget along equator (zScene = 0)
        const dX = (xScene - xTarget) / 5.2;
        const gaussian = Math.exp(-(dX * dX + dZ * dZ));

        // Cold tongue in Eastern Pacific during La Niña
        const coldTongueX = Math.max(0, (xScene - 1.5) / 4.5);
        const coldTongue = Math.exp(-(dZ * dZ * 2.8)) * Math.min(1.4, coldTongueX);

        let sstAnomaly = poolIntensity * gaussian * 1.35;
        if (poolIntensity < 0) {
          sstAnomaly -= Math.abs(poolIntensity) * coldTongue * 0.95;
        }

        // Map sstAnomaly (-3.0 to +3.0) to RGB
        let r, g, b;
        const t = THREE.MathUtils.clamp((sstAnomaly + 3.0) / 6.0, 0, 1);

        if (colorBlindMode) {
          // Colorblind-safe: Navy -> Light Grey -> Amber
          if (t < 0.5) {
            const frac = t / 0.5;
            r = Math.floor(THREE.MathUtils.lerp(18, 200, frac));
            g = Math.floor(THREE.MathUtils.lerp(50, 205, frac));
            b = Math.floor(THREE.MathUtils.lerp(130, 215, frac));
          } else {
            const frac = (t - 0.5) / 0.5;
            r = Math.floor(THREE.MathUtils.lerp(200, 235, frac));
            g = Math.floor(THREE.MathUtils.lerp(205, 120, frac));
            b = Math.floor(THREE.MathUtils.lerp(215, 20, frac));
          }
        } else {
          // Standard Diverging Colormap: Deep Blue (-3°C) -> Deep Ocean (0°C) -> Vivid Coral/Red (+3°C)
          if (t < 0.48) {
            const frac = t / 0.48;
            r = Math.floor(THREE.MathUtils.lerp(12, 24, frac));
            g = Math.floor(THREE.MathUtils.lerp(40, 75, frac));
            b = Math.floor(THREE.MathUtils.lerp(135, 140, frac));
          } else if (t < 0.52) {
            r = 20;
            g = 65;
            b = 115;
          } else {
            const frac = (t - 0.52) / 0.48;
            r = Math.floor(THREE.MathUtils.lerp(30, 235, frac));
            g = Math.floor(THREE.MathUtils.lerp(80, 48, frac));
            b = Math.floor(THREE.MathUtils.lerp(120, 32, frac));
          }
        }

        sstData[idx] = r;
        sstData[idx + 1] = g;
        sstData[idx + 2] = b;
        sstData[idx + 3] = 255;
      }
    }

    sstTexture.needsUpdate = true;
  }, [warmPoolX, nino34, colorBlindMode, sstTexture, sstData]);

  // Shader material with vertex wave undulation and SST texture sampling
  const oceanShader = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSstMap: { value: sstTexture },
        uWaveScale: { value: 0.028 }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uWaveScale;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          vUv = uv;
          vec3 pos = position;

          // Subtle wave ripples
          float wave1 = sin(pos.x * 0.8 + uTime * 1.5) * cos(pos.y * 0.8 + uTime * 1.2);
          float elevation = wave1 * uWaveScale;
          pos.z += elevation;
          vElevation = elevation;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uSstMap;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          vec4 sstColor = texture2D(uSstMap, vUv);
          // Subtle wave specular shimmer
          float crest = smoothstep(0.015, 0.035, vElevation) * 0.18;
          vec3 finalColor = sstColor.rgb + vec3(crest);

          gl_FragColor = vec4(finalColor, 0.98);
        }
      `,
      side: THREE.DoubleSide
    });
  }, [sstTexture]);

  useFrame((_, delta) => {
    oceanShader.uniforms.uTime.value += delta * 0.8;
  });

  return (
    <group position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Full Expanded World Ocean Plane: 46 scene units wide x 20 scene units deep */}
      <mesh ref={meshRef} material={oceanShader}>
        <planeGeometry args={[OCEAN_WIDTH, OCEAN_HEIGHT, widthSegments, heightSegments]} />
      </mesh>
    </group>
  );
}
