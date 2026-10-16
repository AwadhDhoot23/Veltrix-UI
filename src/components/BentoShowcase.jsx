import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// --- Subcomponent 1: Glare 3D Card ---
function Glare3DCardWidget({ onClick }) {
  const cardRef = useRef(null);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -12;
    const rotY = ((x - centerX) / centerX) * 12;

    setRotate({ x: rotX, y: rotY });
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.6,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer h-full min-h-[260px] bg-neutral-950/90 border border-neutral-800/80 hover:border-neutral-500 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black"
      style={{ perspective: 1000 }}
    >
      {/* Glare Sheen Layer */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: glarePosition.opacity,
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.15), transparent 60%)`,
        }}
      />

      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-indigo-400 bg-indigo-950/50 border border-indigo-800/40 rounded-full">
          3D & Tilt
        </span>
        <span className="text-xs text-neutral-400 group-hover:text-white transition-colors flex items-center gap-1 font-mono">
          Explore ↗
        </span>
      </div>

      {/* Tilt Preview Stage */}
      <motion.div
        animate={{ rotateX: rotate.x, rotateY: rotate.y }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="my-auto py-4 flex flex-col items-center justify-center text-center z-10"
      >
        <div className="w-44 h-24 rounded-xl bg-gradient-to-br from-neutral-800/80 via-neutral-900 to-neutral-950 border border-neutral-700/60 p-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400/80" />
            <div className="h-1.5 w-12 bg-neutral-700 rounded-full" />
          </div>
          <div className="space-y-1.5 text-left">
            <div className="h-2 w-20 bg-neutral-600 rounded" />
            <div className="h-1.5 w-28 bg-neutral-800 rounded" />
          </div>
        </div>
      </motion.div>

      {/* Bottom Typography */}
      <div className="z-10 mt-2">
        <h3 className="text-base font-bold text-white group-hover:text-neutral-200 transition-colors">
          Glare Hover 3D Card
        </h3>
        <p className="text-neutral-400 text-xs mt-1">
          Smooth hardware-accelerated 3D tilt physics with dynamic radial glare sheen.
        </p>
      </div>
    </div>
  );
}

// --- Subcomponent 2: Magnetic Hover Button ---
function MagneticButtonWidget({ onClick }) {
  const btnRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 180, damping: 15 });
  const springY = useSpring(y, { stiffness: 180, damping: 15 });

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    x.set(distanceX * 0.35);
    y.set(distanceY * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer h-full min-h-[260px] bg-neutral-950/90 border border-neutral-800/80 hover:border-neutral-500 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black"
    >
      <div className="flex items-center justify-between z-10">
        <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 rounded-full">
          Physics
        </span>
        <span className="text-xs text-neutral-400 group-hover:text-white transition-colors flex items-center gap-1 font-mono">
          Explore ↗
        </span>
      </div>

      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="my-auto py-6 flex items-center justify-center"
      >
        <motion.div
          ref={btnRef}
          style={{ x: springX, y: springY }}
          className="px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-medium text-xs tracking-wide shadow-lg group-hover:border-emerald-500/60 transition-colors flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Hover Near Me</span>
        </motion.div>
      </div>

      <div className="z-10 mt-2">
        <h3 className="text-base font-bold text-white group-hover:text-neutral-200 transition-colors">
          Magnetic Hover Button
        </h3>
        <p className="text-neutral-400 text-xs mt-1">
          Magnetic attraction with spring damping that tracks cursor vicinity.
        </p>
      </div>
    </div>
  );
}

// --- Subcomponent 3: Apple-Style Morphing Dock ---
function MorphingDockWidget({ onClick }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const icons = [
    { id: 1, label: 'Code' },
    { id: 2, label: 'Layout' },
    { id: 3, label: 'Motion' },
    { id: 4, label: 'Effects' },
    { id: 5, label: 'Terminal' },
  ];

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer h-full min-h-[260px] bg-neutral-950/90 border border-neutral-800/80 hover:border-neutral-500 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black"
    >
      <div className="flex items-center justify-between z-10">
        <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 rounded-full">
          Navigation
        </span>
        <span className="text-xs text-neutral-400 group-hover:text-white transition-colors flex items-center gap-1 font-mono">
          Explore ↗
        </span>
      </div>

      {/* Dock Container */}
      <div className="my-auto py-6 flex items-center justify-center">
        <div
          onMouseLeave={() => setHoveredIdx(null)}
          className="flex items-end gap-2 px-3 py-2.5 bg-neutral-900/90 border border-neutral-800 rounded-2xl backdrop-blur-md shadow-2xl"
        >
          {icons.map((item, idx) => {
            const isHovered = hoveredIdx === idx;
            const isNeighbor =
              hoveredIdx !== null && Math.abs(hoveredIdx - idx) === 1;

            return (
              <motion.div
                key={item.id}
                onMouseEnter={() => setHoveredIdx(idx)}
                animate={{
                  width: isHovered ? 48 : isNeighbor ? 40 : 32,
                  height: isHovered ? 48 : isNeighbor ? 40 : 32,
                  y: isHovered ? -8 : isNeighbor ? -4 : 0,
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 cursor-pointer shadow-md"
              >
                <div className="w-3.5 h-3.5 rounded bg-neutral-500/80" />
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="z-10 mt-2">
        <h3 className="text-base font-bold text-white group-hover:text-neutral-200 transition-colors">
          Apple-Style Morphing Dock
        </h3>
        <p className="text-neutral-400 text-xs mt-1">
          Fluid icon scaling and parabolic expansion matching macOS dock interactions.
        </p>
      </div>
    </div>
  );
}

// --- Subcomponent 4: Shimmer Metallic Action Button ---
function ShimmerButtonWidget({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer h-full min-h-[260px] bg-neutral-950/90 border border-neutral-800/80 hover:border-neutral-500 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black"
    >
      <div className="flex items-center justify-between z-10">
        <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-amber-400 bg-amber-950/50 border border-amber-800/40 rounded-full">
          Animation
        </span>
        <span className="text-xs text-neutral-400 group-hover:text-white transition-colors flex items-center gap-1 font-mono">
          Explore ↗
        </span>
      </div>

      <div className="my-auto py-6 flex items-center justify-center">
        <div className="relative inline-flex overflow-hidden rounded-xl p-[1px] focus:outline-none">
          <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#e2e8f0_0%,#09090b_50%,#e2e8f0_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-neutral-950 px-6 py-2.5 text-xs font-semibold text-white backdrop-blur-3xl transition-colors hover:bg-neutral-900 gap-2">
            <span>Metallic Action</span>
            <span className="text-neutral-400 font-mono text-[11px]">✦</span>
          </span>
        </div>
      </div>

      <div className="z-10 mt-2">
        <h3 className="text-base font-bold text-white group-hover:text-neutral-200 transition-colors">
          Metallic Shimmer Action
        </h3>
        <p className="text-neutral-400 text-xs mt-1">
          High-contrast conic gradient sheen simulating a reflective chrome border.
        </p>
      </div>
    </div>
  );
}

// --- Subcomponent 5: Futuristic Terminal Box ---
function TerminalBoxWidget({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer h-full min-h-[260px] bg-neutral-950/90 border border-neutral-800/80 hover:border-neutral-500 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black"
    >
      <div className="flex items-center justify-between z-10">
        <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-purple-400 bg-purple-950/50 border border-purple-800/40 rounded-full">
          Developer UI
        </span>
        <span className="text-xs text-neutral-400 group-hover:text-white transition-colors flex items-center gap-1 font-mono">
          Explore ↗
        </span>
      </div>

      {/* Terminal Viewport */}
      <div className="my-auto py-3 w-full">
        <div className="w-full bg-black/80 border border-neutral-800 rounded-xl p-3 font-mono text-[11px] space-y-1.5 shadow-inner">
          <div className="flex items-center gap-1.5 pb-2 border-b border-neutral-900">
            <span className="w-2 h-2 rounded-full bg-red-500/80" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
            <span className="text-[10px] text-neutral-500 ml-2">bash ~ veltrix</span>
          </div>
          <div className="text-neutral-300 pt-1 flex items-center gap-1">
            <span className="text-emerald-400">$</span>
            <span>npx veltrix-ui add</span>
          </div>
          <div className="text-neutral-500 text-[10px]">
            [ready] 37 components indexed
          </div>
          <div className="flex items-center gap-1 text-cyan-400 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>live compile ready</span>
          </div>
        </div>
      </div>

      <div className="z-10 mt-2">
        <h3 className="text-base font-bold text-white group-hover:text-neutral-200 transition-colors">
          Futuristic Terminal Box
        </h3>
        <p className="text-neutral-400 text-xs mt-1">
          Technical code sandbox with status pings and live compilation prompts.
        </p>
      </div>
    </div>
  );
}

// --- Main Bento Showcase Component ---
function BentoShowcase() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 mb-2">
          Interactive Component Showcase
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Crafted for Extraordinary Interfaces
        </h2>
        <p className="mt-3 text-neutral-400 max-w-xl mx-auto text-sm sm:text-base">
          Interact directly with the components below. Click any card to inspect
          live source code and copy snippets instantly.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Box 1: 3D Glare Card */}
        <div className="lg:col-span-1">
          <Glare3DCardWidget onClick={() => navigate('/components/glare-hover-3d-card')} />
        </div>

        {/* Box 2: Magnetic Button */}
        <div className="lg:col-span-1">
          <MagneticButtonWidget onClick={() => navigate('/components/magnetic-hover-button')} />
        </div>

        {/* Box 3: Shimmer Metallic Action */}
        <div className="lg:col-span-1">
          <ShimmerButtonWidget
            onClick={() =>
              navigate('/components/futuristic-shimmer-metallic-action-button')
            }
          />
        </div>

        {/* Box 4: Apple Morphing Dock (Span 2 on lg) */}
        <div className="md:col-span-2 lg:col-span-2">
          <MorphingDockWidget
            onClick={() => navigate('/components/apple-style-morphing-dock')}
          />
        </div>

        {/* Box 5: Futuristic Terminal Box */}
        <div className="md:col-span-1 lg:col-span-1">
          <TerminalBoxWidget
            onClick={() => navigate('/components/futuristic-terminal-box')}
          />
        </div>
      </div>
    </div>
  );
}

export default BentoShowcase;
