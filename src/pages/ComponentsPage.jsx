import React, { useState } from "react";
import { FilterTags } from "../data/Components";
import { useComponents } from "../context/ComponentsContext";
import CardComponent from "../components/CardComponent";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../components/Sidebar";
import ClearIcon from "@mui/icons-material/Clear";
import CancelIcon from "@mui/icons-material/Cancel";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const { components, loading } = useComponents();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  React.useEffect(() => {
    if (user) {
      api.get('/favorites').then(res => setFavorites(res.data.map(f => f._id))).catch(console.error);
    }
  }, [user]);

  const filterComponents = components.filter((item) => {
    // 1. Tag filter logic
    if (activeTag === "Favorites") {
      if (!favorites.includes(item._id)) return false;
    } else if (activeTag !== "All") {
      if (!item.tags.some(tag => tag.toLowerCase() === activeTag.toLowerCase())) return false;
    }
    
    // 2. Text search logic
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = item.name.toLowerCase().includes(q);
      const matchesDesc = item.description.toLowerCase().includes(q);
      if (!matchesName && !matchesDesc) return false;
    }

    return true;
  });

  const displayTags = user ? ["Favorites", ...FilterTags] : FilterTags;
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

        <div className="relative mt-5 ml-5 w-[220px] md:w-[240px] lg:w-[600px] shadow-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="text-neutral-400" fontSize="small" />
          </div>
          <input
            className="w-full bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-500 text-white pl-10 pr-10 py-2 rounded-full border border-neutral-600 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-400 shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search components..."
          />
          {searchQuery && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <ClearIcon
                onClick={() => setSearchQuery("")}
                className="text-neutral-400 hover:text-white cursor-pointer"
                fontSize="small"
              />
            </div>
          )}
        </div>
        <div className="relative flex mt-8 flex-wrap pl-5 items-center gap-3 font-bold">
          {displayTags.map((tag) => {
            const isActive = activeTag === tag;

            return (
              <div
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`text-xs cursor-pointer px-4 py-2 rounded-xl border transition-all duration-300 capitalize flex items-center gap-1 ${isActive
                    ? "bg-white text-black border-white "
                    : (tag === "Favorites" ? "bg-red-950/40 text-red-400 border-red-900/50 hover:bg-red-900/60 hover:text-red-200" : "bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-600 text-neutral-300/80 border-neutral-500 hover:text-white hover:border-neutral-200")
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
        <div className="overflow-y-hidden pl-6 grid gridBox grid-cols-1 md:grid-cols-1 lg:grid-cols-2 pb-10 xl:grid-cols-3 flex-1 overflow-y-auto min-h-screen gap-10"
        >
          {filterComponents.map((item) => (
            <div key={item.slug} className="componentCard ">
              <CardComponent
                name={item.name}
                description={item.description}
                slug={item.slug}
                code={item.code}
                id={item._id}
                author={item.author}
                isFavorited={favorites.includes(item._id)}
                onFavoriteToggle={(id, adding) => {
                  if (adding) {
                    setFavorites([...favorites, id]);
                  } else {
                    setFavorites(favorites.filter(favId => favId !== id));
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default ComponentsPage;
