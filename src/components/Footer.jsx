import React from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import { SOCIAL_LINKS } from "../utils/constants";
function Footer() {
  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "74px 74px",
      }}
      className="relative h-fit overflow-hidden w-full "
    >
      <div className="w-full h-px bg-white "></div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="w-full px-5 my-3 font-extrabold text-4xl md:text-5xl tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Veltrix<span className="text-cyan-400">UI</span>
          </h2>
          <p className="pl-5 text-lg text-neutral-500">
            A curated library of reusable React UI components.
          </p>
        </div>
        <div>
          <a
            href={SOCIAL_LINKS.GITHUB}
            target="_blank"
            className=" hover:scale-115 transition duration-200 text-neutral-500 hover:text-neutral-200 pr-5 py-5 flex gap-2"
          >
            <GitHubIcon />
            Github
          </a>
          <a
            href={SOCIAL_LINKS.INSTAGRAM}
            target="_blank"
            className="pr-5 hover:scale-110 text-neutral-500 hover:text-neutral-200 transition duration-200  flex gap-2"
          >
            <InstagramIcon />
            Instagram
          </a>
        </div>
      </div>
      <div className="flex justify-center text-[12.8px] md:text-[16px] items-center p-4 mt-10 font-bold text-neutral-600">
        © 2026 Awadh. Built with React, Tailwind, Framer and GSAP.
      </div>
    </div>
  );
}

export default Footer;
