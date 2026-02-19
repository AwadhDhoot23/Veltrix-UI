import React from 'react'
import {motion} from 'framer-motion'
import { useNavigate } from 'react-router-dom'
const NotFound = () => {
    const navigate=useNavigate();
  return (
    <div className='min-h-screen w-full flex flex-col justify-center items-center'>
        
        <motion.h1 
        initial={{ opacity: 0, y: 100, scale:1 }}
        animate={{ opacity: 1, y: 0,scale:1.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-[150px] md:text-[240px]  font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-neutral-200 via-neutral-500 to-neutral-950"
      >
        Error 404
      </motion.h1>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="flex flex-col mt-5 items-center z-10"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-300 mb-4">Page lost in the void.</h2>
        <p className="text-neutral-500 mb-10 text-center max-w-md">
          The component or page you are looking for doesn't exist or has been moved to another universe.
        </p>

        {/* 4. The Escape Button */}
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-3 cursor-pointer bg-gradient-to-r from-neutral-400 via-neutral-200 to-neutral-400 text-black font-bold rounded-2xl hover:scale-105 transition-transform duration-300"
        >
          Return to Safety
        </button>
      </motion.div>
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      ></div>
        
        
    </div>
  )
}

export default NotFound
