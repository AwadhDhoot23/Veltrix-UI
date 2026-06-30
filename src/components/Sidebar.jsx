  import React from 'react';
  import { Link, useLocation, useNavigate } from 'react-router-dom';
  import { useComponents } from '../context/ComponentsContext';
  import { useAuth } from '../context/AuthContext';
  import { motion } from 'framer-motion'
  import HomeIcon from '@mui/icons-material/Home';
  import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
  import DashboardIcon from '@mui/icons-material/Dashboard';
  import AddBoxIcon from '@mui/icons-material/AddBox';
  import LogoutIcon from '@mui/icons-material/Logout';
  import LoginIcon from '@mui/icons-material/Login';

  function Sidebar() {
    const location = useLocation();
    const currentSlug = location.pathname.split('/')[2];
    const navigate=useNavigate();
    const { components } = useComponents();
    const { user, logout } = useAuth();
    return (
      <div className="absolute top-0 z-20 left-0 md:block overflow-x-hidden pb-10 shrink-0 min-h-screen md:h-full w-full md:w-64 bg-neutral-950/50 backdrop-blur-xl text-white flex flex-col p-4 border-r border-neutral-300">
        
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
        
        <div className="flex-1">
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
                    className={`relative block w-full px-4 py-2 mb-2 rounded-md transition ${
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

        <div className="mt-auto flex flex-col pt-4 border-t border-neutral-700">
          
          {user ? (
            <>
              <div className="flex items-center gap-3 p-3 mb-4 rounded-xl bg-gradient-to-b from-neutral-900 to-neutral-900/50 border border-neutral-700/50 shadow-lg">
                <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md border border-neutral-600/50">
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-bold text-white truncate">{user.username}</span>
                  <span className="text-xs text-neutral-400 truncate">{user.email}</span>
                </div>
              </div>

              <motion.div
                  initial={{ scale: 0.95, opacity: 0.9 }}
                  animate={location.pathname === '/dashboard' ? { scale: 1.05, opacity: 1 } : { scale: 1, opacity: 0.9 }}
                  transition={{ duration: 0.7 }}
                >
                  <Link
                    to="/dashboard"
                    className={`relative flex items-center gap-2 w-full px-4 py-2 mb-2 rounded-md transition ${
                      location.pathname === '/dashboard'
                        ? 'text-white bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-600'
                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    <DashboardIcon fontSize="small" /> Dashboard
                  </Link>
              </motion.div>
              
              <motion.div
                  initial={{ scale: 0.95, opacity: 0.9 }}
                  animate={location.pathname === '/submit' ? { scale: 1.05, opacity: 1 } : { scale: 1, opacity: 0.9 }}
                  transition={{ duration: 0.7 }}
                >
                  <Link
                    to="/submit"
                    className={`relative flex items-center gap-2 w-full px-4 py-2 mb-2 rounded-md transition ${
                      location.pathname === '/submit'
                        ? 'text-white bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-600'
                        : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                    }`}
                  >
                    <AddBoxIcon fontSize="small" /> Submit Component
                  </Link>
              </motion.div>

              <motion.div
                  initial={{ scale: 0.95, opacity: 0.9 }}
                  animate={{ scale: 1, opacity: 0.9 }}
                  transition={{ duration: 0.7 }}
                >
                  <div
                    onClick={() => { logout(); navigate('/login'); }}
                    className="relative flex items-center gap-2 w-full px-4 py-2 mb-2 rounded-md transition text-neutral-300 hover:bg-neutral-800 hover:text-white cursor-pointer"
                  >
                    <LogoutIcon fontSize="small" /> Logout
                  </div>
              </motion.div>
            </>
          ) : (
            <motion.div
                initial={{ scale: 0.95, opacity: 0.9 }}
                animate={location.pathname === '/login' ? { scale: 1.05, opacity: 1 } : { scale: 1, opacity: 0.9 }}
                transition={{ duration: 0.7 }}
              >
                <Link
                  to="/login"
                  className={`relative flex items-center gap-2 w-full px-4 py-2 mb-2 rounded-md transition ${
                    location.pathname === '/login'
                      ? 'text-white bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-600'
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <LoginIcon fontSize="small" /> Login
                </Link>
            </motion.div>
          )}

          <div className='h-px w-full bg-neutral-700 my-2'></div>
          
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
