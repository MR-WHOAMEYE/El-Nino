import React, { useEffect, useRef } from 'react';
import Scene from '../components/Scene.jsx';
import { useSimStore } from '../store/useSimStore.js';
import { useSyncMain } from '../sync/useSyncMain.js';

export default function MainView() {
  useSyncMain();

  const isPlaying = useSimStore((state) => state.isPlaying);
  const playbackSpeed = useSimStore((state) => state.playbackSpeed);
  const stepSim = useSimStore((state) => state.stepSim);

  // Simulation physics animation loop (MainView is the single source of truth for clock & physics)
  const lastTimeRef = useRef(performance.now());
  useEffect(() => {
    let animId;

    const loop = (now) => {
      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (isPlaying) {
        // dtMonths: 1 second of real time corresponds to ~1 month of simulation at 1x speed
        const dtMonths = Math.min(0.2, deltaSec * playbackSpeed * 0.8);
        stepSim(dtMonths);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, playbackSpeed, stepSim]);

  // Keyboard shortcut listener on MainView: F (fullscreen), C (cloud X-ray)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')) return;

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.().catch(() => {});
        } else {
          document.exitFullscreen?.().catch(() => {});
        }
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        useSimStore.getState().toggleCloudXRay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      {/* 3D Global Scene Viewport - Pure Clean Presentation View */}
      <div className="absolute inset-0 w-full h-full">
        <Scene />
      </div>
    </div>
  );
}

