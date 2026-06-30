import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PreviewRegistry } from '../data/PreviewRegistry';
import { motion } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import api from '../utils/api';
import { toast } from 'sonner';
import { LiveProvider, LivePreview, LiveError } from 'react-live';
import { prepareCodeForLivePreview } from '../utils/livePreviewHelpers';

function CardComponent({ name, description, slug, code, id, isFavorited, onFavoriteToggle, author }) {
  const navigate = useNavigate();
  const Preview = PreviewRegistry[slug];
  const { code: liveCode, noInline } = prepareCodeForLivePreview(code);
  return (
    <div>
      <motion.div

        initial={{ scale: .97 }} whileHover={{ scale: 1 }} transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='group w-80 relative h-full hover:border-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-neutral-300 hover:shadow-[2px_4px_48px_rgba(230,230,230,0.05)] border border-neutral-400 rounded-lg my-10 flex flex-col overflow-hidden'
      >

        {id && (
          <div 
            className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={async (e) => {
              e.stopPropagation();
              if (!id || typeof isFavorited === 'undefined') return;
              try {
                if (isFavorited) {
                  await api.delete(`/favorites/${id}`);
                  onFavoriteToggle(id, false);
                  toast.success("Removed from favorites");
                } else {
                  await api.post(`/favorites/${id}`);
                  onFavoriteToggle(id, true);
                  toast.success("Added to favorites");
                }
              } catch (err) {
                toast.error("Please login to favorite components");
              }
            }}
          >
            <motion.div whileTap={{ scale: 0.8 }} className="cursor-pointer bg-black/40 backdrop-blur-md p-1.5 rounded-full text-red-500 hover:bg-black/60 transition-colors">
              {isFavorited ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            </motion.div>
          </div>
        )}

        <motion.div
          onClick={() => navigate(`/components/${slug}`)}
          className='cursor-pointer flex-1 flex flex-col'
        >
          <motion.div
          initial={{ opacity: 1, scale: 0.9 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className='h-50 w-full border border-neutral-900/50 rounded-lg overflow-hidden flex items-center justify-center bg-black relative'>
          <ErrorBoundary fallback={<div className="text-red-400 font-bold p-4">⚠️ Component Crashed</div>}>
            {Preview ? <Preview /> : (
              liveCode ? (
                <LiveProvider code={liveCode} noInline={noInline}>
                  <LivePreview className="w-full h-full flex flex-col items-center justify-center text-white scale-[0.6] origin-center" />
                </LiveProvider>
              ) : "Preview not available!"
            )}
          </ErrorBoundary>
        </motion.div>

        <span className='h-px w-auto bg-neutral-600 '></span>
        <div className='px-4 cursor-text flex-1 pb-4 bg-zinc-950 pt-3'
          style={{
            backgroundImage: 'radial-gradient(circle at 0.5px 0.5px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '16px 16px'
          }}
        >

          <h3 className="font-bold mt-1 text-xl" >{name}</h3>
          <p className='text-neutral-400 mt-2 text-sm line-clamp-3'>{description}</p>
          
          {author && author.username && (
            <div className="mt-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-[10px] text-white shadow-md border border-neutral-600/50">
                {author.username.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-neutral-500">by <span className="text-neutral-300 font-medium">{author.username}</span></span>
            </div>
          )}
        </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default CardComponent
