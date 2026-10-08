import React, { useEffect, useRef, useState } from 'react';
import { CloudRain, Zap, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface StormVideoBackgroundProps {
  className?: string;
}

interface LightningBranch {
  points: { x: number; y: number }[];
  width: number;
  alpha: number;
}

export const StormVideoBackground: React.FC<StormVideoBackgroundProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rainGainRef = useRef<GainNode | null>(null);

  // Trigger manual lightning strike
  const manualStrikeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // --- Rain Streaks Engine ---
    const rainCount = Math.min(650, Math.floor((width * height) / 2500));
    const raindrops = Array.from({ length: rainCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: 14 + Math.random() * 22,
      speed: 16 + Math.random() * 18,
      thickness: 0.8 + Math.random() * 1.4,
      alpha: 0.15 + Math.random() * 0.45,
    }));

    // Rain Splash Ripples
    interface Splash {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
    }
    const splashes: Splash[] = [];

    // --- Visible Lightning Engine ---
    let currentLightning: LightningBranch[] = [];
    let flashIntensity = 0; // 0 to 1
    let flashDecay = 0.05;
    let nextStrikeTime = performance.now() + 1200 + Math.random() * 2000;

    // Helper: Generate fractal jagged lightning bolt
    const createLightningBolt = (startX?: number, startY?: number) => {
      const branches: LightningBranch[] = [];
      const originX = startX ?? width * 0.15 + Math.random() * width * 0.7;
      // Allow lightning to start anywhere from high in the sky to mid-cloud
      const originY = startY ?? Math.random() * (height * 0.2);

      // Recursive branch builder
      const buildBranch = (
        x1: number,
        y1: number,
        targetY: number,
        depth: number,
        mainWidth: number
      ) => {
        const points = [{ x: x1, y: y1 }];
        let curX = x1;
        let curY = y1;
        const totalSteps = 16 + Math.floor(Math.random() * 10);
        const yStep = (targetY - y1) / totalSteps;

        for (let i = 0; i < totalSteps; i++) {
          curY += yStep;
          // Jagged jitter in X
          const sway = (Math.random() - 0.5) * (depth === 0 ? 60 : 40);
          curX += sway;
          points.push({ x: curX, y: curY });

          // Sub-fork opportunity
          if (depth < 2 && Math.random() < 0.32 && i > 2 && i < totalSteps - 2) {
            const forkTargetY = curY + (targetY - curY) * (0.35 + Math.random() * 0.45);
            buildBranch(curX, curY, forkTargetY, depth + 1, mainWidth * 0.65);
          }
        }

        branches.push({
          points,
          width: Math.max(1.2, mainWidth),
          alpha: 1.0,
        });
      };

      const groundY = height * (0.75 + Math.random() * 0.25);
      buildBranch(originX, originY, groundY, 0, 4.2);

      currentLightning = branches;
      flashIntensity = 1.0;
      flashDecay = 0.04 + Math.random() * 0.025;

      // Create splash at foot of lightning
      if (branches.length > 0 && branches[0].points.length > 0) {
        const foot = branches[0].points[branches[0].points.length - 1];
        for (let s = 0; s < 16; s++) {
          splashes.push({
            x: foot.x + (Math.random() - 0.5) * 80,
            y: foot.y + (Math.random() - 0.5) * 30,
            radius: 2,
            maxRadius: 20 + Math.random() * 30,
            alpha: 0.95,
          });
        }
      }

      // Audio synthesis for thunder rumble if enabled
      if (soundEnabled && audioCtxRef.current) {
        playThunderSound();
      }
    };

    manualStrikeRef.current = () => {
      createLightningBolt();
    };

    // --- Web Audio Synthesizer (Realistic Rain & Thunder Sound) ---
    const playThunderSound = () => {
      try {
        const actx = audioCtxRef.current;
        if (!actx || actx.state === 'suspended') return;

        const osc = actx.createOscillator();
        const gain = actx.createGain();
        const filter = actx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65, actx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(25, actx.currentTime + 1.2);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, actx.currentTime);
        filter.frequency.linearRampToValueAtTime(60, actx.currentTime + 1.4);

        gain.gain.setValueAtTime(0.01, actx.currentTime);
        gain.gain.linearRampToValueAtTime(0.28, actx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 1.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(actx.destination);

        osc.start();
        osc.stop(actx.currentTime + 1.8);
      } catch (err) {
        console.warn('Audio playback error', err);
      }
    };

    // --- Animation Render Loop ---
    let animId: number;
    const render = () => {
      const now = performance.now();

      // Check for scheduled automatic lightning strike
      if (now >= nextStrikeTime) {
        createLightningBolt();
        nextStrikeTime = now + 2400 + Math.random() * 3800; // strike every 2.4 - 6.2s
      }

      // Clear with subtle trail
      ctx.clearRect(0, 0, width, height);

      // --- Draw Atmospheric Lightning Whole-Sky Flash ---
      if (flashIntensity > 0.01) {
        // Full sky electric ionization flash
        const flashGradient = ctx.createRadialGradient(
          width / 2,
          height * 0.2,
          50,
          width / 2,
          height * 0.4,
          Math.max(width, height)
        );
        flashGradient.addColorStop(0, `rgba(220, 245, 235, ${flashIntensity * 0.55})`);
        flashGradient.addColorStop(0.5, `rgba(120, 169, 139, ${flashIntensity * 0.25})`);
        flashGradient.addColorStop(1, `rgba(7, 23, 18, ${flashIntensity * 0.1})`);

        ctx.fillStyle = flashGradient;
        ctx.fillRect(0, 0, width, height);

        // --- Draw Visible Branching Lightning Bolts ---
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'bevel';

        currentLightning.forEach((branch) => {
          if (branch.points.length < 2) return;

          // 1. Wide outer atmospheric electric glow (Cyan/Mint)
          ctx.beginPath();
          ctx.moveTo(branch.points[0].x, branch.points[0].y);
          for (let i = 1; i < branch.points.length; i++) {
            ctx.lineTo(branch.points[i].x, branch.points[i].y);
          }
          ctx.strokeStyle = `rgba(120, 220, 180, ${flashIntensity * 0.85})`;
          ctx.lineWidth = branch.width * 3.5;
          ctx.shadowColor = '#DCEFE5';
          ctx.shadowBlur = 24;
          ctx.stroke();

          // 2. High-intensity secondary ionizing arc
          ctx.strokeStyle = `rgba(180, 245, 225, ${flashIntensity * 0.95})`;
          ctx.lineWidth = branch.width * 1.8;
          ctx.shadowBlur = 12;
          ctx.stroke();

          // 3. Piercing pure-white core of the thunderbolt (NO ORANGE)
          ctx.strokeStyle = `rgba(255, 255, 255, ${flashIntensity})`;
          ctx.lineWidth = Math.max(1.2, branch.width * 0.8);
          ctx.shadowBlur = 6;
          ctx.stroke();
        });

        ctx.restore();

        // Decay flash intensity
        flashIntensity = Math.max(0, flashIntensity - flashDecay);
        if (flashIntensity < 0.01) {
          currentLightning = [];
        }
      }

      // --- Draw Falling Rain Streaks ---
      ctx.save();
      const rainAngle = 0.18; // wind slant
      ctx.lineCap = 'round';

      for (let i = 0; i < raindrops.length; i++) {
        const drop = raindrops[i];
        drop.y += drop.speed;
        drop.x += drop.speed * rainAngle;

        // Reset drop when hitting floor
        if (drop.y > height) {
          drop.y = -drop.len;
          drop.x = Math.random() * (width + 200) - 100;

          // Spawn ground splash ripple occasionally
          if (Math.random() < 0.15) {
            splashes.push({
              x: drop.x,
              y: height - 10 - Math.random() * 40,
              radius: 1,
              maxRadius: 8 + Math.random() * 12,
              alpha: 0.5 + flashIntensity * 0.4,
            });
          }
        }

        // When lightning flashes, rain illuminates brilliantly in mid-air
        const dropAlpha = Math.min(1.0, drop.alpha + flashIntensity * 0.6);
        const dropColor =
          flashIntensity > 0.15
            ? `rgba(225, 250, 240, ${dropAlpha})`
            : `rgba(160, 205, 190, ${dropAlpha})`;

        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.len * rainAngle, drop.y + drop.len);
        ctx.strokeStyle = dropColor;
        ctx.lineWidth = drop.thickness + flashIntensity * 0.5;
        ctx.stroke();
      }

      // --- Draw Ground Splash Ripples ---
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.radius += 0.85;
        s.alpha -= 0.035;

        if (s.alpha <= 0 || s.radius >= s.maxRadius) {
          splashes.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.radius * 1.8, s.radius * 0.5, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(180, 235, 215, ${s.alpha * (0.6 + flashIntensity * 0.4)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [soundEnabled]);

  // Audio Toggle Handler
  const toggleSound = () => {
    if (!soundEnabled) {
      // Initialize Web Audio API rain synthesizer
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const actx = new AudioCtx();
        audioCtxRef.current = actx;

        // Create rain white noise stream
        const bufferSize = actx.sampleRate * 2;
        const noiseBuffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = actx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = actx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1100;

        const gainNode = actx.createGain();
        gainNode.gain.setValueAtTime(0.06, actx.currentTime);
        rainGainRef.current = gainNode;

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(actx.destination);

        whiteNoise.start();
      }
      setSoundEnabled(true);
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      setSoundEnabled(false);
    }
  };

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}>
      {/* 1. Full-screen Video Background with Looping Atmospheric Thunderstorm */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-85 contrast-110"
      >
        {/* High-quality slow motion thunderstorm and rain cloud loop */}
        <source
          src="https://upload.wikimedia.org/wikipedia/commons/1/1c/Lightning_strikes_in_slow_motion_%28240fps%29_in_Muurame%2C_Finland.webm"
          type="video/webm"
        />
        <source
          src="https://upload.wikimedia.org/wikipedia/commons/transcoded/1/1c/Lightning_strikes_in_slow_motion_%28240fps%29_in_Muurame%2C_Finland.webm/Lightning_strikes_in_slow_motion_%28240fps%29_in_Muurame%2C_Finland.webm.720p.vp9.webm"
          type="video/webm"
        />
      </video>

      {/* 2. Cohesive Dark Overlay with Blend Modes for Impeccable Text Legibility */}
      {/* Layer A: Deep forest shadow tint */}
      <div 
        className="absolute inset-0 bg-[#071712]/55 backdrop-blur-[0.5px]" 
        style={{ mixBlendMode: 'multiply' }} 
      />
      {/* Layer B: Vignette and directional lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#071712]/50 via-transparent to-[#071712]/75" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#071712]/30 to-[#071712]/80" />

      {/* 3. Dynamic High-Impact Visible Lightning & Torrential Rain Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
};

export default StormVideoBackground;
