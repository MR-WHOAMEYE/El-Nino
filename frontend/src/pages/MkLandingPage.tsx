import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, LockKeyhole, ShieldCheck, UserRound, Building2 } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { UserRole } from '../types';
import './mkLanding.css';

const roles: Array<{ value: UserRole; label: string; destination: string }> = [
  { value: 'Government', label: 'Authority', destination: '/command-center' },
  { value: 'Citizen', label: 'Citizen', destination: '/citizen' },
  { value: 'Farmer', label: 'Agriculture', destination: '/agriculture' },
];

const MkLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserRole, setDemoMode } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('Government');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let flash = 0;
    let nextStrike = performance.now() + 1400;
    let lightning: Array<Array<{ x: number; y: number }>> = [];
    const drops = Array.from({ length: 180 }, () => ({
      x: Math.random(),
      y: Math.random(),
      speed: 0.004 + Math.random() * 0.009,
      length: 10 + Math.random() * 22,
    }));

    const resize = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const strike = () => {
      const startX = width * (0.15 + Math.random() * 0.7);
      const points: Array<{ x: number; y: number }> = [{ x: startX, y: -10 }];
      let x = startX;
      const steps = 12 + Math.floor(Math.random() * 7);
      for (let index = 1; index <= steps; index += 1) {
        x += (Math.random() - 0.5) * 80;
        points.push({ x, y: (height * 0.72 * index) / steps });
      }
      lightning = [points];
      points.slice(3, -2).forEach((point) => {
        const branch = [point];
        let branchX = point.x;
        for (let index = 1; index < 4; index += 1) {
          branchX += (Math.random() - 0.5) * 90;
          branch.push({ x: branchX, y: point.y + index * 34 });
        }
        lightning.push(branch);
      });
      flash = 1;
    };

    const render = () => {
      const now = performance.now();
      context.clearRect(0, 0, width, height);
      if (now >= nextStrike) {
        strike();
        nextStrike = now + 2600 + Math.random() * 4200;
      }

      if (flash > 0.01) {
        context.fillStyle = `rgba(196, 244, 224, ${flash * 0.16})`;
        context.fillRect(0, 0, width, height);
        context.save();
        context.lineCap = 'round';
        context.lineJoin = 'bevel';
        for (const branch of lightning) {
          context.beginPath();
          context.moveTo(branch[0].x, branch[0].y);
          branch.slice(1).forEach((point) => context.lineTo(point.x, point.y));
          context.strokeStyle = `rgba(226, 255, 241, ${flash})`;
          context.lineWidth = branch === lightning[0] ? 3 : 1.3;
          context.shadowColor = '#bdf0d8';
          context.shadowBlur = 18;
          context.stroke();
        }
        context.restore();
        flash *= 0.82;
        if (flash < 0.02) lightning = [];
      }

      context.strokeStyle = 'rgba(189, 239, 218, 0.22)';
      context.lineWidth = 1;
      for (const drop of drops) {
        drop.y += drop.speed;
        drop.x += drop.speed * 0.18;
        if (drop.y > 1.05) {
          drop.y = -0.05;
          drop.x = Math.random();
        }
        context.beginPath();
        context.moveTo(drop.x * width, drop.y * height);
        context.lineTo(drop.x * width + drop.length * 0.18, drop.y * height + drop.length);
        context.stroke();
      }
      frame = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener('resize', resize);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const enterPlatform = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setUserRole(selectedRole);
    setDemoMode(true, email ? `Demo access granted for ${email}` : 'Demo access granted from the climate gateway');
    const destination = roles.find((role) => role.value === selectedRole)?.destination ?? '/command-center';
    window.setTimeout(() => navigate(destination), 350);
  };

  return (
    <main className="mk-landing">
      <div className="mk-landing__backdrop" aria-hidden="true" />
      <canvas ref={canvasRef} className="mk-landing__rain" aria-hidden="true" />

      <div className="mk-landing__content">
        <nav className="mk-landing__nav">
          <div className="mk-landing__brand">
            <span className="mk-landing__brand-mark">EL</span>
            <span>EL-NEXUS</span>
            <small>Climate Intelligence</small>
          </div>
          <span className="mk-landing__secure"><LockKeyhole size={13} /> Verified access gateway</span>
        </nav>

        <section className="mk-landing__hero">
          <div className="mk-landing__copy">
            <span className="mk-landing__eyebrow"><ShieldCheck size={15} /> Climate decision intelligence</span>
            <h1>Understand the impact.<br /><em>Simulate the future.</em><br />Build resilience.</h1>
            <p>An intelligent interface for understanding how El Nino affects places and communities, exploring strategies, and supporting equitable climate decisions.</p>
            <div className="mk-landing__proof">
              <span><CheckCircle2 size={16} /> Role-based access for field teams and authorities</span>
              <span><CheckCircle2 size={16} /> Real-time exposure and vulnerability indicators</span>
              <span><CheckCircle2 size={16} /> Equity-weighted adaptation planning</span>
            </div>
          </div>

          <form className="mk-landing__gateway" onSubmit={enterPlatform}>
            <div className="mk-landing__gateway-head">
              <div><span>Secure gateway</span><strong>Enter the resilience platform</strong></div>
              <ShieldCheck size={24} />
            </div>
            <div className="mk-landing__role-tabs">
              {roles.slice(0, 2).map((role) => (
                <button key={role.value} type="button" className={selectedRole === role.value ? 'is-active' : ''} onClick={() => setSelectedRole(role.value)}>
                  {role.value === 'Government' ? <Building2 size={16} /> : <UserRound size={16} />}{role.label}
                </button>
              ))}
            </div>
            <label htmlFor="mk-email">Work or personal email</label>
            <input id="mk-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.org" />
            <button className="mk-landing__submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Authorizing...' : 'Continue to platform'} <ArrowRight size={17} />
            </button>
            <small className="mk-landing__gateway-note">Demo access is enabled for this environment. No credentials are stored.</small>
          </form>
        </section>

        <section className="mk-landing__pillars" aria-label="Platform capabilities">
          {[
            ['01', 'Understand', 'Reveal exposure and community vulnerability with geospatial indicators.'],
            ['02', 'Simulate', 'Explore intervention strategies before committing public capital.'],
            ['03', 'Prioritize', 'Allocate resilience resources using transparent equity weights.'],
          ].map(([number, title, description]) => (
            <article key={number}><span>{number}</span><div><h2>{title}</h2><p>{description}</p></div></article>
          ))}
        </section>
        <footer>EL-NEXUS Climate Resilience Intelligence <span>2026</span></footer>
      </div>
    </main>
  );
};

export default MkLandingPage;