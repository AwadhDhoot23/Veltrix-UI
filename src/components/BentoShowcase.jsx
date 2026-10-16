import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Sparkles,
  Home,
  Search,
  Bell,
  User,
  Settings,
} from "lucide-react";

// ============================================================================
// 1. COMPONENT: Lumen Auth (Full Split-Screen Layout - BIG)
// ============================================================================
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.91a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08 0 3.68-2.92 3.68-7.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.97 10.97 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function GithubIconSmall() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0 text-white">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function ActualLumenAuthFull() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("Veltrix@2026");
  const [email, setEmail] = useState("developer@veltrix.dev");
  const [rememberMe, setRememberMe] = useState(true);

  const strength =
    password.length === 0
      ? 0
      : Math.min(
          4,
          [
            password.length >= 8,
            /[A-Z]/.test(password),
            /[0-9]/.test(password),
            /[^A-Za-z0-9]/.test(password),
          ].filter(Boolean).length
        );

  const strengthLabels = ["Empty", "Weak", "Moderate", "Good", "Strong"];
  const strengthColors = [
    "bg-neutral-700",
    "bg-rose-500",
    "bg-amber-400",
    "bg-sky-400",
    "bg-emerald-400",
  ];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="relative w-full rounded-2xl bg-[#0a0b0b] border border-neutral-800 overflow-hidden shadow-2xl"
    >
      {/* Background Animated Gradient Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -25, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-indigo-500/[0.08] blur-[80px]"
        />
        <motion.div
          animate={{ x: [0, -35, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-16 -right-10 h-80 w-80 rounded-full bg-emerald-500/[0.06] blur-[90px]"
        />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
        {/* Left Branding Showcase Panel */}
        <div className="hidden lg:flex flex-col justify-between p-8 sm:p-10 border-r border-neutral-900 bg-neutral-950/40">
          <div>
            <div className="flex items-center gap-2.5 mb-8">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                <Sparkles className="h-5 w-5 text-indigo-300" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">Veltrix UI</span>
            </div>

            <h3 className="text-3xl font-extrabold text-white leading-tight tracking-tight mb-3">
              Where great interfaces <span className="text-neutral-500">come to life.</span>
            </h3>

            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6">
              Join 12,000+ designers and engineers building their most ambitious applications with production-grade animated components.
            </p>

            {/* Social Proof Avatars */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {["bg-indigo-600", "bg-purple-600", "bg-cyan-600", "bg-emerald-600"].map((bg, idx) => (
                  <div
                    key={idx}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-black text-[11px] font-bold text-white ${bg}`}
                  >
                    {["A", "M", "K", "R"][idx]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-white">Loved by builders</p>
                <p className="text-[10px] text-neutral-500 font-mono">4.9/5 from 2,300+ reviews</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-500 pt-8 border-t border-neutral-900/80">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>SOC 2 Type II certified · Zero runtime lock-in</span>
          </div>
        </div>

        {/* Right Interactive Form Panel (Allowing Full Interaction & Typing) */}
        <div className="p-6 sm:p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h4 className="text-2xl font-bold tracking-tight text-white mb-1">
              Welcome back
            </h4>
            <p className="text-xs text-neutral-400">
              Interactive live demo. Type below to test password strength analysis.
            </p>
          </div>

          {/* Social Auth Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 py-2.5 text-xs font-medium text-neutral-200 transition-colors cursor-pointer"
            >
              <GoogleIcon />
              <span>Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 py-2.5 text-xs font-medium text-neutral-200 transition-colors cursor-pointer"
            >
              <GithubIconSmall />
              <span>GitHub</span>
            </button>
          </div>

          <div className="my-3 flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-800" />
            <span className="text-[10px] uppercase font-mono text-neutral-500">or with email</span>
            <div className="h-px flex-1 bg-neutral-800" />
          </div>

          {/* Email field */}
          <div className="mb-3.5">
            <label className="block text-[11px] font-mono text-neutral-400 mb-1">Email</label>
            <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 focus-within:border-neutral-500 transition-colors">
              <Mail className="h-4 w-4 text-neutral-500 mr-2.5 shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-neutral-600 outline-none font-mono"
              />
            </div>
          </div>

          {/* Password field with Live Strength Calculation */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-mono text-neutral-400">Password</label>
              <span className="text-[10px] font-mono text-indigo-400">Live Analysis</span>
            </div>
            <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 focus-within:border-neutral-500 transition-colors">
              <Lock className="h-4 w-4 text-neutral-500 mr-2.5 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Type password..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-neutral-600 outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-neutral-500 hover:text-white transition-colors ml-2 cursor-pointer"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Dynamic Strength Meter */}
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex-1 flex gap-1.5">
                {[1, 2, 3, 4].map((lvl) => (
                  <div
                    key={lvl}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      lvl <= strength ? strengthColors[strength] : "bg-neutral-800"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] font-mono text-neutral-300 min-w-[55px] text-right font-medium">
                {strengthLabels[strength]}
              </span>
            </div>
          </div>

          {/* Remember me & Sign In */}
          <div className="flex items-center justify-between mb-4 text-xs">
            <label className="flex items-center gap-2 text-neutral-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded accent-white cursor-pointer"
              />
              <span>Remember 30 days</span>
            </label>
            <span className="text-neutral-500 hover:text-neutral-300 cursor-pointer">Forgot password?</span>
          </div>

          <button
            type="button"
            className="w-full py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs sm:text-sm font-bold tracking-tight transition-colors shadow-lg cursor-pointer"
          >
            Sign In to Workspace
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. COMPONENT: Animated Testimonial Carousel
// ============================================================================
const TESTIMONIALS = [
  {
    quote: "Veltrix UI completely transformed how we build interfaces. The components feel alive and the code quality is exceptional.",
    name: "Sarah Chen",
    role: "Lead Designer at Figma",
    av: "SC",
    color: "#818cf8",
  },
  {
    quote: "The attention to micro-interactions is unmatched. Our conversion rate went up 40% after switching to Veltrix UI components.",
    name: "Marcus Johnson",
    role: "CTO at Vercel",
    av: "MJ",
    color: "#34d399",
  },
  {
    quote: "I've tried every UI library out there. Veltrix is the only one that consistently wows both developers and clients.",
    name: "Priya Sharma",
    role: "Frontend Architect",
    av: "PS",
    color: "#f472b6",
  },
  {
    quote: "The live previews are incredible. Being able to see and copy production-ready code instantly is a real game-changer.",
    name: "Alex Rivera",
    role: "Product Engineer at Linear",
    av: "AR",
    color: "#fbbf24",
  },
];

function ActualTestimonialCarousel() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (next) => {
    setDir(next > i ? 1 : -1);
    setI(next);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setI((p) => (p + 1) % TESTIMONIALS.length);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  const current = TESTIMONIALS[i];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full flex flex-col justify-between py-2"
    >
      <div className="relative min-h-[140px] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={i}
            custom={dir}
            initial={{ opacity: 0, x: dir > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir > 0 ? -40 : 40 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full text-center px-2"
          >
            <div
              className="text-3xl font-black mb-1 select-none leading-none"
              style={{ color: current.color }}
            >
              "
            </div>
            <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed font-medium mb-4 line-clamp-3">
              {current.quote}
            </p>
            <div className="flex items-center justify-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${current.color}, ${current.color}88)`,
                }}
              >
                {current.av}
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-xs">{current.name}</p>
                <p className="text-neutral-500 text-[10px]">{current.role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-1.5 mt-4">
        {TESTIMONIALS.map((t, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => go(idx)}
            className="h-1 rounded-full transition-all duration-300 cursor-pointer"
            style={{
              width: idx === i ? 24 : 6,
              background: idx === i ? t.color : "#333",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 3. COMPONENT: Interactive Particle Field
// ============================================================================
function ActualParticleField() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const raf = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const setSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    setSize();

    const N = 120;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * (canvas.width || 300),
      y: Math.random() * (canvas.height || 200),
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 1.5 + 0.6,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const R = 90;

      for (let i = 0; i < N; i++) {
        const p = pts[i];
        const dx = p.x - mx;
        const dy = p.y - my;
        const d = Math.hypot(dx, dy);
        if (d < R && d > 0) {
          const f = ((R - d) / R) * 2.5;
          p.vx += (dx / d) * f * 0.08;
          p.vy += (dy / d) * f * 0.08;
        }
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(99, 102, 241, 0.75)";
        ctx.fill();

        for (let j = i + 1; j < N; j++) {
          const q = pts[j];
          const dd = Math.hypot(p.x - q.x, p.y - q.y);
          if (dd < 85) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(129, 140, 248, ${0.18 * (1 - dd / 85)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf.current = requestAnimationFrame(tick);
    };
    tick();

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => {
      mouse.current = { x: -9999, y: -9999 };
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", setSize);

    return () => {
      cancelAnimationFrame(raf.current);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative w-full h-52 sm:h-60 rounded-2xl bg-black border border-neutral-800/80 overflow-hidden cursor-crosshair"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4 text-center">
        <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-lg">
          Particle Physics Field
        </h4>
        <p className="text-neutral-400 text-xs mt-1.5 font-mono tracking-wide">
          Move cursor to repel particles · Auto-connects nearby nodes
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// 4. COMPONENT: Endless Scrolling Marquee
// ============================================================================
const CodeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const FigmaIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
    <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
    <path d="M12 9h3.5a3.5 3.5 0 1 1 0 7H12V9z" />
    <path d="M5 18.5A3.5 3.5 0 0 1 8.5 15H12v3.5a3.5 3.5 0 1 1-7 0z" />
    <path d="M5 12a3.5 3.5 0 0 1 3.5-3.5H12v7H8.5A3.5 3.5 0 0 1 5 12z" />
  </svg>
);

const GithubIconMarquee = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const FramerIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 16h7.5L19 23V16h5.5L12 2h-7v7h14l-7 7H5z" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const CpuIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="16" height="16" x="4" y="4" rx="2" />
    <rect width="6" height="6" x="9" y="9" rx="1" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
  </svg>
);

function ActualScrollingMarquee() {
  const icons = [CodeIcon, FigmaIcon, GithubIconMarquee, FramerIcon, TwitterIcon, CpuIcon];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
      }}
      className="w-full overflow-hidden py-3"
    >
      <div className="flex w-max gap-12 animate-marquee">
        {[...icons, ...icons, ...icons].map((Icon, idx) => (
          <div
            key={idx}
            className="flex items-center justify-center text-neutral-500 hover:text-white transition-colors duration-300"
          >
            <Icon className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marqueeScroll 18s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// 5. COMPONENT: Apple-Style Morphing Dock
// ============================================================================
function DockItem({ icon: Icon, mouseX }) {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-120, 0, 120], [38, 64, 38]);
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
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex items-center justify-center w-full py-2"
    >
      <div
        className="flex gap-3 sm:gap-4 p-3.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 items-end h-[85px]"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {icons.map((Icon, idx) => (
          <DockItem key={idx} icon={Icon} mouseX={mouseX} />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 6. COMPONENT: Futuristic Terminal Box (Fully Interactive Typing)
// ============================================================================
function ActualFuturisticTerminal() {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const commands = ["deploy --prod", "build --watch", "init veltrix"];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      className="flex flex-col items-center justify-center w-full py-2"
    >
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
              placeholder="Click to type command (try: deploy --prod)..."
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
                onClick={() => setValue(cmd)}
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

// ============================================================================
// MAIN BENTO SHOWCASE: Lumen Auth (Big), Particle Field, Terminal, Dock, Carousel, Marquee
// ============================================================================
function BentoShowcase() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <div className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 mb-2">
          Featured Library Showcase
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Signature Components
        </h2>
        <p className="mt-3 text-neutral-400 max-w-xl mx-auto text-sm sm:text-base">
          Interact with live production components directly in the sandbox below.
          Type into inputs and test interactions without disruption.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {/* 1. Lumen Auth (FULL WIDTH BIG CARD - Span 3 on lg) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 group bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-500 rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-indigo-400 bg-indigo-950/50 border border-indigo-800/40 rounded-full">
              Full-Scale Component · Authentication
            </span>
            <button
              onClick={() => navigate("/components/lumen-auth")}
              className="text-xs text-neutral-400 hover:text-white transition-colors font-mono flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-600 cursor-pointer"
            >
              <span>Explore Code</span>
              <span>↗</span>
            </button>
          </div>
          <div className="my-auto py-2">
            <ActualLumenAuthFull />
          </div>
          <div className="pt-4 border-t border-neutral-900 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-white">Lumen Auth</h3>
              <p className="text-neutral-500 text-xs mt-0.5">
                Split-screen sign-in with live password strength analysis, glowing orbs, and social provider integration.
              </p>
            </div>
            <button
              onClick={() => navigate("/components/lumen-auth")}
              className="text-xs font-mono text-indigo-400 hover:text-indigo-300 self-start sm:self-auto cursor-pointer"
            >
              View Full Source & Props &rarr;
            </button>
          </div>
        </div>

        {/* 2. Interactive Particle Field (Span 2 on lg) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 group bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-500 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-indigo-400 bg-indigo-950/50 border border-indigo-800/40 rounded-full">
              Physics & Canvas
            </span>
            <button
              onClick={() => navigate("/components/interactive-particle-field")}
              className="text-xs text-neutral-400 hover:text-white transition-colors font-mono flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-600 cursor-pointer"
            >
              <span>Explore</span>
              <span>↗</span>
            </button>
          </div>
          <div className="my-auto py-2">
            <ActualParticleField />
          </div>
          <div className="pt-3 border-t border-neutral-900 mt-3">
            <h3 className="font-bold text-sm text-white">Interactive Particle Field</h3>
            <p className="text-neutral-500 text-xs mt-0.5">
              Canvas-based particle system with dynamic distance clustering and cursor repulsion.
            </p>
          </div>
        </div>

        {/* 3. Futuristic Terminal Box (Span 1) */}
        <div className="col-span-1 group bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-500 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 rounded-full">
              CLI Terminal
            </span>
            <button
              onClick={() => navigate("/components/futuristic-terminal-box")}
              className="text-xs text-neutral-400 hover:text-white transition-colors font-mono flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-600 cursor-pointer"
            >
              <span>Explore</span>
              <span>↗</span>
            </button>
          </div>
          <div className="my-auto py-2">
            <ActualFuturisticTerminal />
          </div>
          <div className="pt-3 border-t border-neutral-900 mt-3">
            <h3 className="font-bold text-sm text-white">Futuristic Terminal Box</h3>
            <p className="text-neutral-500 text-xs mt-0.5">
              Developer command console with glowing focus halos and quick-run badges. Click to type freely.
            </p>
          </div>
        </div>

        {/* 4. Apple-Style Morphing Dock (Span 2 on lg) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 group bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-500 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/50 border border-cyan-800/40 rounded-full">
              macOS Dock
            </span>
            <button
              onClick={() => navigate("/components/apple-style-morphing-dock")}
              className="text-xs text-neutral-400 hover:text-white transition-colors font-mono flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-600 cursor-pointer"
            >
              <span>Explore</span>
              <span>↗</span>
            </button>
          </div>
          <div className="my-auto py-3">
            <ActualMorphingDock />
          </div>
          <div className="pt-3 border-t border-neutral-900 mt-3">
            <h3 className="font-bold text-sm text-white">Apple-Style Morphing Dock</h3>
            <p className="text-neutral-500 text-xs mt-0.5">
              Proximity-based icon magnification with organic spring damping physics.
            </p>
          </div>
        </div>

        {/* 5. Animated Testimonial Carousel (Span 1) */}
        <div className="col-span-1 group bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-500 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black">
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-pink-400 bg-pink-950/50 border border-pink-800/40 rounded-full">
              Social Proof
            </span>
            <button
              onClick={() => navigate("/components/animated-testimonial-carousel")}
              className="text-xs text-neutral-400 hover:text-white transition-colors font-mono flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-600 cursor-pointer"
            >
              <span>Explore</span>
              <span>↗</span>
            </button>
          </div>
          <div className="my-auto py-2">
            <ActualTestimonialCarousel />
          </div>
          <div className="pt-3 border-t border-neutral-900 mt-3">
            <h3 className="font-bold text-sm text-white">Animated Testimonial Carousel</h3>
            <p className="text-neutral-500 text-xs mt-0.5">
              Smooth slide transitions with AnimatePresence and auto-play indicators.
            </p>
          </div>
        </div>

        {/* 6. Endless Scrolling Marquee (Span 3 on lg - Full Width Card) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 group bg-neutral-950/80 border border-neutral-800/80 hover:border-neutral-500 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-black">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-neutral-400 bg-neutral-900 border border-neutral-800 rounded-full">
              Continuous Motion
            </span>
            <button
              onClick={() => navigate("/components/endless-scrolling-marquee")}
              className="text-xs text-neutral-400 hover:text-white transition-colors font-mono flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-600 cursor-pointer"
            >
              <span>Explore</span>
              <span>↗</span>
            </button>
          </div>
          <div className="my-auto py-4">
            <ActualScrollingMarquee />
          </div>
          <div className="pt-3 border-t border-neutral-900 mt-2">
            <h3 className="font-bold text-sm text-white">Endless Scrolling Marquee</h3>
            <p className="text-neutral-500 text-xs mt-0.5">
              Hardware-accelerated CSS marquee with smooth edge masking. Hover to pause.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BentoShowcase;
