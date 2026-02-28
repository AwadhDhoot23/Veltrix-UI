import React, { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
import { useNavigate } from "react-router-dom";
import CardComponent from "../components/CardComponent";
import { PreviewRegistry } from "../data/PreviewRegistry";
import { Components } from "../data/Components";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion, useAnimate, stagger } from 'framer-motion'
function HomePage() {
  useGSAP(() => {
    const tl = gsap.timeline();
    gsap.to(".background", {
      y: 400,
      repeat: -1,
      ease: "sine.inOut",
      duration: 12,
      yoyo: true,
    });
    gsap.from(".codeBlock", {
      x: 400,
      opacity: 0,
      scale: 1.6,
      ease: "power3.inOut",
      duration: 1.2,
      stagger: 0.1,
    });
    tl.from(".description", {
      x: -400,
      opacity: 0,
      duration: 0.7,
    });
    tl.from(
      ".btn1",
      {
        x: 200,
        y: 100,
        opacity: 0,
        duration: 0.7,
        ease: "power1.out",
      },
      "-=0.7",
    );


    gsap.from(".popular", {
      opacity: 0,
      x: -200,
      duration: 0.5,
      scrollTrigger: {
        trigger: ".popular",
        start: "top 95%",
        end: "bottom 70%",
        scrub: true,
      },
    });
    gsap.from(".componentCards", {
      x: 100,
      opacity: 0,
      stagger: 0.15,
      ease: "back.inOut",
      scrollTrigger: {
        trigger: ".componentSection",
        start: "top 90%",
        end: "bottom 80%",
        scrub: true,
      },
    });
    gsap.to(".track", {
      xPercent: -40,
      duration: 15,
      repeat: -1,
      ease: "linear",

    });
  }, []);
  const text = "Build Faster with Reusable UI Components";
  const navigate = useNavigate();
  const [scope, animate] = useAnimate();
  useEffect(() => {
    startAnimating();
  }, [])
  const startAnimating = () => {
    animate("span", {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
    },
      {
        duration: 0.5,
        ease: 'easeInOut',
        delay: stagger(0.1)
      }
    );
  }

  const featuredComponents = Components.filter((item) => item.featured);
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -10,
      }}
      transition={{
        duration: 0.4,
      }}
      className="min-h-screen relative w-full overflow-hidden  bg-black"
      style={{
        // backgroundImage:
        //   "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        // backgroundSize: "26px 26px",
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
        backgroundSize: "26px 26px",
      }}
    >

      <div className="absolute top-9 w-full head md:mb-0 bg-clip-text text-transparent bg-gradient-to-r from-neutral-500 animate-pulse to-neutral-100 text-center p-4 font-bold text-4xl z-1">Veltrix-UI</div>
      <div className="absolute background top-[-10%] left-[-20%] h-[900px] w-[900px] bg-[radial-gradient(circle,rgba(67,56,202,0.19)_0%,transparent_65%)] pointer-events-none "></div>
      <div className="absolute background top-[-15%] left-55 h-[900px] w-[1050px] bg-[radial-gradient(circle,rgba(200,200,200,0.06)_0%,transparent_75%)] pointer-events-none "></div>
      <div className="absolute background top-[-10%] -right-100 h-[900px] w-[950px] bg-[radial-gradient(circle,rgba(207,81,254,0.12)_0%,transparent_65%)] pointer-events-none"></div>


      {/* Hero Section */}
      <div className="flex flex-col h-screen md:flex-row items-center justify-between px-6">
        <div className="md:w-[60%] text-center">
          <div ref={scope} className=" mt-15 md:mt-0 flex-wrap font-bold text-6xl drop-shadow-5xl overflow-hidden tracking-tight text-white text-center p-5 pt-15 flex justify-center">
            {text.split(" ").map((word, idx) => <motion.span className="display:block flex flex-col max-w-5xl" style={{ opacity: 0, filter: 'blur(8px)', y: 10 }} key={word + idx}>{word} &nbsp;</motion.span>)}
          </div>
          <div className="flex justify-center">
            <p className="p-4 description max-w-xl text-lg text-center text-neutral-400 ">
              A curated library of animated, production-ready React components
              with live previews and copy-ready code.
            </p>
          </div>
          <div className="flex relative btn1 justify-center mt-13 group">
            <div className="border rounded-2xl cursor-pointer hover:border-dashed">
              <button
                onClick={() => navigate("/components")}
                className="px-4 cursor-pointer hover:translate-x-4 hover:-translate-y-4 py-3 bg-gradient-to-r from-neutral-950 via-zinc-800 to-neutral-600 text-white transition duration-400 rounded-2xl border border-neutral-500 text-lg font-bold tracking-tight"
              >
                Explore Components
              </button>
            </div>
          </div>
        </div>
        <div className="md:w-[40%] md:pl-20 relative justify-center items-center mt-15">
          <div
            className="relative codeBlock p-7 w-60 md:w-90 md:h-100 bg-black/40 border border-neutral-500 rounded-xl backdrop-blur-lg shadow-2xl"
            style={{
              transformStyle: "preserve-3d",
              transform: "perspective(1000px) rotateY(-25deg) rotateX(10deg)", // The 3D Tilt
              boxShadow: "5px 3px 1px 1px rgba(180, 200, 180, 0.5)",
            }}
          >
            {/* Fake Window Controls */}
            <div className="flex codeBlock animate-pulse  gap-2 mb-6 opacity-80">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>

            {/* Fake Code Lines (Skeleton Loader Style) */}
            <div className="space-y-3 codeBlock opacity-80">
              <div className="flex gap-2">
                <span className="text-pink-500 font-mono text-sm">import</span>
                <span className="text-white font-mono text-sm">React</span>
              </div>
              <div className="flex gap-2">
                <span className="text-blue-400 font-mono text-sm">
                  function
                </span>
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
                <div className="text-orange-400 text-sm">export default</div>
                <div className="text-sm text-violet-500">App ;</div>
              </div>
              <div
                style={{ transform: "translateZ(120px)" }}
                className="absolute font-bold flex gap-2 items-center -right-2 text-xs md:text-sm -bottom-22 bg-black/60 border border-neutral-500 text-white rounded-2xl px-4 py-2 backdrop-blur-md"
              >
                <div className="h-2 w-2 rounded-full animate-pulse bg-blue-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>
                <span>Live Preview</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section Ends */}
      <div
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 25%, black 85%, transparent)'
        }}
        className="relative bg-neutral-700/5 md:t-0 md:mt-0 mt-57 w-full overflow-hidden border-y border-neutral-600 backdrop-blur-md py-5  mb-30">
        {/* w-max is important so the track sizes itself to the content */}
        <div className="track flex w-max h-15">
          {/* HALF 1 */}
          <div className="flex gap-16 shrink-0 items-center justify-center px-8 text-neutral-400 uppercase tracking-widest font-bold">
            <span>Live Preview</span>
            <span className="text-xl">✦</span>
            <span>Direct Copy & Paste</span>
            <span className="text-xl">✦</span>
            <span>Instant Search Option</span>
            <span className=" text-xl">✦</span>
            <span>Animation Rich UI</span>
            <span className=" text-xl">✦</span>
          </div>

          {/* HALF 2 (Exact Duplicate of Half 1) */}
          <div className="flex gap-16 shrink-0 items-center justify-center px-8 text-neutral-400 uppercase tracking-widest font-bold">
            <span>Live Preview</span>
            <span className="text-xl">✦</span>
            <span>Direct Copy & Paste</span>
            <span className="text-xl">✦</span>
            <span>Instant Search Option</span>
            <span className=" text-xl">✦</span>
            <span>Animation Rich UI</span>
            <span className=" text-xl">✦</span>
          </div>
        </div>
      </div>
      <div className="flex text-2xl justify-center font-bold md:text-4xl popular underline underline-offset-12 mb-20 decoration-neutral-600 text-neutral-300">
        Popular Components
      </div>

      <div className="mt-10 componentSection flex justify-center">
        <div className="grid mb-18 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15 max-w-6xl">
          {featuredComponents.map((item) => (
            <div key={item.slug} className="componentCards">
              <CardComponent
                key={item.slug}
                name={item.name}
                slug={item.slug}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default HomePage;
