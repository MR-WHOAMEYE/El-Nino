import React, { useEffect, useRef, useState } from 'react';
import { Zap, Volume2, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

interface ThunderFlash3DProps {
  className?: string;
  autoFlash?: boolean;
  flashInterval?: number; // ms between flashes
  children?: React.ReactNode;
  showTrigger?: boolean;
}

export const ThunderFlash3D: React.FC<ThunderFlash3DProps> = ({
  className = '',
  autoFlash = true,
  flashInterval = 3500,
  children,
  showTrigger = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [flashIntensity, setFlashIntensity] = useState(0);
  const [strikeCount, setStrikeCount] = useState(0);

  // Lightning bolt generation parameters
  const triggerLightningStrike = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    interface Point3D {
      x: number;
      y: number;
      z: number;
    }

    interface LightningBranch {
      points: Point3D[];
      width: number;
      alpha: number;
    }

    let activeBranches: LightningBranch[] = [];
    let lightFlashVal = 0;

    // Generate procedural 3D lightning fractal tree
    const generateBolt = (startX: number, startY: number, startZ: number): LightningBranch[] => {
      const branches: LightningBranch[] = [];
      const mainPoints: Point3D[] = [{ x: startX, y: startY, z: startZ }];

      let currX = startX;
      let currY = startY;
      let currZ = startZ;

      const steps = Math.floor(Math.random() * 12) + 16;
      const stepY = (height * 0.8) / steps;

      for (let i = 0; i < steps; i++) {
        currY += stepY + (Math.random() - 0.3) * 15;
        currX += (Math.random() - 0.5) * 70;
        currZ += (Math.random() - 0.5) * 30;

        mainPoints.push({ x: currX, y: currY, z: currZ });

        // Generate side branches randomly
        if (Math.random() < 0.35 && i > 3 && i < steps - 2) {
          const subPoints: Point3D[] = [{ x: currX, y: currY, z: currZ }];
          let subX = currX;
          let subY = currY;
          let subZ = currZ;
          const subSteps = Math.floor(Math.random() * 6) + 4;

          for (let j = 0; j < subSteps; j++) {
            subY += (stepY * 0.6) + (Math.random() - 0.2) * 10;
            subX += (Math.random() - 0.5) * 60 + (currX > startX ? 20 : -20);
            subZ += (Math.random() - 0.5) * 20;
            subPoints.push({ x: subX, y: subY, z: subZ });
          }

          branches.push({
            points: subPoints,
            width: Math.random() * 2 + 1,
            alpha: 0.9,
          });
        }
      }

      branches.unshift({
        points: mainPoints,
        width: Math.random() * 3 + 3,
        alpha: 1.0,
      });

      return branches;
    };

    const strike = () => {
      const startX = Math.random() * (width * 0.7) + width * 0.15;
      const startZ = Math.random() * 50 - 25;
      activeBranches = generateBolt(startX, 0, startZ);
      lightFlashVal = Math.random() * 0.8 + 0.4;
      setFlashActive(true);
      setFlashIntensity(lightFlashVal);
      setStrikeCount((prev) => prev + 1);

      setTimeout(() => setFlashActive(false), 200);
    };

    triggerLightningStrike.current = strike;

    // Auto flash interval loop
    let intervalId: NodeJS.Timeout;
    if (autoFlash) {
      intervalId = setInterval(() => {
        if (Math.random() < 0.8) {
          strike();
        }
      }, flashInterval);
    }

    const render = () => {
      // Clear with dark storm atmosphere gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#02060d');
      bgGrad.addColorStop(0.5, '#07131e');
      bgGrad.addColorStop(1, '#030a10');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render Thunder Flash screen glow effect
      if (lightFlashVal > 0.01) {
        ctx.fillStyle = `rgba(180, 220, 255, ${lightFlashVal * 0.35})`;
        ctx.fillRect(0, 0, width, height);

        // Volumetric Thunder Cloud illumination at top
        const cloudFlashGrad = ctx.createRadialGradient(
          width / 2,
          0,
          10,
          width / 2,
          0,
          width * 0.8
        );
        cloudFlashGrad.addColorStop(0, `rgba(225, 245, 255, ${lightFlashVal * 0.7})`);
        cloudFlashGrad.addColorStop(0.4, `rgba(120, 180, 240, ${lightFlashVal * 0.4})`);
        cloudFlashGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = cloudFlashGrad;
        ctx.fillRect(0, 0, width, height * 0.5);

        lightFlashVal *= 0.88; // decay
      }

      // Render 3D lightning branches with perspective & neon cyan glow
      if (activeBranches.length > 0) {
        activeBranches.forEach((branch) => {
          if (branch.alpha <= 0.02) return;

          ctx.save();
          ctx.beginPath();

          branch.points.forEach((pt, idx) => {
            // Apply 3D perspective tilt offset
            const scale = 1 + pt.z * 0.002;
            const px = pt.x * scale;
            const py = pt.y * scale;

            if (idx === 0) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          });

          // Outer Electric Neon Glow
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 25;
          ctx.strokeStyle = `rgba(186, 230, 253, ${branch.alpha})`;
          ctx.lineWidth = branch.width * 2;
          ctx.stroke();

          // Core High-Intensity White Arc
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 10;
          ctx.strokeStyle = `rgba(255, 255, 255, ${branch.alpha * 1.2})`;
          ctx.lineWidth = branch.width * 0.8;
          ctx.stroke();

          ctx.restore();

          branch.alpha *= 0.86; // decay branch opacity
        });
      }

      // Ambient horizon thunder fog
      const fogGrad = ctx.createLinearGradient(0, height * 0.7, 0, height);
      fogGrad.addColorStop(0, 'rgba(3, 10, 16, 0)');
      fogGrad.addColorStop(1, 'rgba(2, 6, 12, 0.85)');
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, height * 0.7, width, height * 0.3);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (intervalId) clearInterval(intervalId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [autoFlash, flashInterval]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* 3D Thunder Flash Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />

      {/* Screen flash overlay effect for rapid thunder pulse */}
      <div
        className={`absolute inset-0 bg-sky-200/20 transition-opacity duration-75 pointer-events-none z-0 ${
          flashActive ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">{children}</div>

      {/* Manual Thunder Strike trigger button (if requested) */}
      {showTrigger && (
        <div className="absolute top-6 right-6 z-30 flex items-center gap-3">
          <button
            onClick={() => triggerLightningStrike.current && triggerLightningStrike.current()}
            className="px-4 py-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/40 text-cyan-200 rounded-xl font-mono text-xs font-bold shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          >
            <Zap size={14} className="text-cyan-400 fill-cyan-400 animate-pulse" /> Trigger 3D Thunder Flash
          </button>

          <div className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-400 text-[11px] font-mono backdrop-blur-md">
            Strikes: <span className="text-cyan-300 font-bold">{strikeCount}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThunderFlash3D;
