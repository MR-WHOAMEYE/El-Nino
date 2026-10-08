import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimStore } from '../store/useSimStore.js';
import { WEATHER_CONFIG } from '../config/weather.js';
import { projectLonLat } from '../utils/projection.js';

export default function RainField() {
  const { camera } = useThree();
  const cloudsMeshRef = useRef(null);
  const rainMeshRef = useRef(null);

  const showClouds = useSimStore((state) => state.showClouds);
  const showRainField = useSimStore((state) => state.showRainField);
  const cloudXRay = useSimStore((state) => state.cloudXRay);
  const warmPoolX = useSimStore((state) => state.warmPoolX);
  const nino34 = useSimStore((state) => state.nino34);
  const month = useSimStore((state) => state.month);
  const lowGraphicsMode = useSimStore((state) => state.lowGraphicsMode);

  // Preallocated vector for view-angle computation without allocations
  const cameraDir = useMemo(() => new THREE.Vector3(), []);
  const dummyCloud = useMemo(() => new THREE.Object3D(), []);
  const dummyRain = useMemo(() => new THREE.Object3D(), []);

  // Preallocated cloud definitions generated once with seeded pseudorandom offsets
  const cloudSlots = useMemo(() => {
    const slots = [];

    // 1. Warm Pool Convection Cluster (Equatorial Pacific)
    // Scaled down so it does not swallow the Maritime Continent or Americas
    const warmPoolCount = 14;
    for (let i = 0; i < warmPoolCount; i++) {
      const angle = (i / warmPoolCount) * Math.PI * 2;
      const radius = 0.35 + ((i * 17) % 7) * 0.12;
      slots.push({
        type: 'warm_pool',
        relX: Math.cos(angle) * radius * 1.5,
        relZ: Math.sin(angle) * radius * 0.9,
        y: WEATHER_CONFIG.CLOUD_BASE_Y + (((i * 31) % 10) / 10) * WEATHER_CONFIG.CLOUD_Y_JITTER,
        baseScale: (0.75 + (((i * 23) % 8) / 10)) * WEATHER_CONFIG.CLOUD_SCALE,
        driftSpeed: 0.15 + (i % 3) * 0.05
      });
    }

    // 2. Arabian Sea Monsoon Flank (West of Indian Subcontinent, lon ~65°E, lat ~14°N)
    const [asX, , asZ] = projectLonLat(66.0, 14.0);
    for (let i = 0; i < 6; i++) {
      slots.push({
        type: 'arabian_sea',
        anchorX: asX + WEATHER_CONFIG.CLOUD_OFFSET_FROM_LAND,
        anchorZ: asZ,
        relX: (((i * 13) % 7) - 3) * 0.22,
        relZ: (((i * 19) % 7) - 3) * 0.22,
        y: WEATHER_CONFIG.CLOUD_BASE_Y + 0.08 + (i % 3) * 0.08,
        baseScale: (0.7 + (i % 4) * 0.12) * WEATHER_CONFIG.CLOUD_SCALE,
        driftSpeed: 0.2
      });
    }

    // 3. Bay of Bengal Monsoon Flank (East of Indian Subcontinent, lon ~88°E, lat ~14°N)
    const [bobX, , bobZ] = projectLonLat(87.5, 14.0);
    for (let i = 0; i < 6; i++) {
      slots.push({
        type: 'bay_of_bengal',
        anchorX: bobX - WEATHER_CONFIG.CLOUD_OFFSET_FROM_LAND,
        anchorZ: bobZ,
        relX: (((i * 11) % 7) - 3) * 0.22,
        relZ: (((i * 17) % 7) - 3) * 0.22,
        y: WEATHER_CONFIG.CLOUD_BASE_Y + 0.05 + (i % 3) * 0.08,
        baseScale: (0.7 + (i % 4) * 0.12) * WEATHER_CONFIG.CLOUD_SCALE,
        driftSpeed: 0.18
      });
    }

    return slots;
  }, []);

  const totalCloudCount = lowGraphicsMode ? Math.floor(cloudSlots.length / 2) : cloudSlots.length;

  // Rain droplet state pool
  const maxRainDrops = lowGraphicsMode ? 140 : 280;
  const rainDrops = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 300; i++) {
      arr.push({
        relX: (((i * 37) % 100) / 50 - 1) * 1.6,
        relZ: (((i * 43) % 100) / 50 - 1) * 0.9,
        y: 0.25 + (((i * 29) % 100) / 100) * (WEATHER_CONFIG.CLOUD_BASE_Y - 0.25),
        speed: WEATHER_CONFIG.RAIN_FALL_SPEED * (0.8 + ((i % 5) / 10)),
        type: i % 2 === 0 ? 'warm_pool' : 'monsoon'
      });
    }
    return arr;
  }, []);

  // Low-poly flattened cloud puff geometry
  const cloudGeom = useMemo(() => {
    const geom = new THREE.SphereGeometry(1.0, 7, 5);
    // Flatten in Y axis by 0.58 so puffs look like genuine layered clouds, not spheres
    geom.scale(1.0, 0.58, 1.0);
    return geom;
  }, []);

  // Rain streak geometry (ultra-thin vertical precipitation needle)
  const rainGeom = useMemo(() => {
    return new THREE.BoxGeometry(0.015, WEATHER_CONFIG.RAIN_STREAK_LENGTH, 0.015);
  }, []);

  // Transparent cloud material with renderOrder to prevent blocking labels
  const cloudMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#f8fafc',
      roughness: 0.85,
      metalness: 0.05,
      transparent: true,
      opacity: WEATHER_CONFIG.CLOUD_OPACITY,
      depthWrite: false
    });
  }, []);

  const currentOpacityRef = useRef(WEATHER_CONFIG.CLOUD_OPACITY);

  useFrame((_, delta) => {
    if (!showClouds && !showRainField) return;

    // View-dependent opacity fading
    // Compute angle between camera direction and vertical (Y axis)
    camera.getWorldDirection(cameraDir);
    const cosAngle = Math.abs(cameraDir.y); // 1 when looking straight down, 0 when horizontal
    let targetOpacity = WEATHER_CONFIG.CLOUD_OPACITY;

    if (cloudXRay) {
      targetOpacity = WEATHER_CONFIG.CLOUD_MIN_OPACITY;
    } else {
      // If camera is viewing at a low grazing angle (< 30° from horizontal), fade clouds down
      if (cosAngle < 0.35) {
        targetOpacity = THREE.MathUtils.lerp(
          WEATHER_CONFIG.CLOUD_MIN_OPACITY,
          WEATHER_CONFIG.CLOUD_OPACITY,
          cosAngle / 0.35
        );
      }
    }

    currentOpacityRef.current = THREE.MathUtils.lerp(
      currentOpacityRef.current,
      targetOpacity,
      Math.min(1.0, delta * 4.0)
    );
    cloudMaterial.opacity = currentOpacityRef.current;

    // 1. Update Clouds
    if (showClouds && cloudsMeshRef.current) {
      // Warm pool center in Pacific coordinates (x ≈ -2.5 to +11.5)
      const wpCenterX = THREE.MathUtils.lerp(-2.5, 11.5, warmPoolX);
      const isMonsoonSeason = month >= 5 && month <= 8; // JJAS

      for (let i = 0; i < totalCloudCount; i++) {
        const slot = cloudSlots[i];
        let posX = 0;
        let posZ = 0;
        let scale = slot.baseScale;

        if (slot.type === 'warm_pool') {
          posX = wpCenterX + slot.relX;
          posZ = slot.relZ;
          // Scale swells modestly during active El Niño
          const ensoSwell = Math.max(0.7, 1.0 + nino34 * 0.15);
          scale *= ensoSwell;
        } else if (slot.type === 'arabian_sea') {
          // Monsoon cloud: drifts towards west coast during JJAS
          const drift = isMonsoonSeason ? Math.sin(Date.now() * 0.001 * slot.driftSpeed) * 0.35 : 0;
          posX = slot.anchorX + slot.relX + drift;
          posZ = slot.anchorZ + slot.relZ;
          // Shrunk during non-monsoon
          scale *= isMonsoonSeason ? 1.0 : 0.35;
        } else if (slot.type === 'bay_of_bengal') {
          const drift = isMonsoonSeason ? -Math.cos(Date.now() * 0.001 * slot.driftSpeed) * 0.35 : 0;
          posX = slot.anchorX + slot.relX + drift;
          posZ = slot.anchorZ + slot.relZ;
          scale *= isMonsoonSeason ? 1.0 : 0.35;
        }

        dummyCloud.position.set(posX, slot.y, posZ);
        dummyCloud.scale.set(scale, scale, scale);
        dummyCloud.updateMatrix();
        cloudsMeshRef.current.setMatrixAt(i, dummyCloud.matrix);
      }

      cloudsMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // 2. Update Rain Streaks
    if (showRainField && rainMeshRef.current) {
      const wpCenterX = THREE.MathUtils.lerp(-2.5, 11.5, warmPoolX);
      const [asX, , asZ] = projectLonLat(68.0, 15.0);
      const isMonsoonSeason = month >= 5 && month <= 8;

      for (let i = 0; i < maxRainDrops; i++) {
        const r = rainDrops[i];
        r.y -= r.speed * delta;

        // Reset when reaching land/sea surface
        if (r.y < 0.22) {
          r.y = WEATHER_CONFIG.CLOUD_BASE_Y + Math.random() * 0.1;
        }

        let originX = wpCenterX;
        let originZ = 0;

        if (r.type === 'monsoon' && isMonsoonSeason) {
          originX = asX;
          originZ = asZ;
        }

        dummyRain.position.set(originX + r.relX, r.y, originZ + r.relZ);
        dummyRain.scale.set(1, 1, 1);
        dummyRain.updateMatrix();
        rainMeshRef.current.setMatrixAt(i, dummyRain.matrix);
      }

      rainMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Cloud Puffs */}
      {showClouds && (
        <instancedMesh
          ref={cloudsMeshRef}
          args={[cloudGeom, cloudMaterial, totalCloudCount]}
          renderOrder={10}
        />
      )}

      {/* Rain Streaks */}
      {showRainField && (
        <instancedMesh
          ref={rainMeshRef}
          args={[rainGeom, undefined, maxRainDrops]}
          renderOrder={12}
        >
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={WEATHER_CONFIG.RAIN_OPACITY}
            depthWrite={false}
          />
        </instancedMesh>
      )}
    </group>
  );
}
