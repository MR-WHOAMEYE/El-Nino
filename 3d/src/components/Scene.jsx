import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Ocean from './Ocean.jsx';
import WorldLand from './WorldLand.jsx';
import WorldGrid from './WorldGrid.jsx';
import Thermocline from './Thermocline.jsx';
import WarmPool from './WarmPool.jsx';
import WindField from './WindField.jsx';
import RainField from './RainField.jsx';
import DistrictColumns from './DistrictColumns.jsx';
import DistanceRings from './DistanceRings.jsx';
import TeleconnectionArcs from './TeleconnectionArcs.jsx';
import CameraRig from './CameraRig.jsx';
import { AlertTriangle, Compass } from 'lucide-react';

function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

export default function Scene() {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    if (!checkWebGLSupport()) {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-200 p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-400 mb-4" />
        <h2 className="text-xl font-bold mb-2">WebGL Hardware Acceleration Unavailable</h2>
        <p className="max-w-md text-slate-400 text-sm">
          Your browser or display device does not currently have WebGL enabled.
          The interactive climate equity analytics and policy sliders remain fully operational.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-slate-950">
      <Canvas
        camera={{ position: [0, 25.5, 15.0], fov: 42 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor('#020617');
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 30, 20]} intensity={1.3} />
          <directionalLight position={[-15, 15, -10]} intensity={0.4} color="#38bdf8" />

          {/* Base World Framing & Lat/Long Grid */}
          <WorldGrid />

          {/* Full Projected Ocean (SST Anomaly Shader) */}
          <Ocean />

          {/* 3D Extruded Continents with Regional Climate Shading */}
          <WorldLand />

          {/* ENSO Ocean-Atmosphere Physics */}
          <Thermocline />
          <WarmPool />
          <WindField />
          <RainField />

          {/* 3D District Columns */}
          <DistrictColumns />

          {/* Distance Rings & Teleconnection Arcs */}
          <DistanceRings />
          <TeleconnectionArcs />

          {/* High-Angle Perspective Controls */}
          <CameraRig />
        </Suspense>
      </Canvas>

      {/* Projection Orientation Badge */}
      <div className="absolute top-4 left-4 pointer-events-none flex items-center space-x-2 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded text-[11px] font-mono text-slate-300 border border-slate-800 shadow-md">
        <Compass className="w-3.5 h-3.5 text-sky-400" />
        <span>Pacific-Centered World Map (Atlantic Cut 25°W)</span>
      </div>
    </div>
  );
}
