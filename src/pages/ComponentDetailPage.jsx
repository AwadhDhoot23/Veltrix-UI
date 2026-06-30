import React, { useState, Suspense, useEffect } from "react";
import { useComponents } from "../context/ComponentsContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { LiveProvider, LiveError, LivePreview } from "react-live";
import { PreviewRegistry } from "../data/PreviewRegistry";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ErrorBoundary } from 'react-error-boundary';
import DoneIcon from "@mui/icons-material/Done";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
const SyntaxHighlighter = React.lazy(() =>
  import("react-syntax-highlighter").then((module) => ({
    default: module.Prism,
  })),
);
import { twilight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";
import MobileSideBar from "../components/MobileSideBar";
import DependenciesDropdown from "../components/DependenciesDropdown";
import { prepareCodeForLivePreview, liveScope } from "../utils/livePreviewHelpers";

function ComponentDetailPage() {
  const [copied, setCopied] = useState(false);
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("preview");
  const { components } = useComponents();
  const { user } = useAuth();
  const component = components.find((item) => item.slug === slug);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if it's already favorited
    if (user && component) {
      api.get('/favorites').then((res) => {
        if (res.data.some(f => f._id === component._id)) {
          setIsFavorite(true);
        }
      }).catch(err => console.log("Failed to load favorites"));
    }
  }, [user, component]);

  if (!component) {
    return <NotFound />;
  }
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(component.code);
      toast.success("Code Copied", { duration: 2000 });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Track copy in analytics
      await api.post(`/analytics/copy/${slug}`);
    } catch {
      toast.error("Failed to copy", { duration: 2000 });
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error("Please login to favorite components");
      return;
    }
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${component._id}`);
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await api.post(`/favorites/${component._id}`);
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (err) {
      toast.error("Failed to update favorite");
    }
  };

  const PreviewComponent = PreviewRegistry[slug];
  const { code: liveCode, noInline } = prepareCodeForLivePreview(component.code);

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
      <div className="flex min-h-screen relative w-full bg-black md:pl-80">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="md:hidden">
          <MobileSideBar />
        </div>

        <div className="flex-1 px-6 flex flex-col gap-5 min-w-0">
          <div className="flex justify-between items-center pt-14">
            <h1 className="font-bold text-5xl">{component.name}</h1>
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={handleFavorite}
              className="text-red-500 cursor-pointer mr-5"
            >
              {isFavorite ? <FavoriteIcon fontSize="large" /> : <FavoriteBorderIcon fontSize="large" />}
            </motion.button>
          </div>
          <p className="text-lg">{component.description}</p>
          <div className="mb-15">
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

          <div className="flex border rounded-lg w-fit px-1 py-1 bg-neutral-900 border-neutral-700">
            <button
              onClick={() => setActiveTab("preview")}
              className={` px-5 py-2 cursor-pointer font-bold tracking-tight relative rounded-md transition duration-200 ${activeTab == "preview"
                  ? "text-white border border-neutral-500 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-600"
                  : "text-white"
                }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-5 py-2 cursor-pointer font-bold tracking-tight relative rounded-md transition duration-200 ${activeTab == "code"
                  ? "text-white border border-neutral-500 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-600"
                  : "text-white"
                }`}
            >
              Code
            </button>
          </div>
          {activeTab == "preview" && (
              <div className="flex justify-center mb-10 md:mb-0 border-zinc-600 border-2 items-center bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-600 h-118 w-full rounded-lg">
                <div className="bg-black  h-114 w-full mx-2 justify-center flex items-center rounded-lg relative overflow-hidden">
                  <ErrorBoundary fallback={<div className="text-red-500 font-bold p-4">⚠️ Component Crashed</div>}>
                    {PreviewComponent ? (
                      <PreviewComponent />
                    ) : (
                      <LiveProvider code={liveCode} noInline={noInline} scope={liveScope}>
                          <LivePreview className="w-full h-full flex flex-col items-center justify-center text-white p-4" />
                          <LiveError className="absolute bottom-0 w-full bg-red-900 text-white p-2 text-sm overflow-y-auto max-h-32" />
                      </LiveProvider>
                    )}
                  </ErrorBoundary>
                </div>
              </div>
          )}

          {activeTab == "code" && (
              <div
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px,rgba(255,255,255,0.15) 1px, transparent 0)",
                  backgroundSize: "10px 10px",
                }}
                className=" max-w-[1090px] mb-10 bg- p-4 border relative rounded-2xl  border-white"
              >
                <div className="hidden md:block md:left-[12%] absolute lg:left-[6%] ">
                  <DependenciesDropdown dependencies={component.dependencies}/>
                </div>
                <div className="flex justify-between">
                  <div>
                    <Toaster position="top-right" />
                    <motion.button
                      initial={{ opacity: 0.8, scale: 0.95 }}
                      whileHover={{ opacity: 1, scale: 1.05 }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                      onClick={handleCopy}
                      className="cursor-pointer text-white px-2 pb-1 rounded relative"
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
                <ErrorBoundary fallback={<div className="text-red-400 font-bold p-4">⚠️ Component Crashed</div>}>
                  <Suspense
                    fallback={
                      <div className=" flex gap-3 items-center justify-center text-center">
                        <div className="h-4 w-4 bg-neutral-200 rounded-full animate-pulse"></div>
                        <div className="h-4 w-4 bg-neutral-300 rounded-full animate-pulse delay-100"></div>
                        <div className="h-4 w-4 bg-neutral-400 rounded-full animate-pulse delay-200"></div>
                      </div>
                    }
                  >
                    <SyntaxHighlighter
                      language="jsx"
                      style={twilight}
                      customStyle={{
                        padding: "1rem",
                        fontSize: "1rem",
                        height: "25rem",
                      }}
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
