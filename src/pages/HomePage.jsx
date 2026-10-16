import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
import { motion, useAnimate, stagger } from 'framer-motion';
import { useComponents } from "../context/ComponentsContext";
import CardComponent from "../components/CardComponent";
import BentoShowcase from "../components/BentoShowcase";

function HomePage() {
  const text = "Build Faster with Reusable UI Components";
  const navigate = useNavigate();
  const { components, loading } = useComponents();
  const [scope, animate] = useAnimate();

  useGSAP(() => {
    const tl = gsap.timeline();

    // Floating ambient background blobs (original animation)
    gsap.to(".background", {
      y: 400,
      repeat: -1,
      ease: "sine.inOut",
      duration: 12,
      yoyo: true,
    });

    // 3D Codeblock entrance
    gsap.from(".codeBlock", {
      x: 350,
      opacity: 0,
      scale: 1.4,
      ease: "power3.out",
      duration: 1.1,
    });

    // Description & CTA button entrance
    tl.from(".description", {
      x: -150,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    });

    tl.from(
      ".btn1",
      {
        y: 40,
        opacity: 0,
        duration: 0.5,
        ease: "power1.out",
      },
      "-=0.3"
    );

    // Infinite Marquee track
    gsap.to(".track", {
      xPercent: -50,
      duration: 28,
      repeat: -1,
      ease: "none",
    });

    // Workflow section cards entrance (GSAP ScrollTrigger)
    gsap.from(".workflowCard", {
      opacity: 0,
      y: 35,
      stagger: 0.15,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".workflowSection",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    // Popular components section entrance
    gsap.from(".popularHeader", {
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".popularSection",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    gsap.from(".componentCards", {
      y: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".componentSection",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  const startAnimating = () => {
    animate(
      "span",
      {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
      },
      {
        duration: 0.45,
        ease: 'easeInOut',
        delay: stagger(0.08),
      }
    );
  };

  useEffect(() => {
    startAnimating();
  }, [animate]);

  const featuredComponents = [...components]
    .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35 }}
      className="min-h-screen mb-10 relative w-full overflow-hidden bg-black text-white"
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
        backgroundSize: "26px 26px",
      }}
    >
      {/* Ambient Animated Gradient Blobs (Matching All Other Pages) */}
      <div className="absolute background top-[-10%] left-[-20%] h-[900px] w-[900px] bg-[radial-gradient(circle,rgba(67,56,202,0.19)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute background top-[-15%] left-55 h-[900px] w-[1050px] bg-[radial-gradient(circle,rgba(200,200,200,0.06)_0%,transparent_75%)] pointer-events-none" />
      <div className="absolute background top-[-10%] -right-100 h-[900px] w-[950px] bg-[radial-gradient(circle,rgba(207,81,254,0.12)_0%,transparent_65%)] pointer-events-none" />

      {/* Brand Wordmark (Strictly No Emojis) */}
      <h2
        onClick={() => navigate("/")}
        className="w-full px-5 absolute my-7 text-center font-extrabold text-4xl md:text-5xl tracking-tight text-white cursor-pointer z-20 hover:text-neutral-200 transition-colors"
      >
        Veltrix UI
      </h2>

      {/* --- HERO SECTION --- */}
      <div className="relative z-10 flex flex-col min-h-[90vh] md:h-screen md:flex-row items-center justify-between px-6 sm:px-10 max-w-7xl mx-auto pt-24 md:pt-0">
        {/* Left Column: Value Proposition */}
        <div className="w-full md:w-[58%] text-center md:text-left flex flex-col items-center md:items-start">
          <div
            ref={scope}
            className="flex-wrap font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white p-1 pt-6 md:pt-0 flex justify-center md:justify-start"
          >
            {text.split(" ").map((word, idx) => (
              <motion.span
                className="display:block flex flex-col"
                style={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
                key={word + idx}
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </div>

          <p className="p-1 mt-4 description max-w-xl text-base md:text-lg text-neutral-400 leading-relaxed text-center md:text-left">
            A curated library of animated, production-ready React components
            with live interactive sandboxes and copy-ready code.
          </p>

          <div className="flex flex-wrap items-center gap-4 btn1 mt-8">
            <button
              onClick={() => navigate("/components")}
              className="px-8 py-3.5 cursor-pointer bg-white text-black hover:bg-neutral-200 transition-all duration-300 rounded-xl text-sm font-semibold tracking-tight shadow-xl shadow-white/10 active:scale-95"
            >
              Explore Components
            </button>
            <button
              onClick={() => {
                const el = document.getElementById("bento-showcase");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3.5 cursor-pointer bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 text-neutral-300 hover:text-white transition-all duration-300 rounded-xl text-sm font-medium tracking-tight"
            >
              Live Showcase ↓
            </button>
          </div>
        </div>

        {/* Right Column: Signature 3D Code Window (EXACT ORIGINAL BROAD BORDERS & OFFSET SHADOW RESTORED) */}
        <div className="w-full md:w-[42%] md:pl-10 relative flex justify-center items-center mt-12 md:mt-0 mb-10 md:mb-0">
          <div
            className="relative codeBlock p-7 w-80 md:w-90 md:h-110 bg-black/40 border border-neutral-500 rounded-xl backdrop-blur-lg shadow-2xl scale-95 sm:scale-100 md:scale-100"
            style={{
              transformStyle: "preserve-3d",
              transform: "perspective(1000px) rotateY(-25deg) rotateX(10deg)",
              boxShadow: "5px 3px 1px 1px rgba(180, 200, 180, 0.5)",
            }}
          >
            {/* Fake Window Controls */}
            <div className="flex codeBlock animate-pulse gap-2 mb-8 md:mb-10 opacity-80">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>

            {/* Fake Code Lines (Skeleton Loader Style) */}
            <div className="space-y-3 codeBlock opacity-80">
              <div className="flex gap-2 mb-5">
                <span className="text-pink-500 font-mono text-sm">import</span>
                <span className="text-white font-mono text-sm">React</span>
              </div>
              <div className="flex gap-2">
                <span className="text-blue-400 font-mono text-sm">function</span>
                <span className="text-yellow-300 font-mono text-sm">App()</span>
                <span className="text-white font-mono text-sm">{`{`}</span>
              </div>

              {/* Indented lines */}
              <div className="pl-4 codeBlock space-y-2">
                <div className="h-2 w-3/4 bg-neutral-600 rounded animate-pulse"></div>
                <div className="h-2 w-1/2 bg-neutral-600 rounded animate-pulse delay-75"></div>
                <div className="h-2 w-4/6 bg-neutral-500 rounded animate-pulse delay-150"></div>
                <div className="h-2 w-5/6 bg-neutral-700 rounded animate-pulse delay-150"></div>
                <div className="h-2 w-2/6 bg-neutral-500 rounded animate-pulse delay-150"></div>
              </div>
              <div className="text-white font-mono text-sm">{`}`}</div>
              <div className="flex codeBlock gap-1.5">
                <div className="text-orange-400 text-sm font-mono">export default</div>
                <div className="text-sm text-violet-500 font-mono">App;</div>
              </div>
              <div
                style={{ transform: "translateZ(120px)" }}
                className="absolute font-bold flex gap-2 items-center -right-2 text-xs md:text-sm -bottom-20 md:-bottom-25 bg-black/60 border border-neutral-500 text-white rounded-2xl px-4 py-2 backdrop-blur-md shadow-xl"
              >
                <div className="h-2 w-2 rounded-full animate-pulse bg-blue-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>
                <span className="font-mono text-xs">Live Preview</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SEAMLESS INFINITE MARQUEE CAPABILITIES RIBBON --- */}
      <div
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        }}
        className="relative z-10 bg-neutral-950/60 w-full overflow-hidden border-y border-neutral-800/80 backdrop-blur-md py-4 my-12"
      >
        <div className="track flex w-max items-center">
          {/* HALF 1 */}
          <div className="flex gap-12 shrink-0 items-center justify-center px-6 text-neutral-300 font-mono text-xs md:text-sm tracking-wider">
            <span>Production-Ready React 19</span>
            <span className="text-neutral-600">✦</span>
            <span>Hardware Accelerated Animations</span>
            <span className="text-neutral-600">✦</span>
            <span>Zero Lock-in Tailwind CSS</span>
            <span className="text-neutral-600">✦</span>
            <span>Live Interactive Browser Sandboxes</span>
            <span className="text-neutral-600">✦</span>
            <span>Framer Motion & GSAP Physics</span>
            <span className="text-neutral-600">✦</span>
            <span>Mobile-First Responsive Systems</span>
            <span className="text-neutral-600 mr-6">✦</span>
          </div>

          {/* HALF 2 (Duplicate for 100% seamless infinite loop) */}
          <div className="flex gap-12 shrink-0 items-center justify-center px-6 text-neutral-300 font-mono text-xs md:text-sm tracking-wider">
            <span>Production-Ready React 19</span>
            <span className="text-neutral-600">✦</span>
            <span>Hardware Accelerated Animations</span>
            <span className="text-neutral-600">✦</span>
            <span>Zero Lock-in Tailwind CSS</span>
            <span className="text-neutral-600">✦</span>
            <span>Live Interactive Browser Sandboxes</span>
            <span className="text-neutral-600">✦</span>
            <span>Framer Motion & GSAP Physics</span>
            <span className="text-neutral-600">✦</span>
            <span>Mobile-First Responsive Systems</span>
            <span className="text-neutral-600 mr-6">✦</span>
          </div>
        </div>
      </div>

      {/* --- SECTION: INTERACTIVE LIVING BENTO SHOWCASE (ACTUAL DATABASE COMPONENTS) --- */}
      <div id="bento-showcase" className="relative z-10">
        <BentoShowcase />
      </div>

      {/* --- SECTION: GSAP SCROLL-TRIGGERED WORKFLOW --- */}
      <div className="workflowSection relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-neutral-900">
        <div className="text-center mb-14">
          <div className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 mb-2">
            Engineering Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Motion Precision
          </h2>
          <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
            Three principles that ensure components drop into your codebase without
            bloat, lag, or breaking dependencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="workflowCard bg-neutral-950/70 border border-neutral-800/80 rounded-2xl p-6 relative flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-indigo-400 mb-3 tracking-widest">
                // 01 ARCHITECTURE
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Live Interactive Sandboxes
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                Test responsiveness, gestures, and physics live in the browser
                before taking a single line of code.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-900 text-[11px] font-mono text-neutral-500">
              Zero Build Overhead
            </div>
          </div>

          {/* Card 2 */}
          <div className="workflowCard bg-neutral-950/70 border border-neutral-800/80 rounded-2xl p-6 relative flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-cyan-400 mb-3 tracking-widest">
                // 02 FREEDOM
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Clean Copy & Paste
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                No proprietary runtime or opaque npm dependencies. Pure React
                components with transparent Tailwind utility styling.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-900 text-[11px] font-mono text-neutral-500">
              100% Extensible
            </div>
          </div>

          {/* Card 3 */}
          <div className="workflowCard bg-neutral-950/70 border border-neutral-800/80 rounded-2xl p-6 relative flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-emerald-400 mb-3 tracking-widest">
                // 03 PERFORMANCE
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                60fps Hardware Physics
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                Engineered with GPU transform and opacity layers to eliminate
                cumulative layout shift and jank across devices.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-900 text-[11px] font-mono text-neutral-500">
              OLED Dark Optimized
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION: POPULAR COMPONENTS --- */}
      <div className="popularSection relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="popularHeader flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-neutral-900">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Popular Components
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">
              Most explored components by the developer community.
            </p>
          </div>
          <button
            onClick={() => navigate("/components")}
            className="text-xs font-mono text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Explore All Components</span>
            <span className="text-[11px]">↗</span>
          </button>
        </div>

        <div className="componentSection flex justify-center overflow-visible">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-16 text-neutral-500">
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="inline-block w-1.5 h-1.5 rounded-full bg-neutral-500"
                    style={{
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
              <span className="text-xs tracking-[0.25em] uppercase font-medium">
                Fetching components…
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-start overflow-visible pt-2">
              {featuredComponents.map((item) => (
                <div key={item.slug} className="componentCard col-span-1">
                  <CardComponent
                    name={item.name}
                    description={item.description}
                    slug={item.slug}
                    id={item._id}
                    viewsCount={item.viewsCount}
                    createdAt={item.createdAt}
                    tags={item.tags}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default HomePage;
