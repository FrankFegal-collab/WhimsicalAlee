/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
  alphaDirection: number;
  color: string;
  type: 'firefly' | 'leaf';
  rotation?: number;
  rotationSpeed?: number;
}

export default function ParticlesBg() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const parent = containerRef.current;
    const canvas = canvasRef.current;
    if (!parent || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const maxParticles = 40;

    // Set canvas dimensions
    const updateSize = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      initParticles();
    };

    // Initialize particles
    const initParticles = () => {
      particles = [];
      const types: ('firefly' | 'leaf')[] = ['firefly', 'firefly', 'leaf']; // 2:1 ratio for fireflies vs leaves
      
      const colors = {
        firefly: ['rgba(251, 191, 36, ', 'rgba(245, 158, 11, ', 'rgba(167, 243, 208, '], // gold, amber, mint green
        leaf: ['rgba(110, 162, 115, ', 'rgba(143, 187, 153, ', 'rgba(120, 143, 115, '] // sage greens
      };

      for (let i = 0; i < maxParticles; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const colorPalette = colors[type];
        const colorBase = colorPalette[Math.floor(Math.random() * colorPalette.length)];

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: type === 'firefly' ? Math.random() * 4 + 1.5 : Math.random() * 6 + 4,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.3 - 0.1, // general drift upwards
          alpha: Math.random() * 0.6 + 0.2,
          alphaDirection: Math.random() > 0.5 ? 0.005 : -0.005,
          color: colorBase,
          type,
          rotation: type === 'leaf' ? Math.random() * Math.PI * 2 : undefined,
          rotationSpeed: type === 'leaf' ? (Math.random() - 0.5) * 0.01 : undefined
        });
      }
    };

    // Use ResizeObserver for responsive canvas scaling
    const resizeObserver = new ResizeObserver((entries) => {
      // Debounce slightly by executing in frame
      requestAnimationFrame(() => {
        if (!entries || entries.length === 0) return;
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        initParticles();
      });
    });

    resizeObserver.observe(parent);
    updateSize();

    // Mouse movement response
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render misty ambient background spots
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 3,
        10,
        canvas.width / 2,
        canvas.height / 3,
        canvas.width * 0.8
      );
      gradient.addColorStop(0, 'rgba(26, 60, 36, 0.15)'); // soft forest green
      gradient.addColorStop(0.5, 'rgba(16, 38, 22, 0.05)');
      gradient.addColorStop(1, 'rgba(10, 20, 13, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render particles
      particles.forEach((p) => {
        // Move particle
        p.x += p.speedX;
        p.y += p.speedY;

        // Fading alpha pulse
        p.alpha += p.alphaDirection;
        if (p.alpha >= 0.8) {
          p.alphaDirection = -Math.abs(p.alphaDirection);
        } else if (p.alpha <= 0.1) {
          p.alphaDirection = Math.abs(p.alphaDirection);
        }

        // Mouse repelling physics
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          const forceX = (dx / dist) * force * 0.8;
          const forceY = (dy / dist) * force * 0.8;
          p.x += forceX;
          p.y += forceY;
        }

        // Screen wrap or push-up wrap
        if (p.x < -20) p.x = canvas.width + 10;
        if (p.x > canvas.width + 20) p.x = -10;
        if (p.y < -20) p.y = canvas.height + 10;
        if (p.y > canvas.height + 20) p.y = -10;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.alpha;

        if (p.type === 'firefly') {
          // Draw a glowing circular yellow firefly
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.alpha})`;
          ctx.shadowBlur = p.size * 5;
          ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
          ctx.fill();
        } else {
          // Draw a small drifting leaf
          ctx.translate(p.x, p.y);
          if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
            p.rotation += p.rotationSpeed;
            ctx.rotate(p.rotation);
          }
          ctx.beginPath();
          // Draw basic leaf shape (ellipse/path)
          ctx.moveTo(0, -p.size);
          ctx.quadraticCurveTo(p.size * 0.6, 0, 0, p.size);
          ctx.quadraticCurveTo(-p.size * 0.6, 0, 0, -p.size);
          ctx.fillStyle = `${p.color}${p.alpha * 0.6})`;
          ctx.fill();
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.unobserve(parent);
      window.removeEventListener('mousemove', handleMouseMove);
      if (canvas) {
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="forest-particles-container"
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
    >
      <canvas
        ref={canvasRef}
        id="forest-particles-canvas"
        className="block w-full h-full pointer-events-auto opacity-70"
      />
    </div>
  );
}
