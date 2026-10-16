import React, { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const MobileSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background body scrolling when the drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeDrawer = () => setIsOpen(false);

  return (
    <>
      {/* Sticky Mobile Top Navigation Bar */}
      <header className="sticky top-0 z-30 w-full h-14 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-4 flex items-center justify-between md:hidden">
        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="w-10 h-10 -ml-1 rounded-xl flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800/70 active:scale-95 transition-all cursor-pointer"
          aria-label="Open mobile navigation menu"
        >
          <MenuIcon sx={{ fontSize: 22 }} />
        </button>

        {/* Brand Center */}
        <Link
          to="/"
          className="flex items-center gap-1.5 font-bold text-base tracking-tight text-white"
        >
          <span className="text-amber-400">⚡</span>
          <span>Veltrix UI</span>
        </Link>

        {/* Right Quick Action */}
        <Link
          to="/components"
          className="text-xs px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white font-medium"
        >
          Browse
        </Link>
      </header>

      {/* Slide-out Drawer & Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-neutral-950 border-r border-neutral-800 shadow-2xl flex flex-col z-50 overflow-hidden"
            >
              {/* Drawer Top Header with Close Button */}
              <div className="h-14 px-4 flex items-center justify-between border-b border-neutral-800/80 shrink-0">
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="text-amber-400">⚡</span> Menu
                </span>
                <button
                  onClick={closeDrawer}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 active:scale-95 transition-colors cursor-pointer"
                  aria-label="Close mobile navigation menu"
                >
                  <CloseIcon sx={{ fontSize: 20 }} />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-hidden">
                <Sidebar onClose={closeDrawer} isMobile={true} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileSideBar;
