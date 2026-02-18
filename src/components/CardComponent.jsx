import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PreviewRegistry } from '../data/PreviewRegistry';
import { motion } from 'framer-motion';
function CardComponent({ name, description, slug }) {
  const navigate = useNavigate();
  const Preview = PreviewRegistry[slug];
  return (
    <div>
      <motion.div
        initial={{ scale: .97 }} whileHover={{ scale: 1 }} transition={{ duration: 0.3, ease: 'easeInOut' }}
        onClick={() => navigate(`/components/${slug}`)}
        className='size-80 hover:border-2 hover:border-white hover:shadow-[2px_4px_48px_rgba(230,230,230,0.1)] border rounded-lg my-10 flex flex-col cursor-pointer overflow-hidden'
      >
        <motion.div
          initial={{ opacity: 1, scale: 0.95 }}
          whileHover={{ opacity: 1, scale: 1.05 }}
          transition={{ duration: 0.8 }}
          className='h-60 flex items-center justify-center'>
          {Preview ? <Preview /> : "Preview not available!"}
        </motion.div>

        <span className='h-px w-auto bg-neutral-600 '></span>
        <div className='px-4 cursor-text flex-1 pb-4 bg-zinc-950 pt-3'
          style={{
            backgroundImage: 'radial-gradient(circle at 0.5px 0.5px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '16px 16px'
          }}
        >

          <h3 className="font-bold text-xl mb-2" >{name}</h3>
          <p className='text-neutral-400'>{description}</p>
        </div>
      </motion.div>
    </div>
  )
}

export default CardComponent
