import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Wind, Droplets, Sliders, Volume2, VolumeX } from 'lucide-react';

interface StormVideoBackgroundProps {
  className?: string;
  intensity?: 'low' | 'moderate' | 'extreme';
  showControls?: boolean;
  children?: React.ReactNode;
}

export const StormVideoBackground: React.FC<StormVideoBackgroundProps> = ({
  className = '',
  intensity = 'extreme',
  showControls = false,
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [rainCount, setRainCount] = useState(intensity === 'extreme' ? 1200 : intensity === 'moderate' ? 700 : 400);
  const [windSpeed, setWindSpeed] = useState(intensity === 'extreme' ? 18 : intensity === 'moderate' ? 10 : 5);
  const [showConfig, setShowConfig] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

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

    // 3D Particles simulation parameters
    interface Particle3D {
      x: number;
      y: number;
      z: number; // depth perspective factor 0.1 -> 3.0
      len: number;
      speedY: number;
      speedX: number;
      alpha: number;
    }

    const particles: Particle3D[] = [];
    const maxParticles = rainCount;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width * 1.5 - width * 0.25,
        y: Math.random() * height,
        z: Math.random() * 2.5 + 0.5,
        len: Math.random() * 25 + 15,
        speedY: Math.random() * 20 + 25,
        speedX: (Math.random() - 0.5) * 2 - windSpeed,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    // Swirling Cloud Particles
    interface CloudNode {
      x: number;
      y: number;
      radius: number;
      speed: number;
      angle: number;
      alpha: number;
    }
    const clouds: CloudNode[] = [];
    for (let c = 0; c < 18; c++) {
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.45),
        radius: Math.random() * 250 + 150,
        speed: (Math.random() * 0.4 + 0.1) * (windSpeed / 10),
        angle: Math.random() * Math.PI * 2,
        alpha: Math.random() * 0.15 + 0.05,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;

      // Dark storm atmosphere background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#040d12');
      bgGrad.addColorStop(0.4, '#091c24');
      bgGrad.addColorStop(0.8, '#0b2b28');
      bgGrad.addColorStop(1, '#05111a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render dark rolling storm clouds
      clouds.forEach((cloud) => {
        cloud.x += cloud.speed;
        if (cloud.x - cloud.radius > width) cloud.x = -cloud.radius;

        const cloudGrad = ctx.createRadialGradient(
          cloud.x,
          cloud.y,
          0,
          cloud.x,
          cloud.y,
          cloud.radius
        );
        cloudGrad.addColorStop(0, `rgba(18, 38, 48, ${cloud.alpha})`);
        cloudGrad.addColorStop(0.5, `rgba(10, 25, 32, ${cloud.alpha * 0.6})`);
        cloudGrad.addColorStop(1, 'rgba(4, 13, 18, 0)');

        ctx.fillStyle = cloudGrad;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render 3D rain streaks with depth perspective & motion blur
      ctx.lineWidth = 1.5;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (isPlaying) {
          p.y += p.speedY * (p.z * 0.5);
          p.x -= (windSpeed + 5) * (p.z * 0.4);

          // Reset particle if off-screen
          if (p.y > height || p.x < -100) {
            p.y = -50;
            p.x = Math.random() * (width + 400) - 100;
            p.z = Math.random() * 2.5 + 0.5;
          }
        }

        const dropWidth = Math.max(0.8, p.z * 0.9);
        const dropLength = p.len * p.z;

        const strokeGrad = ctx.createLinearGradient(
          p.x,
          p.y,
          p.x - windSpeed * 0.8,
          p.y + dropLength
        );
        strokeGrad.addColorStop(0, `rgba(180, 220, 240, 0)`);
        strokeGrad.addColorStop(0.5, `rgba(140, 200, 230, ${p.alpha * 0.7})`);
        strokeGrad.addColorStop(1, `rgba(220, 245, 255, ${p.alpha})`);

        ctx.beginPath();
        ctx.lineWidth = dropWidth;
        ctx.strokeStyle = strokeGrad;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - (windSpeed * 0.5) * p.z, p.y + dropLength);
        ctx.stroke();

        // Splash effect at bottom surface
        if (p.y + dropLength >= height - 30 && p.z > 1.2) {
          ctx.beginPath();
          ctx.ellipse(
            p.x - (windSpeed * 0.5) * p.z,
            height - Math.random() * 15,
            Math.random() * 4 * p.z,
            Math.random() * 1.5 * p.z,
            0,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(180, 230, 255, ${p.alpha * 0.3})`;
          ctx.fill();
        }
      }

      // Vignette effect overlay
      const vignetteGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.35,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );
      vignetteGrad.addColorStop(0, 'rgba(0,0,0,0)');
      vignetteGrad.addColorStop(1, 'rgba(2, 8, 12, 0.7)');
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, rainCount, windSpeed]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* 3D Storm Video Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />

      {/* Atmospheric Fog Grid / Scanlines Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-slate-950/40 to-black/80 pointer-events-none z-0" />

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">{children}</div>

      {/* Optional Interactive Controls overlay */}
      {showControls && (
        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-3 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-teal-500/30 text-white shadow-2xl text-xs font-mono">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-teal-950/80 hover:bg-teal-800 text-teal-300 transition-all border border-teal-500/40"
            title={isPlaying ? 'Pause 3D Storm' : 'Play 3D Storm'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-teal-500/30 border-teal-400 text-teal-200'
                : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
            title="Ambient Audio Toggle"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 transition-all border border-slate-700"
            title="Storm Settings"
          >
            <Sliders size={16} />
          </button>

          {showConfig && (
            <div className="absolute bottom-16 right-0 w-64 bg-slate-950/95 border border-teal-500/40 rounded-2xl p-4 shadow-2xl flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between font-sans font-bold text-teal-400 border-b border-slate-800 pb-2">
                <span>3D Storm Settings</span>
                <span className="text-[10px] text-slate-500 uppercase">Live Engine</span>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-300">
                  <span className="flex items-center gap-1">
                    <Droplets size={12} className="text-teal-400" /> Rain Intensity
                  </span>
                  <span>{rainCount}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="100"
                  value={rainCount}
                  onChange={(e) => setRainCount(Number(e.target.value))}
                  className="w-full accent-teal-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-slate-300">
                  <span className="flex items-center gap-1">
                    <Wind size={12} className="text-teal-400" /> Wind Speed
                  </span>
                  <span>{windSpeed} kn</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  className="w-full accent-teal-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StormVideoBackground;
