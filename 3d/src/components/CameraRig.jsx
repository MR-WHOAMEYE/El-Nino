import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useSimStore } from '../store/useSimStore.js';

// Camera position and lookAt target presets
const CAMERA_PRESETS = {
  // High-angle three-quarter view (~60° down): India, Australia, Pacific, and South America all visible
  overview: {
    position: new THREE.Vector3(0, 25.5, 15.0),
    target: new THREE.Vector3(0, 0, 0)
  },
  walker: {
    position: new THREE.Vector3(0, 11.0, 16.0),
    target: new THREE.Vector3(0, 2.0, 0)
  },
  crossSection: {
    position: new THREE.Vector3(0, 4.5, 14.5),
    target: new THREE.Vector3(0, -1.5, 0)
  },
  indiaFocus: {
    position: new THREE.Vector3(-8.0, 12.0, 7.5),
    target: new THREE.Vector3(-8.0, 0.2, -2.2)
  },
  southeastAsiaFocus: {
    position: new THREE.Vector3(-2.5, 12.5, 8.5),
    target: new THREE.Vector3(-2.5, 0.2, 0.5)
  },
  southAmericaFocus: {
    position: new THREE.Vector3(12.5, 11.5, 7.5),
    target: new THREE.Vector3(12.5, 0.2, 1.2)
  },
  americasFocus: {
    position: new THREE.Vector3(12.5, 11.5, 7.5),
    target: new THREE.Vector3(12.5, 0.2, 1.2)
  },
  africaFocus: {
    position: new THREE.Vector3(-14.0, 13.0, 8.5),
    target: new THREE.Vector3(-14.0, 0.2, -0.5)
  }
};

export default function CameraRig() {
  const { camera } = useThree();
  const controlsRef = useRef(null);
  const cameraPreset = useSimStore((state) => state.cameraPreset);
  const autoRotate = useSimStore((state) => state.autoRotate);

  const targetPos = useRef(new THREE.Vector3(0, 24.5, 17.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef(false);

  // Trigger smooth transition only when preset explicitly changes
  useEffect(() => {
    const config = CAMERA_PRESETS[cameraPreset] || CAMERA_PRESETS.overview;
    targetPos.current.copy(config.position);
    targetLookAt.current.copy(config.target);
    isTransitioning.current = true;
  }, [cameraPreset]);

  // Cancel preset transition if user interacts manually on 3D view
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleStart = () => {
      isTransitioning.current = false;
    };

    controls.addEventListener('start', handleStart);
    return () => {
      controls.removeEventListener('start', handleStart);
    };
  }, []);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (isTransitioning.current) {
      // Smooth 1.5s exponential ease-in lerp
      const lerpFactor = Math.min(1.0, delta * 2.2);
      camera.position.lerp(targetPos.current, lerpFactor);
      controls.target.lerp(targetLookAt.current, lerpFactor);

      // Stop transitioning once close enough
      const posDist = camera.position.distanceTo(targetPos.current);
      const targetDist = controls.target.distanceTo(targetLookAt.current);
      if (posDist < 0.04 && targetDist < 0.04) {
        camera.position.copy(targetPos.current);
        controls.target.copy(targetLookAt.current);
        isTransitioning.current = false;
      }
    }

    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      autoRotate={autoRotate}
      autoRotateSpeed={0.8}
      enableDamping
      dampingFactor={0.08}
      maxPolarAngle={Math.PI / 2.08} // Keep camera above horizon
      minDistance={6}
      maxDistance={65}
      maxPan={25}
    />
  );
}

