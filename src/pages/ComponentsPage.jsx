import React, { useState, useMemo } from "react";
import { getPreviewLayoutConfig } from "../utils/livePreviewHelpers";
import { FilterTags } from "../data/Components";
import { useComponents } from "../context/ComponentsContext";
import CardComponent from "../components/CardComponent";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../components/Sidebar";
import ClearIcon from "@mui/icons-material/Clear";
import CancelIcon from "@mui/icons-material/Cancel";
import { motion } from "framer-motion";
import MobileSideBar from "../components/MobileSideBar";
import SortIcon from "@mui/icons-material/Sort";
import FavoriteIcon from "@mui/icons-material/Favorite";

const FAVORITES_KEY = 'veltrix_favorites';
function getFavorites() {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []; }
  catch { return []; }
}

function ComponentsPage() {
  useGSAP(() => {
    gsap.from(".componentCard", {
      y: 100,
      stagger: 0.2,
      opacity: 0,
      ease: "linear",
    });
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const { components, loading } = useComponents();

  const favorites = getFavorites();

  const filterComponents = useMemo(() => {
    let result = [...components];

    // 1. Tag / Favorites filter
    if (activeTag === "Favorites") {
      result = result.filter(item => favorites.includes(item.slug));
    } else if (activeTag !== "All") {
      result = result.filter(item =>
        item.tags.some(tag => tag.toLowerCase() === activeTag.toLowerCase())
      );
    }

    // 2. Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }

    // 3. Sort
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "most_viewed") {
      result.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
    }

    return result;
  }, [components, activeTag, searchQuery, sortBy, favorites.join(',')]);

  const displayTags = ["Favorites", ...FilterTags];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col min-h-full relative md:pl-80">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="absolute md:hidden h-full z-2 w-full">
          <MobileSideBar />
        </div>

        {/* Highlighting Running Border Notice Pinned at Top */}
        <div className="mx-auto mt-10 mb-5 relative rounded-xl p-[1px] w-fit overflow-hidden bg-gradient-to-r from-neutral-800 via-neutral-300 to-neutral-800 shadow-lg">
          <div className="py-2.5 px-4 rounded-xl bg-neutral-950 flex items-center justify-between text-xs sm:text-sm text-neutral-300">
            <p className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wide">Interactive Previews:</span>
              <span>Click any component card below to launch its live sandbox and inspect source code on the Detail Page.</span>
            </p>
          </div>
        </div>

        {/* Search + Sort bar */}
        <div className="flex flex-wrap items-center gap-3 mt-4 ml-5 mr-5">
          <div className="relative w-[220px] md:w-[240px] lg:w-[500px] shadow-lg">
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

          {/* Sort dropdown */}
          <div className="relative flex items-center gap-2">
            <SortIcon className="text-neutral-400 ml-10" fontSize="medium" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-neutral-800 text-neutral-300 text-sm border border-neutral-600 rounded-full px-2 py-1 focus:outline-none focus:border-neutral-400 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="most_viewed">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Tag filters */}
        <div className="relative flex mt-4 flex-wrap pl-5 items-center gap-3 font-bold">
          {displayTags.map((tag) => {
            const isActive = activeTag === tag;
            const isFavTag = tag === "Favorites";
            return (
              <div
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`text-xs cursor-pointer px-4 py-2 rounded-xl border transition-all duration-300 capitalize flex items-center gap-1 ${
                  isActive
                    ? "bg-white text-black border-white"
                    : isFavTag
                    ? "bg-red-950/40 text-red-400 border-red-900/50 hover:bg-red-900/60 hover:text-red-200"
                    : "bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-600 text-neutral-300/80 border-neutral-500 hover:text-white hover:border-neutral-200"
                }`}
              >
                {isFavTag && <FavoriteIcon sx={{ fontSize: 11 }} />}
                {tag}
              </div>
            );
          })}
        </div>

        {/* No results message */}
        {filterComponents.length === 0 && !loading && (
          <div className="flex flex-col items-center gap-2 mt-20 text-neutral-400">
            <CancelIcon className="text-red-500 text-4xl" />
            <p className="text-sm">No components found. Try tweaking the search.</p>
          </div>
        )}

        {/* Component Catalog Grid */}
        <div className="overflow-y-hidden px-6 mt-6 grid gridBox grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-start pb-24 flex-1 min-h-screen gap-6">
          {filterComponents.map((item) => (
            <div key={item.slug} className="componentCard col-span-1">
              <CardComponent
                name={item.name}
                description={item.description}
                slug={item.slug}
                id={item._id}
                viewsCount={item.viewsCount}
                createdAt={item.createdAt}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default ComponentsPage;
