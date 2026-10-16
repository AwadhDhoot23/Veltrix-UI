import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useComponents } from '../context/ComponentsContext';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

function Sidebar({ onClose, isMobile = false }) {
  const location = useLocation();
  const currentSlug = location.pathname.split('/')[2];
  const navigate = useNavigate();
  const { components } = useComponents();
  const [filterQuery, setFilterQuery] = useState('');

  const filteredComponents = useMemo(() => {
    if (!filterQuery.trim()) return components;
    const q = filterQuery.toLowerCase();
    return components.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.tags || []).some((t) => t.toLowerCase().includes(q))
    );
  }, [components, filterQuery]);

  const handleNavigate = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <div
      className={`${
        isMobile
          ? 'w-full h-full'
          : 'fixed top-0 left-0 hidden md:flex md:w-64 h-screen z-20'
      } overflow-x-hidden pb-8 shrink-0 bg-neutral-950/95 backdrop-blur-xl text-white flex-col p-4 border-r border-neutral-800`}
    >
      {/* Brand Header */}
      <div
        className="my-3 mb-6 cursor-pointer flex flex-col items-center text-neutral-300 hover:text-white tracking-tight group"
        onClick={() => handleNavigate('/components')}
      >
        <span className="text-xl font-bold tracking-tight flex items-center gap-1.5">
          <span className="text-amber-400">⚡</span> Veltrix UI
        </span>
        <span className="text-[10px] text-neutral-500 font-mono tracking-wider mt-0.5">
          {components.length} Components
        </span>
        <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-neutral-500 to-transparent mt-1.5 group-hover:w-28 group-hover:via-neutral-200 transition-all duration-300" />
      </div>

      {/* Main Nav Links */}
      <div className="space-y-1 mb-4">
        <Link
          to="/"
          onClick={handleLinkClick}
          className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
            location.pathname === '/'
              ? 'text-white bg-neutral-800 border border-neutral-700 shadow-sm'
              : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
          }`}
        >
          <HomeIcon fontSize="small" />
          <span>Home</span>
        </Link>

        <Link
          to="/components"
          onClick={handleLinkClick}
          className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
            location.pathname === '/components'
              ? 'text-white bg-neutral-800 border border-neutral-700 shadow-sm'
              : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
          }`}
        >
          <span>All Components</span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-400 border border-neutral-800">
            {components.length}
          </span>
        </Link>
      </div>

      {/* Quick Search inside Sidebar */}
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
          <SearchIcon sx={{ fontSize: 16 }} className="text-neutral-500" />
        </div>
        <input
          type="text"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          placeholder="Filter sidebar..."
          className="w-full bg-neutral-900/90 text-white pl-8 pr-7 py-1.5 rounded-lg border border-neutral-800 focus:outline-none focus:border-neutral-600 text-xs placeholder:text-neutral-500 transition-colors"
        />
        {filterQuery && (
          <button
            onClick={() => setFilterQuery('')}
            className="absolute inset-y-0 right-0 pr-2 flex items-center text-neutral-500 hover:text-white"
          >
            <ClearIcon sx={{ fontSize: 13 }} />
          </button>
        )}
      </div>

      <div className="h-px bg-neutral-850 border-t border-neutral-800/80 mb-3" />

      {/* Scrollable Components List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
        {filteredComponents.length === 0 ? (
          <div className="text-xs text-neutral-500 text-center py-6">
            No matching components
          </div>
        ) : (
          filteredComponents.map((item) => {
            const isActive = item.slug === currentSlug;
            return (
              <Link
                key={item.slug}
                to={`/components/${item.slug}`}
                onClick={handleLinkClick}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium transition group overflow-hidden ${
                  isActive
                    ? 'text-white bg-neutral-800/90 border border-neutral-700/80 shadow-sm'
                    : 'text-neutral-400 hover:bg-neutral-900/80 hover:text-neutral-200'
                }`}
              >
                {isActive && (
                  <span className="h-3 w-1 shrink-0 rounded-full bg-amber-400" />
                )}
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Sidebar;
