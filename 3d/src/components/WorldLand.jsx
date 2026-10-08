import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import worldLandGeoJSON from '../data/world-land.geojson';
import regionsData from '../data/regions.json';
import { buildWorldLandMeshes } from '../utils/geometryBuilder.js';
import { useSimStore } from '../store/useSimStore.js';

export default function WorldLand() {
  const selectedRegionId = useSimStore((state) => state.selectedRegionId);
  const hoveredRegionId = useSimStore((state) => state.hoveredRegionId);
  const setSelectedRegion = useSimStore((state) => state.setSelectedRegion);
  const setHoveredRegion = useSimStore((state) => state.setHoveredRegion);
  const colorBlindMode = useSimStore((state) => state.colorBlindMode);

  // Build the geometries once and cache them
  const { regionGeometries, coastlinesGeometry } = useMemo(() => {
    return buildWorldLandMeshes(worldLandGeoJSON);
  }, []);

  const numRegions = regionsData.length;

  // Custom ShaderMaterial for continental land slabs
  const landMaterial = useMemo(() => {
    const anomalyArray = new Float32Array(numRegions);
    const tempArray = new Float32Array(numRegions);

    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAnomalies: { value: anomalyArray },
        uTemps: { value: tempArray },
        uSelectedIdx: { value: -1 },
        uHoveredIdx: { value: -1 },
        uColorBlind: { value: 0.0 }
      },
      vertexShader: `
        attribute float aRegionId;
        attribute float aEdge;

        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying float vRegionId;
        varying float vEdge;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vRegionId = aRegionId;
          vEdge = aEdge;

          vec3 pos = position;
          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPosition = worldPos.xyz;

          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uSelectedIdx;
        uniform float uHoveredIdx;
        uniform float uColorBlind;

        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying float vRegionId;
        varying float vEdge;

        void main() {
          // Base continental terrain color (rich dark olive / charcoal land slab)
          vec3 baseLand = vec3(0.18, 0.23, 0.22);
          vec3 topHighlight = vec3(0.24, 0.30, 0.28);

          // Top face vs vertical side walls lighting
          float isTop = smoothstep(0.4, 0.9, vNormal.y);
          vec3 col = mix(baseLand * 0.75, topHighlight, isTop);

          // Selection and Hover highlight
          float isSelected = abs(vRegionId - uSelectedIdx) < 0.5 ? 1.0 : 0.0;
          float isHovered = abs(vRegionId - uHoveredIdx) < 0.5 ? 1.0 : 0.0;

          if (isSelected > 0.5) {
            col = mix(col, vec3(0.95, 0.75, 0.25), 0.55);
          } else if (isHovered > 0.5) {
            col = mix(col, vec3(0.35, 0.75, 0.95), 0.45);
          }

          // Edge glow on perimeter boundaries
          float edgeGlow = vEdge * 0.45;
          if (isSelected > 0.5 || isHovered > 0.5) {
            edgeGlow += vEdge * 0.55;
          }

          col += vec3(edgeGlow * 0.8, edgeGlow * 0.9, edgeGlow);

          gl_FragColor = vec4(col, 1.0);
        }
      `,
      side: THREE.DoubleSide
    });
  }, [numRegions]);

  useFrame((_, delta) => {
    landMaterial.uniforms.uTime.value += delta;

    const selIdx = regionsData.findIndex((r) => r.id === selectedRegionId);
    landMaterial.uniforms.uSelectedIdx.value = selIdx;

    const hovIdx = regionsData.findIndex((r) => r.id === hoveredRegionId);
    landMaterial.uniforms.uHoveredIdx.value = hovIdx;

    landMaterial.uniforms.uColorBlind.value = colorBlindMode ? 1.0 : 0.0;
  });

  return (
    <group>
      {/* Extruded Land Slabs for all Climate Regions */}
      {Array.from(regionGeometries.entries()).map(([regIdx, geom]) => {
        const regDef = regionsData[regIdx];
        return (
          <mesh
            key={regIdx}
            geometry={geom}
            material={landMaterial}
            onClick={(e) => {
              e.stopPropagation();
              if (regDef && setSelectedRegion) {
                setSelectedRegion(regDef.id);
              }
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              if (regDef && setHoveredRegion) {
                setHoveredRegion(regDef.id);
              }
            }}
            onPointerOut={() => {
              if (setHoveredRegion) setHoveredRegion(null);
            }}
          />
        );
      })}

      {/* Glowing Coastline Strokes */}
      {coastlinesGeometry && (
        <lineSegments geometry={coastlinesGeometry}>
          <lineBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      )}
    </group>
  );
}
