import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimStore } from '../store/useSimStore.js';

export default function WindField() {
  const instancedMeshRef = useRef(null);
  const walkerMeshRef = useRef(null);

  const showWindField = useSimStore((state) => state.showWindField);
  const showWalkerLoop = useSimStore((state) => state.showWalkerLoop);
  const tradeWind = useSimStore((state) => state.tradeWind);
  const warmPoolX = useSimStore((state) => state.warmPoolX);
  const westerlyBurstActive = useSimStore((state) => state.westerlyBurstActive);
  const lowGraphicsMode = useSimStore((state) => state.lowGraphicsMode);

  const particleCount = lowGraphicsMode ? 240 : 480;

  // Preallocated particle state arrays within Pacific longitude span (-3 to +11.5)
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 500; i++) {
      arr.push({
        x: -3.0 + Math.random() * 14.5,
        y: 0.15 + Math.random() * 0.45,
        z: (Math.random() - 0.5) * 3.2,
        baseSpeed: 0.8 + Math.random() * 0.5,
        life: Math.random(),
        scale: 0.5 + Math.random() * 0.5
      });
    }
    return arr;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const dummyWalker = useMemo(() => new THREE.Object3D(), []);
  const colorWhite = useMemo(() => new THREE.Color(0.85, 0.95, 1.0), []);
  const colorBurst = useMemo(() => new THREE.Color(1.0, 0.45, 0.2), []);

  const arrowGeom = useMemo(() => {
    const geom = new THREE.ConeGeometry(0.08, 0.35, 5);
    geom.rotateX(Math.PI / 2);
    return geom;
  }, []);

  const walkerCount = 36;
  const walkerParticles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < walkerCount; i++) {
      arr.push({
        theta: (i / walkerCount) * Math.PI * 2,
        speed: 0.6 + Math.random() * 0.2
      });
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!showWindField) return;

    // Normal trade winds: East-to-West (-X direction)
    const baseVelX = -3.8 * tradeWind;
    const isBurst = westerlyBurstActive;

    // 1. Surface Trade Wind Particles
    if (instancedMeshRef.current) {
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.life += delta * 0.4;
        if (p.life > 1.0) {
          p.life = 0.0;
          p.x = 11.0 + Math.random() * 0.8;
          p.z = (Math.random() - 0.5) * 3.2;
        }

        // Reversal during westerly wind burst near central Pacific
        let effectiveSpeedX = baseVelX;
        if (isBurst && p.x > 0.0 && p.x < 6.0) {
          effectiveSpeedX = 2.8;
        }

        p.x += effectiveSpeedX * p.baseSpeed * delta;

        if (p.x < -3.5) {
          p.x = 11.5;
        } else if (p.x > 11.8) {
          p.x = -3.5;
        }

        dummy.position.set(p.x, p.y, p.z);

        if (effectiveSpeedX < 0) {
          dummy.rotation.set(0, -Math.PI / 2, 0); // West (-X)
        } else {
          dummy.rotation.set(0, Math.PI / 2, 0);  // East (+X)
        }

        const size = p.scale * (0.6 + tradeWind * 0.7);
        dummy.scale.set(size, size, size * 1.3);
        dummy.updateMatrix();

        instancedMeshRef.current.setMatrixAt(i, dummy.matrix);
        instancedMeshRef.current.setColorAt(i, isBurst && p.x > 0.0 && p.x < 6.0 ? colorBurst : colorWhite);
      }
      instancedMeshRef.current.instanceMatrix.needsUpdate = true;
      if (instancedMeshRef.current.instanceColor) {
        instancedMeshRef.current.instanceColor.needsUpdate = true;
      }
    }

    // 2. Walker Circulation Loop
    if (walkerMeshRef.current && showWalkerLoop) {
      const centerAscentX = THREE.MathUtils.lerp(-2.5, 9.0, warmPoolX);
      const descentX = 11.5;
      const loopWidth = Math.max(3.5, Math.abs(descentX - centerAscentX));
      const centerX = (centerAscentX + descentX) / 2;
      const loopHeight = 1.8;
      const baseHeight = 1.2;

      const loopSpeed = (tradeWind * 1.2 + 0.3) * delta;

      for (let i = 0; i < walkerCount; i++) {
        const wp = walkerParticles[i];
        wp.theta += loopSpeed * wp.speed;
        if (wp.theta > Math.PI * 2) wp.theta -= Math.PI * 2;

        const x = centerX + (loopWidth * 0.48) * Math.cos(wp.theta);
        const y = baseHeight + (loopHeight * 0.48) * Math.sin(wp.theta);

        dummyWalker.position.set(x, y, 0);

        const tangentX = -Math.sin(wp.theta);
        const tangentY = Math.cos(wp.theta);
        const angle = Math.atan2(tangentY, tangentX);
        dummyWalker.rotation.set(0, 0, angle - Math.PI / 2);

        const walkerScale = 0.9 * (0.5 + tradeWind * 0.7);
        dummyWalker.scale.set(walkerScale, walkerScale, walkerScale);
        dummyWalker.updateMatrix();

        walkerMeshRef.current.setMatrixAt(i, dummyWalker.matrix);
      }
      walkerMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  if (!showWindField) return null;

  return (
    <group>
      <instancedMesh
        ref={instancedMeshRef}
        args={[arrowGeom, undefined, particleCount]}
      >
        <meshBasicMaterial transparent opacity={0.85} color="#e0f2fe" />
      </instancedMesh>

      {showWalkerLoop && (
        <instancedMesh
          ref={walkerMeshRef}
          args={[arrowGeom, undefined, walkerCount]}
        >
          <meshBasicMaterial transparent opacity={0.65} color="#38bdf8" />
        </instancedMesh>
      )}
    </group>
  );
}
