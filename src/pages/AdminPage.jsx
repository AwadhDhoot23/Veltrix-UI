import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import Editor from '@monaco-editor/react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from "react-router-dom";
const emptyForm = {
  name: '',
  description: '',
  code: '',
  tags: '',
  dependencies: '',
};


function AdminPage() {
  const { user, login, logout } = useAuth();
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formMode, setFormMode] = useState(null); // 'create' | 'edit'
  const [editTarget, setEditTarget] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const navigate=useNavigate();

  const fetchComponents = async () => {
    try {
      const res = await api.get('/components');
      setComponents(res.data);
    } catch {
      toast.error('Failed to load components');
    }
  };

  useEffect(() => {
    if (user) fetchComponents();
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back, Admin!');
    } catch (err) {
      const msg = err.response?.data?.message || (err.code === 'ERR_NETWORK' || err.message === 'Network Error' ? 'Cannot connect to server. Check API URL.' : 'Invalid credentials');
      toast.error(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  const openCreate = () => {
    setFormData(emptyForm);
    setEditTarget(null);
    setFormMode('create');
  };

  const openEdit = (comp) => {
    setFormData({
      name: comp.name,
      description: comp.description,
      code: comp.code,
      tags: comp.tags?.join(', ') || '',
      dependencies: comp.dependencies?.join(', ') || '',
    });
    setEditTarget(comp);
    setFormMode('edit');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.code) {
      toast.error('Name, description and code are required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        slug: formData.name.toLowerCase().trim().replace(/[\s\W-]+/g, '-'),
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        dependencies: formData.dependencies.split(',').map(d => d.trim()).filter(Boolean),
      };

      if (formMode === 'create') {
        await api.post('/components', payload);
        toast.success('Component created!');
      } else {
        await api.put(`/components/${editTarget._id}`, payload);
        toast.success('Component updated!');
      }
      setFormMode(null);
      fetchComponents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save component');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/components/${deleteTarget._id}`);
      setComponents(prev => prev.filter(c => c._id !== deleteTarget._id));
      toast.success('Component deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete component');
    }
  };

  // ─── Login Screen ───────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div>
        <div>
        <button onClick={()=>{navigate("/")}} className="px-4 py-2 text-sm absolute right-5 top-5 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-400 transition-colors cursor-pointer">Home</button>
        </div>
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <Toaster theme="dark" position="bottom-right" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="bg-neutral-800 p-4 rounded-full mb-4 text-neutral-300">
              <LockIcon fontSize="large" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-neutral-500 text-sm mt-1">Veltrix UI Control Panel</p>
          </div>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-400 transition-colors"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-400 transition-colors"
              required
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loginLoading}
              className="mt-2 py-3 rounded-xl font-bold bg-gradient-to-r from-neutral-700 to-neutral-500 border border-neutral-500 text-white cursor-pointer hover:border-neutral-300 transition-colors disabled:opacity-50"
            >
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>
        </motion.div>
      </div>
      </div>
    );
  }

  // ─── Admin Dashboard ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster theme="dark" position="bottom-right" />

      {/* Header */}
      <div className="border-b border-neutral-800 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Veltrix Admin</h1>
          <p className="text-neutral-500 text-sm">Logged in as <span className="text-neutral-300">{user.email}</span></p>
        </div>
        <div className='flex gap-5'>
        <div>
        <button onClick={()=>{navigate("/")}} className="px-4 py-2 text-sm rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-400 transition-colors cursor-pointer">Home</button>
        </div>
        <button
          onClick={() => { logout(); }}
          className="px-4 py-2 text-sm rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-400 transition-colors cursor-pointer"
        >
          Sign Out
        </button>
        </div>
      </div>

      <div className="px-8 py-8 max-w-6xl mx-auto">
        {/* Stats + Create Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold">{components.length} Components</h2>
            <p className="text-neutral-500 text-sm">Total in database</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold rounded-xl cursor-pointer hover:bg-neutral-200 transition-colors"
          >
            <AddIcon fontSize="small" /> New Component
          </motion.button>
        </div>

        {/* Components Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_200px_100px] gap-4 px-6 py-3 border-b border-neutral-800 text-neutral-500 text-sm font-bold uppercase tracking-wider">
            <span>Name</span>
            <span>Views</span>
            <span>Tags</span>
            <span>Actions</span>
          </div>
          {components.length === 0 && (
            <p className="text-neutral-500 text-center py-10">No components yet. Create your first one!</p>
          )}
          {components.map(comp => (
            <div key={comp._id} className="grid grid-cols-[1fr_100px_200px_100px] gap-4 items-center px-6 py-4 border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
              <div>
                <p className="font-bold text-white">{comp.name}</p>
                <p className="text-neutral-500 text-xs mt-0.5 line-clamp-1">{comp.description}</p>
              </div>
              <span className="text-neutral-400 text-sm">{comp.viewsCount || 0}</span>
              <div className="flex flex-wrap gap-1 max-w-32">
                {(comp.tags || []).slice(0, 2).map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-700 text-neutral-300">{tag}</span>
                ))}
                {(comp.tags || []).length > 2 && <span className="text-[10px] text-neutral-500">+{comp.tags.length - 2}</span>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(comp)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors cursor-pointer"
                  title="Edit"
                >
                  <EditIcon fontSize="small" />
                </button>
                <button
                  onClick={() => setDeleteTarget(comp)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <DeleteIcon fontSize="small" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {formMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 w-full max-w-3xl shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{formMode === 'create' ? 'New Component' : 'Edit Component'}</h2>
                <button onClick={() => setFormMode(null)} className="text-neutral-400 hover:text-white cursor-pointer">
                  <CloseIcon />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-300 font-bold text-sm">Component Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Glowing Button"
                      className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-400 transition-colors"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-neutral-300 font-bold text-sm">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={e => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="button, animation, glow"
                      className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-neutral-300 font-bold text-sm">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this component does..."
                    className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-3 h-20 focus:outline-none focus:border-neutral-400 transition-colors resize-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-neutral-300 font-bold text-sm">React Code (JSX) *</label>
                  <div className="h-80 w-full rounded-lg overflow-hidden border border-neutral-700">
                    <Editor
                      height="100%"
                      defaultLanguage="javascript"
                      theme="vs-dark"
                      path="admin-component.jsx"
                      value={formData.code}
                      onChange={(value) => setFormData({ ...formData, code: value || '' })}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        wordWrap: 'on',
                        scrollBeyondLastLine: false,
                        padding: { top: 12, bottom: 12 }
                      }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-neutral-300 font-bold text-sm">Dependencies (comma separated)</label>
                  <input
                    type="text"
                    value={formData.dependencies}
                    onChange={e => setFormData({ ...formData, dependencies: e.target.value })}
                    placeholder="framer-motion, clsx"
                    className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-400 transition-colors"
                  />
                </div>

                <div className="flex gap-3 justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setFormMode(null)}
                    className="px-5 py-2.5 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl font-bold bg-white text-black cursor-pointer hover:bg-neutral-200 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : formMode === 'create' ? 'Create' : 'Save Changes'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-900 border border-neutral-700 p-8 rounded-2xl shadow-2xl max-w-md w-full"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Delete Component?</h3>
              <p className="text-neutral-400 mb-6">
                Are you sure you want to permanently delete <strong className="text-white">"{deleteTarget?.name}"</strong>? This cannot be undone.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-5 py-2 rounded-lg bg-red-600/20 text-red-400 border border-red-900 hover:bg-red-600/40 font-bold transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}

export default AdminPage;
