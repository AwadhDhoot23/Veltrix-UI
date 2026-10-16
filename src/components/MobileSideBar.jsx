import React, { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

const MobileSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body scroll when mobile menu is open
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

  return (
    <div className="md:hidden">
      {/* Floating Hamburger Button — compact and never blocks page clicks */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Navigation Menu"
          className="fixed top-4 left-4 z-40 w-10 h-10 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 text-white rounded-xl backdrop-blur-md shadow-xl flex items-center justify-center cursor-pointer transition-all active:scale-95"
        >
          <MenuIcon fontSize="small" />
        </button>
      )}

      {/* Sidebar Overlay and Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-10 w-72 max-w-[85vw] h-full bg-neutral-950 border-r border-neutral-800 shadow-2xl flex flex-col"
            >
              {/* Drawer Close Button */}
              <div className="flex justify-end p-3 border-b border-neutral-900">
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Navigation Menu"
                  className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
                >
                  <CloseIcon fontSize="small" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto">
                <Sidebar onClose={() => setIsOpen(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileSideBar;
