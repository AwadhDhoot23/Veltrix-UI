import React, { useState, useMemo, useRef, useEffect } from "react";
import { useComponents } from "../context/ComponentsContext";
import CardComponent from "../components/CardComponent";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SearchIcon from "@mui/icons-material/Search";
import Sidebar from "../components/Sidebar";
import ClearIcon from "@mui/icons-material/Clear";
import CancelIcon from "@mui/icons-material/Cancel";
import { motion, AnimatePresence } from "framer-motion";
import MobileSideBar from "../components/MobileSideBar";
import SortIcon from "@mui/icons-material/Sort";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { getFavoriteSlugs } from "../hooks/useFavorites";

const INITIAL_CHUNK_SIZE = 12;
const CHUNK_INCREMENT = 6;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "most_viewed", label: "Most Viewed" },
];

function ComponentsPage() {
  useGSAP(() => {
    gsap.from(".componentCard", {
      y: 40,
      stagger: 0.08,
      opacity: 0,
      ease: "power2.out",
      duration: 0.5,
    });
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showTags, setShowTags] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_CHUNK_SIZE);
  const { components, loading } = useComponents();
  const observerTarget = useRef(null);
  const sortDropdownRef = useRef(null);
  const tagsDropdownRef = useRef(null);

  // Close dropdowns on Escape key or click outside
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowSortDropdown(false);
        setShowTags(false);
      }
    };
    const handleClickOutside = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setShowSortDropdown(false);
      }
      if (tagsDropdownRef.current && !tagsDropdownRef.current.contains(e.target)) {
        setShowTags(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
   * Derive unique tags dynamically and compute occurrence counts.
   */
  const { dynamicTags, tagCounts } = useMemo(() => {
    const counts = {};
    const tagSet = new Set();
    components.forEach((comp) => {
      (comp.tags || []).forEach((t) => {
        const cleanTag = t.trim();
        if (cleanTag) {
          tagSet.add(cleanTag);
          counts[cleanTag] = (counts[cleanTag] || 0) + 1;
        }
      });
    });
    return {
      dynamicTags: Array.from(tagSet).sort((a, b) => a.localeCompare(b)),
      tagCounts: counts,
    };
  }, [components]);

  // Read current favorites from localStorage at render time
  const favorites = getFavoriteSlugs();
  const favoritesKey = favorites.join(",");

  const filterComponents = useMemo(() => {
    let result = [...components];

    // 1. Tag / Favorites filter
    if (activeTag === "Favorites") {
      result = result.filter((item) => favorites.includes(item.slug));
    } else if (activeTag !== "All") {
      result = result.filter((item) =>
        (item.tags || []).some(
          (tag) => tag.toLowerCase() === activeTag.toLowerCase()
        )
      );
    }

    // 2. Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
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
  }, [components, activeTag, searchQuery, sortBy, favoritesKey]);

  // Reset pagination count whenever filters change
  useEffect(() => {
    setVisibleCount(INITIAL_CHUNK_SIZE);
  }, [searchQuery, activeTag, sortBy]);

  // Progressive loaded slice
  const displayedComponents = useMemo(() => {
    return filterComponents.slice(0, visibleCount);
  }, [filterComponents, visibleCount]);

  const hasMore = visibleCount < filterComponents.length;

  // Infinite scroll listener using IntersectionObserver
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setVisibleCount((prev) =>
            Math.min(prev + CHUNK_INCREMENT, filterComponents.length)
          );
        }
      },
      { threshold: 0.1, rootMargin: "180px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, filterComponents.length]);

  const handleClearTag = (e) => {
    e?.stopPropagation();
    setActiveTag("All");
  };

  const handleClearAllFilters = () => {
    setActiveTag("All");
    setSearchQuery("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex flex-col min-h-full relative md:pl-80">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <MobileSideBar />

        {/* Interactive Previews notice banner */}
        <div className="mt-16 md:mt-8 mb-4 mx-4 md:mx-6 relative rounded-xl p-[1px] w-fit overflow-hidden bg-gradient-to-r from-neutral-800 via-neutral-400 to-neutral-800 shadow-lg">
          <div className="py-2.5 px-4 rounded-xl bg-neutral-950 flex items-center justify-between text-xs sm:text-sm text-neutral-300">
            <p className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wide">
                Interactive Previews:
              </span>
              <span>
                Click any component card below to launch its live sandbox and
                inspect source code on the Detail Page.
              </span>
            </p>
          </div>
        </div>

        {/* Search + Sort bar — stacked on mobile, side-by-side on desktop */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 md:gap-4 mt-2 px-4 md:px-6">
          {/* Search: full width on mobile, flexible on desktop */}
          <div className="relative w-full sm:flex-1 sm:max-w-xl shadow-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <SearchIcon className="text-neutral-400" fontSize="small" />
            </div>
            <input
              id="component-search"
              aria-label="Search components"
              className="w-full bg-neutral-900/90 text-white pl-10 pr-10 py-3 sm:py-2.5 rounded-xl border border-neutral-700/80 focus:outline-none focus:border-neutral-400 transition-colors placeholder:text-neutral-500 shadow-inner text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search components by name or description…"
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

          {/* Sort + results count sit on same row as search on desktop,
              and below search (their own row) on mobile */}
          <div className="flex items-center gap-3">
          {/* Custom Sleek Sort Dropdown matching the website design system */}
          <div className="relative" ref={sortDropdownRef}>
            <button
              type="button"
              id="sort-dropdown-btn"
              aria-haspopup="listbox"
              aria-expanded={showSortDropdown}
              aria-label={`Sort by: ${sortBy === "newest" ? "Newest First" : "Most Viewed"}`}
              onClick={() => {
                setShowSortDropdown(!showSortDropdown);
                setShowTags(false);
              }}
              className="relative flex items-center bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 rounded-xl px-3.5 py-2.5 cursor-pointer shadow-sm text-neutral-300 text-xs sm:text-sm font-medium transition-colors gap-2"
            >
              <SortIcon className="text-neutral-400" fontSize="small" />
              <span>{sortBy === "newest" ? "Newest First" : "Most Viewed"}</span>
              <span className="text-[9px] text-neutral-400">
                {showSortDropdown ? "▲" : "▼"}
              </span>
            </button>

            <AnimatePresence>
              {showSortDropdown && (
                <motion.div
                  role="listbox"
                  aria-labelledby="sort-dropdown-btn"
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 sm:left-0 mt-2 w-44 bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-1 backdrop-blur-xl"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={sortBy === opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setShowSortDropdown(false);
                      }}
                      className={`text-xs text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                        sortBy === opt.value
                          ? "bg-white text-black font-bold"
                          : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.value && <span className="text-xs">✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results count — visible inline on mobile too */}
          {!loading && (
            <div className="text-xs text-neutral-500 font-mono whitespace-nowrap">
              {displayedComponents.length} / {filterComponents.length}
            </div>
          )}
          </div>{/* end flex row for sort+count */}
        </div>

        {/* Tag filter pills & category dropdown
             — overflow-visible ensures the dropdown floats cleanly over the page without clipping */}
        <div className="mt-3 px-4 md:px-6 z-30 flex flex-wrap items-center gap-2 overflow-visible">
          {/* "All" button */}
          <button
            onClick={() => setActiveTag("All")}
            aria-pressed={activeTag === "All"}
            className={`shrink-0 text-xs cursor-pointer px-4 py-2 rounded-xl border transition-all duration-200 font-semibold flex items-center gap-1.5 ${
              activeTag === "All"
                ? "bg-white text-black border-white shadow-md shadow-white/10"
                : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-600"
            }`}
          >
            All ({components.length})
          </button>

          {/* "Favorites" button with deselect cross */}
          <button
            onClick={() =>
              setActiveTag(activeTag === "Favorites" ? "All" : "Favorites")
            }
            aria-pressed={activeTag === "Favorites"}
            className={`shrink-0 text-xs cursor-pointer px-3.5 py-2 rounded-xl border transition-all duration-200 font-semibold flex items-center gap-1.5 ${
              activeTag === "Favorites"
                ? "bg-red-500 text-white border-red-400 shadow-md shadow-red-500/20"
                : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-red-300 hover:border-red-900/60"
            }`}
          >
            <FavoriteIcon sx={{ fontSize: 13 }} />
            <span>Favorites</span>
            {favorites.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/40">
                {favorites.length}
              </span>
            )}
            {activeTag === "Favorites" && (
              <span
                onClick={handleClearTag}
                className="ml-1 p-0.5 rounded-full hover:bg-black/30 flex items-center justify-center transition-colors"
                title="Deselect Favorites"
              >
                <ClearIcon sx={{ fontSize: 13 }} />
              </span>
            )}
          </button>

          {/* Active Tag pill with deselect cross */}
          {activeTag !== "All" && activeTag !== "Favorites" && (
            <div className="shrink-0 text-xs px-3.5 py-2 rounded-xl border font-semibold flex items-center gap-1.5 bg-white text-black border-white shadow-md shadow-white/10 animate-in fade-in">
              <span>Category: {activeTag}</span>
              <button
                onClick={handleClearTag}
                className="ml-1 p-0.5 rounded-full hover:bg-neutral-200 flex items-center justify-center transition-colors cursor-pointer"
                title="Deselect category (revert to All)"
              >
                <ClearIcon sx={{ fontSize: 13 }} />
              </button>
            </div>
          )}

          {/* Tags Dropdown Toggle */}
          {dynamicTags.length > 0 && (
            <div className="relative shrink-0" ref={tagsDropdownRef}>
              <button
                type="button"
                id="tags-dropdown-btn"
                aria-haspopup="listbox"
                aria-expanded={showTags}
                aria-label="Filter by category"
                onClick={() => {
                  setShowTags(!showTags);
                  setShowSortDropdown(false);
                }}
                className={`text-xs cursor-pointer px-4 py-2 rounded-xl border transition-all duration-200 font-semibold flex items-center gap-1.5 ${
                  activeTag !== "All" && activeTag !== "Favorites"
                    ? "bg-neutral-800 text-neutral-200 border-neutral-600"
                    : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:border-neutral-600"
                }`}
              >
                <span>Filter by Category</span>
                <span className="text-[9px] opacity-70">
                  {showTags ? "▲" : "▼"}
                </span>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showTags && (
                  <motion.div
                    role="listbox"
                    aria-labelledby="tags-dropdown-btn"
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-1 max-h-72 overflow-y-auto backdrop-blur-xl"
                  >
                    {/* Clear / All option at top of dropdown */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTag("All");
                        setShowTags(false);
                      }}
                      role="option"
                      aria-selected={activeTag === "All"}
                      className="text-xs text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between text-neutral-300 hover:bg-neutral-800/80 hover:text-white font-medium cursor-pointer"
                    >
                      <span>All Categories</span>
                      <span className="text-[10px] text-neutral-500">
                        {components.length}
                      </span>
                    </button>

                    <div className="h-px bg-neutral-800 my-1" />

                    {dynamicTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        role="option"
                        aria-selected={activeTag === tag}
                        onClick={() => {
                          setActiveTag(tag);
                          setShowTags(false);
                        }}
                        className={`text-xs text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between capitalize cursor-pointer ${
                          activeTag === tag
                            ? "bg-white text-black font-bold"
                            : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
                        }`}
                      >
                        <span className="truncate">{tag}</span>
                        <span
                          className={`text-[10px] ml-2 px-1.5 py-0.5 rounded-full ${
                            activeTag === tag
                              ? "bg-black/10 text-black font-semibold"
                              : "bg-neutral-900 text-neutral-500"
                          }`}
                        >
                          {tagCounts[tag] || 0}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* No results message */}
        {filterComponents.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center gap-3 mt-24 text-neutral-400 px-6">
            <CancelIcon className="text-neutral-600" sx={{ fontSize: 44 }} />
            <p className="text-base font-semibold text-neutral-300">
              No matching components found
            </p>
            <p className="text-xs text-neutral-500 max-w-sm text-center">
              We couldn't find anything matching your filters. Try clearing tags
              or searching for something else.
            </p>
            <button
              onClick={handleClearAllFilters}
              className="mt-3 px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-800 text-white hover:bg-neutral-700 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Skeleton loading grid while fetching from Render backend */}
        {loading ? (
          <div className="px-4 md:px-6 pt-6 md:pt-8 pb-24 overflow-visible">
            <div className="mb-6 flex items-center gap-2.5 text-xs text-neutral-400 bg-neutral-900/60 border border-neutral-800 rounded-xl px-4 py-3 w-fit">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>
                Connecting to cloud server… (Render free tier spin-up in
                progress)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-neutral-950/70 border border-neutral-800/80 rounded-2xl p-6 flex flex-col justify-between h-48 animate-pulse"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-5 w-20 bg-neutral-800 rounded-full" />
                    <div className="h-4 w-4 bg-neutral-800 rounded-full" />
                  </div>
                  <div className="space-y-2.5 my-2">
                    <div className="h-5 w-3/4 bg-neutral-800 rounded-md" />
                    <div className="h-3 w-full bg-neutral-900 rounded-md" />
                    <div className="h-3 w-2/3 bg-neutral-900 rounded-md" />
                  </div>
                  <div className="pt-4 border-t border-neutral-900 flex justify-between">
                    <div className="h-3 w-16 bg-neutral-900 rounded" />
                    <div className="h-3 w-12 bg-neutral-900 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Component Catalog Grid with top clearance and overflow-visible */
          <div className="overflow-visible px-4 md:px-6 pt-6 md:pt-8 pb-16 grid gridBox grid-cols-1 md:grid-cols-2 xl:grid-cols-3 items-start flex-1 min-h-[60vh] gap-6">
            {displayedComponents.map((item) => (
              <div key={item.slug} className="componentCard col-span-1 overflow-visible">
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

        {/* Infinite scroll sentinel & Load More indicator */}
        {!loading && filterComponents.length > 0 && (
          <div
            ref={observerTarget}
            className="flex flex-col items-center justify-center py-8 text-neutral-500 text-xs gap-2"
          >
            {hasMore ? (
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-ping" />
                <span>Loading more components as you scroll…</span>
                <button
                  onClick={() =>
                    setVisibleCount((prev) =>
                      Math.min(prev + CHUNK_INCREMENT, filterComponents.length)
                    )
                  }
                  className="ml-3 underline hover:text-white cursor-pointer"
                >
                  Load next batch
                </button>
              </div>
            ) : (
              <div className="text-neutral-500 text-xs">
                ✦ All {filterComponents.length} components loaded
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ComponentsPage;
