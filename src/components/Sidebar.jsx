import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useComponents } from '../context/ComponentsContext';
import { motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';

function Sidebar() {
  const location = useLocation();
  const currentSlug = location.pathname.split('/')[2];
  const navigate = useNavigate();
  const { components } = useComponents();

  return (
    <div className="absolute top-0 z-20 left-0 md:block overflow-x-hidden pb-10 shrink-0 min-h-screen md:h-full w-full md:w-64 bg-neutral-950/50 backdrop-blur-xl text-white flex flex-col p-4 border-r border-neutral-800">
      
      <motion.h2 
        initial={{scale:0.95,opacity:0.9}}
        animate={{scale:1.05,opacity:1}}
        transition={{duration:0.5}}
        className="text-xl font-bold text-center my-5 mb-10 cursor-pointer flex flex-col items-center text-neutral-300/90 hover:text-white tracking-tight group" 
        onClick={()=>navigate('/components')} 
      >
        Components
        <div className='h-[2.5px] w-22 bg-gradient-to-r from-transparent via-neutral-500 to-transparent mt-1 group-hover:w-38 group-hover:via-neutral-200 transition-all duration-500 ease-out '></div>
      </motion.h2>
      
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {components.map((item) => {
          const isActive = item.slug === currentSlug;
          return (
            <div key={item.slug}>
              <motion.div
                initial={{ scale: 0.95, opacity: 0.9 }}
                animate={isActive ? { scale: 1.05, opacity: 1 } : { scale: 1, opacity: 0.9 }}
                transition={{ duration: 0.7 }}
              >
                <Link
                  to={`/components/${item.slug}`}
                  className={`relative block w-full px-4 py-2 mb-2 rounded-md transition overflow-hidden truncate ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-600 pl-10'
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
      </div>

      {/* Home link at the bottom */}
      <div className="mt-auto pt-4 border-t border-neutral-800">
        <motion.div
          initial={{ scale: 0.95, opacity: 0.9 }}
          animate={location.pathname === '/' ? { scale: 1.05, opacity: 1 } : { scale: 1, opacity: 0.9 }}
          transition={{ duration: 0.7 }}
        >
          <Link
            to="/"
            className={`relative flex items-center gap-2 w-full px-4 py-2 mb-2 rounded-md transition ${
              location.pathname === '/'
                ? 'text-white bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-600'
                : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
            }`}
          >
            <HomeIcon fontSize="small" /> Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default Sidebar;
