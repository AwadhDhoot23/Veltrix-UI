import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import MobileSideBar from '../components/MobileSideBar';
import { motion } from 'framer-motion';
import CardComponent from '../components/CardComponent';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalViews: 0, totalCopies: 0, totalSubmissions: 0, components: [] });
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, favoritesRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/favorites')
        ]);
        
        setStats(dashboardRes.data);
        setFavorites(favoritesRes.data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex justify-center items-center">Loading...</div>;
  }

  const handleDelete = async () => {
    if (!componentToDelete) return;
    try {
      await api.delete(`/components/${componentToDelete._id}`);
      setStats(prev => ({
        ...prev,
        totalSubmissions: prev.totalSubmissions - 1,
        components: prev.components.filter(c => c._id !== componentToDelete._id)
      }));
      setDeleteModalOpen(false);
      setComponentToDelete(null);
    } catch (error) {
      console.error("Failed to delete component", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-neutral-900 border border-neutral-700 p-8 rounded-2xl shadow-2xl max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Delete Component?</h3>
            <p className="text-neutral-400 mb-6">Are you sure you want to permanently delete "{componentToDelete?.name}"? This action cannot be undone.</p>
            <div className="flex gap-4 justify-end">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-lg text-neutral-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600/20 text-red-500 border border-red-900 hover:bg-red-600/40 hover:text-red-400 font-bold transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="flex min-h-screen relative w-full bg-black md:pl-80">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="md:hidden">
          <MobileSideBar />
        </div>

        <div className="flex-1 px-6 flex flex-col gap-5 min-w-0 pt-14">
          <h1 className="font-bold text-5xl mb-2">Welcome, {user?.name || 'Developer'}</h1>
          <p className="text-neutral-400 text-lg mb-8">Here is the analytics overview of your components.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 border border-neutral-700 p-6 rounded-xl flex flex-col items-center">
              <span className="text-4xl font-bold text-white">{stats.totalSubmissions}</span>
              <span className="text-neutral-400 mt-2">Total Submissions</span>
            </div>
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 border border-neutral-700 p-6 rounded-xl flex flex-col items-center">
              <span className="text-4xl font-bold text-white">{stats.totalViews}</span>
              <span className="text-neutral-400 mt-2">Total Views</span>
            </div>
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 border border-neutral-700 p-6 rounded-xl flex flex-col items-center">
              <span className="text-4xl font-bold text-white">{stats.totalCopies}</span>
              <span className="text-neutral-400 mt-2">Total Copies</span>
            </div>
          </div>

          <h2 className="font-bold text-3xl mb-6 border-b border-neutral-700 pb-2 w-fit">Your Favorites</h2>
          
          {favorites.length === 0 ? (
            <p className="text-neutral-500 mb-12">You haven't favorited any components yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
              {favorites.map((fav) => (
                <CardComponent
                  key={fav.slug}
                  name={fav.name}
                  description={fav.description}
                  slug={fav.slug}
                  code={fav.code}
                  id={fav._id}
                  author={fav.author}
                  isFavorited={true}
                  onFavoriteToggle={(id, adding) => {
                    if (!adding) {
                      setFavorites(favorites.filter(f => f._id !== id));
                    }
                  }}
                />
              ))}
            </div>
          )}

          <h2 className="font-bold text-3xl mb-6 border-b border-neutral-700 pb-2 w-fit mt-8">My Components</h2>
          
          {!stats.components || stats.components.length === 0 ? (
            <p className="text-neutral-500 pb-20">You haven't submitted any components yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-20">
              {stats.components.map((comp) => (
                <div key={comp.slug} className="relative group">
                  <div 
                    onClick={() => {
                      navigate(`/edit/${comp._id}`);
                    }}
                    className="absolute -top-3 right-7 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 border border-neutral-500 text-neutral-300 w-8 h-8 rounded-full flex justify-center items-center cursor-pointer hover:bg-neutral-800 hover:text-white"
                    title="Edit Component"
                  >
                    ✎
                  </div>
                  <div 
                    onClick={() => {
                      setComponentToDelete(comp);
                      setDeleteModalOpen(true);
                    }}
                    className="absolute -top-3 -right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-950/80 border border-red-500 text-red-500 w-8 h-8 rounded-full flex justify-center items-center cursor-pointer hover:bg-red-600 hover:text-white"
                    title="Delete Component"
                  >
                    ×
                  </div>
                  <CardComponent
                    name={comp.name}
                    description={comp.description}
                    slug={comp.slug}
                    code={comp.code}
                    author={{ username: user.username }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default DashboardPage;
