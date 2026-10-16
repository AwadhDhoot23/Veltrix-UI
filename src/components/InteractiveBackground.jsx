import React, { useEffect, useRef } from 'react';

function InteractiveBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = null;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      // Smooth lerp to prevent harsh jumps
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      if (container) {
        container.style.setProperty('--mouse-x', `${currentX}px`);
        container.style.setProperty('--mouse-y', `${currentY}px`);
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        '--mouse-x': '50vw',
        '--mouse-y': '50vh',
      }}
    >
      {/* Base Dark Atmosphere */}
      <div className="absolute inset-0 bg-[#09090b]" />

      {/* Modern React-Bits Style Dot Matrix */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 30%, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 30%, black 40%, transparent 95%)',
        }}
      />

      {/* Mouse Tracking Radial Spotlight */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(650px circle at var(--mouse-x) var(--mouse-y), rgba(99, 102, 241, 0.08), rgba(6, 182, 212, 0.03) 40%, transparent 75%)',
        }}
      />

      {/* Subtle Ambient Indigo & Violet Depth Halos */}
      <div className="absolute -top-[20%] left-[10%] w-[800px] h-[600px] rounded-full bg-indigo-600/[0.07] blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] -right-[10%] w-[700px] h-[600px] rounded-full bg-purple-600/[0.05] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[30%] w-[900px] h-[500px] rounded-full bg-cyan-600/[0.04] blur-[160px] pointer-events-none" />
    </div>
  );
}

export default InteractiveBackground;
