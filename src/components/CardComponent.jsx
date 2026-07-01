import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PreviewRegistry } from '../data/PreviewRegistry';
import { motion } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { LiveProvider, LivePreview } from 'react-live';
import { prepareCodeForLivePreview, liveScope } from '../utils/livePreviewHelpers';

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

function CardComponent({ name, description, slug, code, id, viewsCount, createdAt }) {
  const navigate = useNavigate();
  const Preview = PreviewRegistry[slug];
  const { code: liveCode, noInline } = prepareCodeForLivePreview(code);
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

  return (
    <div>
      <motion.div
        initial={{ scale: .97 }} whileHover={{ scale: 1 }} transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='group w-80 relative h-full hover:border-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-neutral-300 hover:shadow-[2px_4px_48px_rgba(230,230,230,0.05)] border border-neutral-400 rounded-lg my-10 flex flex-col overflow-hidden'
      >
        {/* New badge */}
        {isNew && (
          <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-emerald-500/90 text-white text-[10px] font-bold rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)] uppercase tracking-wider">
            New
          </div>
        )}

        {/* Favorite button */}
        <div 
          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={toggleFavorite}
        >
          <motion.div whileTap={{ scale: 0.8 }} className="cursor-pointer bg-black/40 backdrop-blur-md p-1.5 rounded-full text-red-500 hover:bg-black/60 transition-colors">
            {isFavorited ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          </motion.div>
        </div>

        <motion.div
          onClick={() => navigate(`/components/${slug}`)}
          className='cursor-pointer flex-1 flex flex-col'
        >
          <motion.div
            initial={{ opacity: 1, scale: 0.9 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className='h-50 w-full border border-neutral-900/50 rounded-lg overflow-hidden flex items-center justify-center bg-black relative'
          >
            <ErrorBoundary fallback={<div className="text-red-400 font-bold p-4">⚠️ Preview unavailable</div>}>
              <div className="w-[720px] h-[460px] flex items-center justify-center scale-[0.42] origin-center pointer-events-none overflow-hidden p-4">
                {Preview ? <Preview /> : (
                  liveCode ? (
                    <LiveProvider code={liveCode} noInline={noInline} scope={liveScope}>
                      <LivePreview className="w-full h-full flex flex-col items-center justify-center text-white" />
                    </LiveProvider>
                  ) : <div className="text-neutral-500 text-sm">No preview</div>
                )}
              </div>
            </ErrorBoundary>
          </motion.div>

          <span className='h-px w-auto bg-neutral-600'></span>
          <div className='px-4 cursor-text flex-1 pb-4 bg-zinc-950 pt-3'
            style={{
              backgroundImage: 'radial-gradient(circle at 0.5px 0.5px, rgba(255,255,255,0.1) 1px, transparent 0)',
              backgroundSize: '16px 16px'
            }}
          >
            <h3 className="font-bold mt-1 text-xl">{name}</h3>
            <p className='text-neutral-400 mt-2 text-sm line-clamp-2'>{description}</p>
            {/* View count */}
            {typeof viewsCount === 'number' && (
              <div className="mt-3 flex items-center gap-1 text-neutral-500 text-xs">
                <VisibilityIcon sx={{ fontSize: 13 }} />
                <span>{viewsCount.toLocaleString()} views</span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default CardComponent
