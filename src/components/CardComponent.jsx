import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useFavorites } from '../hooks/useFavorites';

function isNewComponent(createdAt) {
  if (!createdAt) return false;
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return new Date(createdAt) > sevenDaysAgo;
}

function CardComponent({ name, description, slug, id, viewsCount, createdAt, tags }) {
  const navigate = useNavigate();

  // Single hook call replaces the inline getFavorites / toggle copy-paste
  const { isFavorite, toggleFavorite } = useFavorites(slug);

  const isNew = isNewComponent(createdAt);

  /*
   * Use the first actual DB tag as the category badge.
   * Capitalise the first letter for display.
   * Falls back to "Component" if the component has no tags.
   * This replaces the brittle name-heuristic getComponentCategory() function.
   */
  const category =
    tags?.[0]
      ? tags[0].charAt(0).toUpperCase() + tags[0].slice(1)
      : 'Component';

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent card navigation when clicking the heart
    toggleFavorite();
  };

  return (
    <div className="w-full h-auto">
      <motion.div
        initial={{ scale: 0.99 }}
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
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
            onClick={handleFavoriteClick}
          >
            <motion.div
              whileTap={{ scale: 0.8 }}
              className="cursor-pointer text-red-500 hover:text-red-400 transition-colors"
            >
              {isFavorite ? (
                <FavoriteIcon fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </motion.div>
          </div>
        </div>

        {/* Card Typography */}
        <div className="my-2">
          <h3 className="font-bold text-lg text-white tracking-tight group-hover:text-neutral-200 transition-colors">
            {name}
          </h3>
          <p className="text-neutral-400 mt-2 text-sm line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between text-neutral-500 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <VisibilityIcon sx={{ fontSize: 14 }} />
            <span>
              {typeof viewsCount === 'number' ? viewsCount.toLocaleString() : 0} views
            </span>
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
