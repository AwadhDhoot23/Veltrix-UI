import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Home, Search, Bell, User, Settings } from "lucide-react";

// --- Actual Component 1: Glare Hover Card (from database) ---
function ActualGlareCard() {
  const ref = useRef(null);
  const [style, setStyle] = useState({ rotX: 0, rotY: 0, glareX: 50, glareY: 50, opacity: 0 });

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const rotY = ((e.clientX - cx) / (r.width / 2)) * 18;
    const rotX = -((e.clientY - cy) / (r.height / 2)) * 18;
    setStyle({
      rotX,
      rotY,
      glareX: ((e.clientX - r.left) / r.width) * 100,
      glareY: ((e.clientY - r.top) / r.height) * 100,
      opacity: 0.28,
    });
  };

  const onLeave = () => setStyle({ rotX: 0, rotY: 0, glareX: 50, glareY: 50, opacity: 0 });

  return (
    <div className="flex items-center justify-center w-full py-2">
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative w-full max-w-[280px] sm:max-w-xs rounded-2xl overflow-hidden select-none cursor-pointer"
        style={{
          transform: `perspective(1000px) rotateX(${style.rotX}deg) rotateY(${style.rotY}deg)`,
          transition: "transform 0.1s ease",
          transformStyle: "preserve-3d",
          background: "linear-gradient(145deg, #0f0f1e 0%, #171730 50%, #0c0c1d 100%)",
          boxShadow: "0 30px 60px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.18)",
        }}
      >
        {/* Specular Glare */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-10"
          style={{
            background: `radial-gradient(circle at ${style.glareX}% ${style.glareY}%, rgba(255,255,255,${style.opacity}) 0%, transparent 58%)`,
            transition: "background 0.05s",
          }}
        />

        {/* Card Content */}
        <div className="relative p-5 sm:p-6 z-10">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-mono text-indigo-300"
              style={{
                background: "linear-gradient(135deg, #1e1b4b, #312e81)",
                boxShadow: "0 0 16px rgba(99, 102, 241, 0.4)",
              }}
            >
              ✦
            </div>
            <div>
              <p className="text-white font-bold text-xs sm:text-sm">Veltrix UI</p>
              <p className="text-neutral-500 text-[10px]">3D Interactive</p>
            </div>
          </div>
          <h3 className="text-white font-extrabold text-base sm:text-lg mb-1.5">
            Glare Hover Card
          </h3>
          <p className="text-neutral-400 text-xs leading-relaxed mb-4">
            3D perspective tilt and dynamic specular light glare.
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {["3D Tilt", "Glare", "Interactive"].map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Actual Component 2: Magnetic Hover Button (from database) ---
function ActualMagneticButton() {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.25, y: middleY * 0.25 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });
  const { x, y } = position;

  return (
    <div className="flex items-center justify-center w-full py-6">
      <motion.button
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        animate={{ x, y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        className="relative px-8 py-3.5 bg-white/10 text-white font-medium rounded-full overflow-hidden hover:bg-white/20 transition-colors border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.08)] cursor-pointer text-sm"
      >
        <span className="relative z-10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Magnetic Hover</span>
        </span>
      </motion.button>
    </div>
  );
}

// --- Actual Component 3: Morphing Dock (from database) ---
function DockIcon({ icon: Icon, mouseX }) {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-120, 0, 120], [36, 64, 36]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="aspect-square rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-lg cursor-pointer hover:bg-white/20 transition-colors"
    >
      <Icon className="w-1/2 h-1/2 text-white" />
    </motion.div>
  );
}

function ActualMorphingDock() {
  const mouseX = useMotionValue(Infinity);
  const icons = [Home, Search, Bell, User, Settings];

  return (
    <div className="flex items-center justify-center w-full py-4">
      <div
        className="flex gap-3 sm:gap-4 p-3.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 items-end h-[90px]"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {icons.map((Icon, idx) => (
          <DockIcon key={idx} icon={Icon} mouseX={mouseX} />
        ))}
      </div>
    </div>
  );
}

// --- Actual Component 4: Shimmer Action Button (from database) ---
function ActualShimmerButton() {
  return (
    <div className="flex items-center justify-center w-full py-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative inline-flex items-center justify-center p-0.5 overflow-hidden rounded-full font-medium transition-all duration-300 group shadow-[0_0_30px_rgba(255,255,255,0.12)] hover:shadow-[0_0_45px_rgba(255,255,255,0.25)] cursor-pointer"
      >
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
        />
        <span className="relative px-7 py-3 bg-neutral-950 rounded-full group-hover:bg-neutral-900 transition-colors duration-300 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
          <span className="text-xs sm:text-sm font-bold tracking-wide text-white group-hover:text-cyan-300 transition-colors">
            Deploy Architecture
          </span>
          <span className="font-mono text-xs text-neutral-400 group-hover:text-white">
            &rarr;
          </span>
        </span>
      </motion.button>
    </div>
  );
}

// --- Actual Component 5: Futuristic Terminal Box (from database) ---
function ActualFuturisticTerminal() {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const commands = ["deploy --prod", "build --watch", "init veltrix"];

  return (
    <div className="flex flex-col items-center justify-center w-full py-2">
      <div className="w-full relative group">
        <div
          className={`absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-neutral-700 rounded-2xl blur-md transition-opacity duration-500 ${
            focused ? "opacity-100" : "opacity-30 group-hover:opacity-60"
          }`}
        />
        <div className="relative bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 sm:p-4 shadow-2xl">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-neutral-900 text-xs font-mono text-neutral-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-1 text-neutral-400 font-bold text-[11px]">
                bash - veltrix-core
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>ONLINE</span>
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-emerald-400 font-mono font-extrabold mr-2 text-sm">&gt;_</span>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Type command..."
              className="w-full bg-transparent text-white placeholder:text-neutral-600 font-mono text-xs focus:outline-none"
            />
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-1.5 h-4 bg-cyan-400 ml-1"
            />
          </div>

          <div className="mt-3 pt-2 border-t border-neutral-900/60 flex flex-wrap gap-1.5">
            <span className="text-[10px] font-mono text-neutral-500 self-center mr-1">
              RUN:
            </span>
            {commands.map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setValue(cmd);
                }}
                className="text-[10px] font-mono bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 px-2 py-0.5 rounded transition-colors cursor-pointer"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main BentoShowcase Container with Direct Links ---
function BentoShowcase() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <div className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 mb-2">
          Interactive Component Showcase
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Live Interactive Components
        </h2>
        <p className="mt-3 text-neutral-400 max-w-xl mx-auto text-sm sm:text-base">
          Interact with actual components from the library below. Click any card to inspect full code.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {/* Cell 1: Actual Glare 3D Card */}
        <div
          onClick={() => navigate("/components/glare-hover-3d-card")}
          className="group cursor-pointer bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-500 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-indigo-400 bg-indigo-950/50 border border-indigo-800/40 rounded-full">
              3D Card
            </span>
            <span className="text-xs text-neutral-500 group-hover:text-white transition-colors font-mono">
              Explore ↗
            </span>
          </div>
          <div className="my-auto py-2">
            <ActualGlareCard />
          </div>
          <div className="pt-3 border-t border-neutral-900">
            <h3 className="font-bold text-sm text-white group-hover:text-neutral-200">
              Glare Hover 3D Card
            </h3>
            <p className="text-neutral-500 text-xs mt-0.5">
              Move mouse over card to test tilt and specular glare reflection.
            </p>
          </div>
        </div>

        {/* Cell 2: Actual Magnetic Button */}
        <div
          onClick={() => navigate("/components/magnetic-hover-button")}
          className="group cursor-pointer bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-500 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 rounded-full">
              Spring Physics
            </span>
            <span className="text-xs text-neutral-500 group-hover:text-white transition-colors font-mono">
              Explore ↗
            </span>
          </div>
          <div className="my-auto py-4">
            <ActualMagneticButton />
          </div>
          <div className="pt-3 border-t border-neutral-900">
            <h3 className="font-bold text-sm text-white group-hover:text-neutral-200">
              Magnetic Hover Button
            </h3>
            <p className="text-neutral-500 text-xs mt-0.5">
              Cursor attraction with spring damping and zero-jitter physics.
            </p>
          </div>
        </div>

        {/* Cell 3: Actual Metallic Shimmer Action Button */}
        <div
          onClick={() =>
            navigate("/components/futuristic-shimmer-metallic-action-button")
          }
          className="group cursor-pointer bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-500 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 rounded-full">
              Sheen Border
            </span>
            <span className="text-xs text-neutral-500 group-hover:text-white transition-colors font-mono">
              Explore ↗
            </span>
          </div>
          <div className="my-auto py-4">
            <ActualShimmerButton />
          </div>
          <div className="pt-3 border-t border-neutral-900">
            <h3 className="font-bold text-sm text-white group-hover:text-neutral-200">
              Futuristic Shimmer Metallic Action
            </h3>
            <p className="text-neutral-500 text-xs mt-0.5">
              Continuous rotating sheen gradient border with hover glow.
            </p>
          </div>
        </div>

        {/* Cell 4: Actual Apple-Style Morphing Dock (Span 2 on lg) */}
        <div
          onClick={() => navigate("/components/apple-style-morphing-dock")}
          className="md:col-span-2 lg:col-span-2 group cursor-pointer bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-500 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 rounded-full">
              Navigation Dock
            </span>
            <span className="text-xs text-neutral-500 group-hover:text-white transition-colors font-mono">
              Explore ↗
            </span>
          </div>
          <div className="my-auto py-3">
            <ActualMorphingDock />
          </div>
          <div className="pt-3 border-t border-neutral-900">
            <h3 className="font-bold text-sm text-white group-hover:text-neutral-200">
              Apple-Style Morphing Dock
            </h3>
            <p className="text-neutral-500 text-xs mt-0.5">
              Fluid icon magnification and parabolic neighbor scaling.
            </p>
          </div>
        </div>

        {/* Cell 5: Actual Futuristic Terminal Box */}
        <div
          onClick={() => navigate("/components/futuristic-terminal-box")}
          className="md:col-span-1 lg:col-span-1 group cursor-pointer bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-500 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 rounded-full">
              Terminal
            </span>
            <span className="text-xs text-neutral-500 group-hover:text-white transition-colors font-mono">
              Explore ↗
            </span>
          </div>
          <div className="my-auto py-2">
            <ActualFuturisticTerminal />
          </div>
          <div className="pt-3 border-t border-neutral-900">
            <h3 className="font-bold text-sm text-white group-hover:text-neutral-200">
              Futuristic Terminal Box
            </h3>
            <p className="text-neutral-500 text-xs mt-0.5">
              Interactive terminal input, blinking prompt, and quick-run chips.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BentoShowcase;
