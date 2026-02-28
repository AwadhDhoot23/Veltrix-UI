import React, { useState } from "react";
import { Components, FilterTags } from "../data/Components";
import CardComponent from "../components/CardComponent";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../components/Sidebar";
import ClearIcon from "@mui/icons-material/Clear";
import CancelIcon from "@mui/icons-material/Cancel";
import { motion } from "framer-motion";

import { useNavigate } from "react-router-dom";
import MobileSideBar from "../components/MobileSideBar";

function ComponentsPage() {
  useGSAP(() => {
    gsap.from(".componentCard", {
      y: 100,
      stagger: 0.2,
      opacity: 0,
      ease: "linear",
      scrollTrigger: {
        trigger: ".gridBox",
        start: "top 85%",
      },
    });
  });
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const filterComponents = Components.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLocaleLowerCase().includes(query.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(query.toLocaleLowerCase()),
      ),
  );
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -20,
      }}
      transition={{
        duration: 0.4,
      }}
    >
      <div className="  flex flex-col min-h-full relative md:pl-80">
        <div className="hidden md:block ">
          <Sidebar />
        </div>
        <div className=" asbolute md:hidden h-full z-2 w-full">
          <MobileSideBar />
        </div>

        <div className="relative gap-5 md:flex  md:flex-row mt-5 ml-5">
          <SearchIcon className="relative left-8 top-0.5 md:top-3 md:left-14 pb-1" />
          <input
            className="bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-500 text-white px-9 w-55 md:w-60 lg:w-150 rounded-full h-10 border border-neutral-600"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="  Search.."
          />

          <ClearIcon
            onClick={() => setQuery("")}
            className="absolute left-53 top-2  md:left-58 lg:left-152 md:top-2 cursor-pointer "
          />
        </div>
        <div className="relative flex mt-8 flex-wrap pl-5 items-center gap-3 font-bold">
          {FilterTags.map((tag) => {
            const isActive =
              query.toLowerCase() === tag.toLowerCase() ||
              (query === "" && tag === "All");

            return (
              <div
                key={tag}
                onClick={() => setQuery(tag === "All" ? "" : tag)}
                className={`text-xs cursor-pointer px-4 py-2 rounded-xl border transition-all duration-300 capitalize ${isActive
                    ? "bg-white text-black border-white "
                    : "bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-600 text-neutral-300/80 border-neutral-500 hover:text-white hover:border-neutral-200"
                  }`}
              >
                {tag}
              </div>
            );
          })}
        </div>

        {filterComponents.length === 0 && (
          <div className="absolute left-50 text-xs md:text-xl top-[10%] text-[14px] mt-10 md:top-30 md:left-170 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-300">
            <CancelIcon className="absolute mt-8 top-1 text-red-500" />
            <pre className="absolute text-center">
              No Components found! Try tweeking the search
            </pre>
          </div>
        )}
        <div className="overflow-y-hidden pl-6 grid gridBox grid-cols-1 md:grid-cols-1 lg:grid-cols-2 pb-10 xl:grid-cols-3 flex-1 overflow-y-auto min-h-screen gap:20"
        >
          {filterComponents.map((item) => (
            <div key={item.slug} className="componentCard ">
              <CardComponent

                name={item.name}
                description={item.description}
                slug={item.slug}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default ComponentsPage;
