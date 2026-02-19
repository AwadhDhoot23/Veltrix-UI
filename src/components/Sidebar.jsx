  import React from 'react';
  import { Link, useLocation, useNavigate } from 'react-router-dom';
  import { Components } from '../data/Components';
  import {motion} from 'framer-motion'
  import { duration } from '@mui/material';
  import HomeIcon from '@mui/icons-material/Home';

  function Sidebar() {
    const location = useLocation();
    const currentSlug = location.pathname.split('/')[2];
    const navigate=useNavigate();
    return (
      <div className="absolute left-0 md:block overflow-x-hidden code-scroll pb-20 shrink-0 h-full hidden w-0 md:w-64 bg-black text-white flex flex-col gap-2 p-4 border-r border-white">
        
        <motion.h2 
        initial={{scale:0.95,opacity:0.9}}
        animate={{scale:1.05,opacity:1}}
        transition={{duration:0.5}}
        className="text-xl font-bold text-center mb-10 cursor-pointer tracking-tight " onClick={()=>navigate('/components')} >Components</motion.h2>
        

        {Components.map((item) => {
          const isActive = item.slug === currentSlug;

          return (
            <div key={item.slug}>
            <motion.div
            
              initial={{ scale: 0.95, opacity: 0.9 }}
              animate={isActive ? { scale: 1.05, opacity: 1 } : { scale: 1, opacity: 0.9 }}
              transition={{ duration: 0.7 }}
            >
            <Link
              initial={{ scale: 0.95, opacity: 0.9 }}
              animate={isActive ? { scale: 1.05, opacity: 1 } : { scale: 1, opacity: 0.9 }}
              transition={{ duration: 0.7 }}
              
              to={`/components/${item.slug}`}
              className={`relative block w-full px-4 py-2 mb-2 rounded-md transition ${
                isActive
                  ? ' text-white bg-gradient-to-r from-black via-neutral-800 to-neutral-500 pl-10'
                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              {isActive && (
                <span className='absolute left-2 top-1/2 -translate-y-1/2 h-5 w-1.5 rounded-full bg-neutral-500'></span>
              )}
              {item.name}
            </Link>
            </motion.div>
            
            </div>
          );
        })}
        <div className='h-px w-full bg-neutral-700 mt-20 mb-1'></div>
        <motion.div
            initial={{scale:0.90,opacity:0.95}}
            animate={{scale:1.05,opacity:1}}
            transition={{duration:0.5}}
            onClick={()=>navigate('/')} className='relative text-neutral-600 cursor-pointer -bottom-4 flex left-18 gap-1'><HomeIcon />Home</motion.div>
            <div className='h-px w-full bg-neutral-700 mt-10'></div>
      </div>
      
    );
  }

  export default Sidebar;
