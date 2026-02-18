import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CardComponent from "../components/CardComponent";
import { PreviewRegistry } from "../data/PreviewRegistry";
import { Components } from "../data/Components";
function HomePage() {
  const navigate = useNavigate("");

  const featuredComponents = Components.filter((item) => item.featured);
  return (
    <div
      className="min-h-screen w-full bg-black"
      style={{
        // backgroundImage:
        //   "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        // backgroundSize: "26px 26px",
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)",
        backgroundSize: "26px 26px",
      }}
    >
      <motion.div
        initial={{
          scale: 0.95,
        }}
        animate={{
          scale: 1,
        }}
        transition={{
          duration: 0.2,
          ease: "easeIn",
        }}
        className="font-bold text-6xl  tracking-tight  drop-shadow-[1px_3px_1px_rgba(255,255,255,0.5)] text-white p-5 pt-15 flex justify-center"
      >
        Build Faster with Reusable UI Components
      </motion.div>
      <div className="flex justify-center mt-7">
        <p className="p-4 text-lg text-center text-neutral-400 ">
          A curated library of animated, production-ready React components with
          live previews and copy-ready code.
        </p>
      </div>
      <div className="flex relative justify-center mt-13 group">
        <div className="border rounded-2xl  cursor-pointer hover:border-dashed">
        <motion.button 
        initial={{
          scale:1,
        }}
          whileTap={{
            scale: 0.8,
          }}
          transition={{
            type:"spring",
            stiffness:400,
            damping:17,
          }}
          onClick={() => navigate("/components")}
          className="px-4 cursor-pointer hover:translate-x-4 hover:-translate-y-4 py-3 bg-gradient-to-r from-neutral-950 via-zinc-800 to-neutral-600 text-white transition duration-400 rounded-2xl border border-neutral-500 text-lg font-bold tracking-tight"
        >
          Explore Components
        </motion.button>
        </div>
      </div>
      <div className="w-full h-px bg-neutral-300 my-25"></div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="flex justify-center font-bold text-4xl underline underline-offset-12 mb-20 decoration-neutral-600 text-neutral-300"
      >
        What You Get
      </motion.div>

      <div className="flex justify-center mt-10 gap-25 flex-wrap">
        <div className="h-60 w-60 bg-neutral-800 cursor-pointer hover:border-white hover:border-2 border border-neutral-600 rounded-md p-6 bg-gradient-to-b from-neutral-600 via-neutral-800 to-black hover:shadow-[2px_4px_48px_rgba(230,230,230,0.1)]">
          <h1 className="font-bold tracking-tight text-xl text-center">
            ⚡ Live Previews
          </h1>
          <div className="w-full mt-5 h-px bg-neutral-500"></div>
          <p className="max-w-full text-lg font-bold text-neutral-400 text-center mt-7">
            See components in action before using them.
          </p>
        </div>

        <div className="h-60 w-60 bg-neutral-800 cursor-pointer hover:border-white hover:border-2 border border-neutral-600 rounded-md p-6 bg-gradient-to-b from-neutral-600 via-neutral-800 to-black hover:shadow-[2px_4px_48px_rgba(230,230,230,0.1)]">
          <h1 className="font-bold tracking-tight text-lg text-center">
            📋 Copy-Ready Code
          </h1>
          <div className="w-full mt-5 h-px bg-neutral-500"></div>
          <p className="max-w-full text-lg font-bold text-neutral-400 text-center mt-7">
            One click to copy clean React + Tailwind code.
          </p>
        </div>

        <div className="h-60 w-60 bg-neutral-800 cursor-pointer hover:border-white hover:border-2 border border-neutral-600 rounded-md p-6 bg-gradient-to-b from-neutral-600 via-neutral-800 to-black hover:shadow-[2px_4px_48px_rgba(230,230,230,0.1)]">
          <h1 className="font-bold tracking-tight text-xl text-center">
            🎯 Search & Tags
          </h1>
          <div className="w-full mt-5 h-px bg-neutral-500"></div>
          <p className="max-w-full text-lg font-bold text-neutral-400 text-center mt-7">
            Find components instantly.
          </p>
        </div>

        <div className="h-60 w-60 bg-neutral-800 cursor-pointer hover:border-white hover:border-2 border border-neutral-600 rounded-md p-6 bg-gradient-to-b from-neutral-600 via-neutral-800 to-black hover:shadow-[2px_4px_48px_rgba(230,230,230,0.1)]">
          <h1 className="font-bold tracking-tight text-xl text-center">
            ✨ Motion-Ready
          </h1>
          <div className="w-full mt-5 h-px bg-neutral-500"></div>
          <p className="max-w-full text-lg font-bold text-neutral-400 text-center mt-7">
            Built with Framer Motion for smooth animations.
          </p>
        </div>
      </div>

      <div className="w-full h-px bg-neutral-300 my-25"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="flex justify-center font-bold text-4xl underline underline-offset-12 mb-20 decoration-neutral-600 text-neutral-300"
      >
        Popular Components
      </motion.div>

      <div className="mt-10 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15 max-w-6xl">
          {featuredComponents.map((item) => (
            <div key={item.slug}>
              <CardComponent
                key={item.slug}
                name={item.name}
                slug={item.slug}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
