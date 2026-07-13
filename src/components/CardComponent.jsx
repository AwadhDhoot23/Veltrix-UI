import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';

const FAVORITES_KEY = 'veltrix_favorites';

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

function isNewComponent(createdAt) {
  if (!createdAt) return false;
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return new Date(createdAt) > sevenDaysAgo;
}

function getComponentCategory(name = "") {
  const n = name.toLowerCase();
  if (n.includes("navbar") || n.includes("dock") || n.includes("header")) return "Navigation";
  if (n.includes("bento") || n.includes("grid") || n.includes("layout")) return "Layout";
  if (n.includes("text") || n.includes("reveal") || n.includes("blur") || n.includes("typography")) return "Typography";
  if (n.includes("button") || n.includes("btn") || n.includes("shimmer")) return "Interactive";
  if (n.includes("card") || n.includes("spotlight") || n.includes("pricing")) return "Cards";
  return "UI Primitive";
}

function CardComponent({ name, description, slug, id, viewsCount, createdAt }) {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const favs = getFavorites();
    setIsFavorited(favs.includes(slug));
  }, [slug]);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    const favs = getFavorites();
    let newFavs;
    if (isFavorited) {
      newFavs = favs.filter(f => f !== slug);
    } else {
      newFavs = [...favs, slug];
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavs));
    setIsFavorited(!isFavorited);
  };

  const isNew = isNewComponent(createdAt);
  const category = getComponentCategory(name);

  return (
    <div className="w-full h-auto">
      <motion.div
        initial={{ scale: 0.99 }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={() => navigate(`/components/${slug}`)}
        className="group cursor-pointer w-full bg-neutral-950 border border-neutral-800/80 hover:border-neutral-500 rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black p-6 relative"
      >
        {/* Top Badges Area */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            {isNew && (
              <span className="px-2 py-0.5 bg-white text-black text-[10px] font-bold rounded-full uppercase tracking-wider">
                New
              </span>
            )}
            <span className="px-2.5 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-400 text-[10px] font-medium rounded-full uppercase tracking-wider">
              {category}
            </span>
          </div>

          <div 
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={toggleFavorite}
          >
            <motion.div whileTap={{ scale: 0.8 }} className="cursor-pointer text-red-500 hover:text-red-400 transition-colors">
              {isFavorited ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            </motion.div>
          </div>
        </div>

        {/* Card Typography */}
        <div className="my-2">
          <h3 className="font-bold text-lg text-white tracking-tight group-hover:text-neutral-200 transition-colors">{name}</h3>
          <p className="text-neutral-400 mt-2 text-sm line-clamp-2 leading-relaxed">{description}</p>
        </div>

        {/* Card Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between text-neutral-500 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <VisibilityIcon sx={{ fontSize: 14 }} />
            <span>{typeof viewsCount === 'number' ? viewsCount.toLocaleString() : 0} views</span>
          </div>
          <span className="text-neutral-300 font-mono text-[11px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            Explore ↗
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default CardComponent;
