import React, { useState, Suspense, useEffect, useCallback } from "react";
import { useComponents } from "../context/ComponentsContext";
import LivePreview from "../components/LivePreview";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ErrorBoundary } from "react-error-boundary";
import DoneIcon from "@mui/icons-material/Done";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { twilight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import MobileSideBar from "../components/MobileSideBar";
import { useFavorites } from "../hooks/useFavorites";
import api from "../utils/api";

function ComponentDetailPage() {
  const [copied, setCopied] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("preview");
  const { components, updateComponentViews, loading } = useComponents();
  const contextComponent = components.find((item) => item.slug === slug);
  const [fetchedComponent, setFetchedComponent] = useState(null);
  const [localViewsCount, setLocalViewsCount] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const component = contextComponent || fetchedComponent;

  // Centralised favourite logic via custom hook — no more inline localStorage code
  const { isFavorite, toggleFavorite } = useFavorites(slug);

  useEffect(() => {
    if (!slug) return;

    setIsNotFound(false);

    const storageKey = `veltrix_viewed_${slug}`;
    const alreadyViewed = typeof window !== "undefined" && Boolean(sessionStorage.getItem(storageKey));
    const endpoint = alreadyViewed ? `/components/${slug}?track=false` : `/components/${slug}`;

    if (!alreadyViewed) {
      try {
        sessionStorage.setItem(storageKey, "1");
      } catch {
        // Ignore session storage quota or access errors in private/incognito
      }
    }

    let isMounted = true;

    api
      .get(endpoint)
      .then((res) => {
        if (!isMounted) return;
        const data = res.data;
        if (data) {
          setFetchedComponent(data);
          if (typeof data.viewsCount === "number") {
            setLocalViewsCount(data.viewsCount);
            if (updateComponentViews) {
              updateComponentViews(slug, data.viewsCount);
            }
          }
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error fetching component details:", err);
        if (err.response?.status === 404) {
          setIsNotFound(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug, updateComponentViews]);

  if (isNotFound) {
    return <NotFound />;
  }

  if (!component) {
    return (
      <div className="flex min-h-screen relative w-full bg-black md:pl-80 items-center justify-center">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="md:hidden">
          <MobileSideBar />
        </div>
        <div className="flex flex-col items-center gap-4 text-neutral-400">
          <div className="h-8 w-8 rounded-full border-2 border-neutral-700 border-t-white animate-spin" />
          <span className="text-sm font-mono tracking-wider">Loading component...</span>
        </div>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(component.code);
      toast.success("Code Copied", { duration: 2000 });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy", { duration: 2000 });
    }
  };

  const handleCopyInstall = async () => {
    if (!component.dependencies?.length) return;
    const cmd = `npm install ${component.dependencies.join(" ")}`;
    try {
      await navigator.clipboard.writeText(cmd);
      toast.success("Install command copied!", { duration: 2000 });
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } catch {
      toast.error("Failed to copy", { duration: 2000 });
    }
  };

  // Wrap toggleFavorite so we can fire a Sonner toast alongside it
  const handleFavorite = () => {
    toggleFavorite();
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const currentViews = localViewsCount ?? component.viewsCount ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex min-h-screen relative w-full bg-black md:pl-80">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="md:hidden">
          <MobileSideBar />
        </div>

        <div className="flex-1 px-4 sm:px-6 flex flex-col gap-5 min-w-0 pb-20">
          <div className="flex justify-between items-center pt-16 md:pt-14 gap-4">
            <h1 className="font-bold text-2xl sm:text-4xl md:text-5xl tracking-tight break-words">{component.name}</h1>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleFavorite}
              className="text-red-500 cursor-pointer mr-2 md:mr-5 shrink-0"
            >
              {isFavorite ? (
                <FavoriteIcon fontSize="large" />
              ) : (
                <FavoriteBorderIcon fontSize="large" />
              )}
            </motion.button>
          </div>

          <p className="text-lg text-neutral-300">{component.description}</p>

          {/* View count */}
          <div className="flex items-center gap-1.5 text-neutral-400 text-sm -mt-3">
            <VisibilityIcon sx={{ fontSize: 16 }} />
            <span>{Number(currentViews).toLocaleString()} views</span>
          </div>

          <div className="mb-10">
            {component.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm px-2 py-1 w-fit rounded-lg bg-neutral-700 text-white mr-2"
              >
                {" "}
                {tag}{" "}
              </span>
            ))}
          </div>

          {/* Preview / Code tab switcher */}
          <div className="flex border rounded-lg w-fit px-1 py-1 bg-neutral-900 border-neutral-700">
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-5 py-2 cursor-pointer font-bold tracking-tight relative rounded-md transition duration-200 ${
                activeTab === "preview"
                  ? "text-white border border-neutral-500 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-600"
                  : "text-white"
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-5 py-2 cursor-pointer font-bold tracking-tight relative rounded-md transition duration-200 ${
                activeTab === "code"
                  ? "text-white border border-neutral-500 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-600"
                  : "text-white"
              }`}
            >
              Code
            </button>
          </div>

          {/* ── PREVIEW TAB — powered by LivePreview (babel + importmap + esm.sh) ── */}
          {activeTab === "preview" && (
            <div className="flex justify-center mb-20 border-zinc-600 border-2 items-center bg-black min-h-[550px] w-full rounded-lg p-2">
                <LivePreview
                  code={component.code}
                  dependencies={component.dependencies}
                />
            </div>
          )}

          {/* ── CODE TAB — SyntaxHighlighter (unchanged) ───────────────────── */}
          {activeTab === "code" && (
            <div
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px,rgba(255,255,255,0.15) 1px, transparent 0)",
                backgroundSize: "10px 10px",
              }}
              className="w-full mb-20 p-4 border-2 border-zinc-600 relative rounded-lg"
            >
              {/* ── Prominent install banner (musHeaer fix) ─────────────────── */}
              {component.dependencies?.length > 0 && (
                <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-amber-500/30">
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                      Required packages
                    </span>
                  </div>
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <code className="flex-1 text-xs font-mono text-green-400 bg-black/60 px-3 py-1.5 rounded-lg border border-neutral-800 truncate">
                      npm install {component.dependencies.join(" ")}
                    </code>
                    <button
                      onClick={handleCopyInstall}
                      title="Copy install command"
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white transition-colors text-[11px] font-mono cursor-pointer"
                    >
                      {copiedInstall ? (
                        <DoneIcon className="text-green-400" sx={{ fontSize: 14 }} />
                      ) : (
                        <ContentCopyIcon sx={{ fontSize: 14 }} />
                      )}
                      <span>{copiedInstall ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <div>
                  <motion.button
                    initial={{ opacity: 0.8, scale: 0.95 }}
                    whileHover={{ opacity: 1, scale: 1.05 }}
                    transition={{ duration: 0.7, ease: "easeInOut" }}
                    onClick={handleCopy}
                    className="cursor-pointer text-white px-2 pb-1 rounded relative"
                    title="Copy JSX code"
                  >
                    {copied ? (
                      <DoneIcon className="text-green-300 font-bold" />
                    ) : (
                      <ContentCopyIcon />
                    )}{" "}
                  </motion.button>
                </div>
                <div className="flex relative gap-2">
                  <div className="h-3 w-3 rounded-full animate-pulse bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full animate-pulse delay:100 bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full animate-pulse delay:200 bg-green-500"></div>
                </div>
              </div>
              <ErrorBoundary
                fallback={
                  <div className="text-red-400 font-bold p-4">
                    Component Crashed
                  </div>
                }
              >
                <Suspense
                  fallback={
                    <div className="flex gap-3 items-center justify-center text-center py-10">
                      <div className="h-4 w-4 bg-neutral-200 rounded-full animate-pulse"></div>
                      <div className="h-4 w-4 bg-neutral-300 rounded-full animate-pulse delay-100"></div>
                      <div className="h-4 w-4 bg-neutral-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                  }
                >
                  <SyntaxHighlighter
                    language="jsx"
                    style={twilight}
                    customStyle={{ padding: "1rem", fontSize: "1rem", height: "25rem" }}
                    wrapLongLines={false}
                    showLineNumbers={true}
                  >
                    {component.code}
                  </SyntaxHighlighter>
                </Suspense>
              </ErrorBoundary>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ComponentDetailPage;
