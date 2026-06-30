import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useComponents } from '../context/ComponentsContext';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import MobileSideBar from '../components/MobileSideBar';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';

function SubmitComponentPage() {
  const { user } = useAuth();
  const { refreshComponents } = useComponents();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    tags: '',
    dependencies: '',
  });

  const [loading, setLoading] = useState(false);

  const handleEditorDidMount = (editor, monaco) => {
    // Configure Monaco compiler to understand React/JSX
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
    
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      jsxFactory: 'React.createElement',
      reactNamespace: 'React',
    });
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code.includes('export default')) {
      toast.error('Invalid React Code. Please include an "export default" component.');
      return;
    }

    if (!formData.name || !formData.description || !formData.code) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        slug: formData.name.toLowerCase().trim().replace(/[\s\W-]+/g, '-'),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        dependencies: formData.dependencies.split(',').map(dep => dep.trim()).filter(Boolean),
      };

      await api.post('/components', payload);
      toast.success('Component submitted successfully!');
      
      // Refresh the global components list
      refreshComponents();
      
      // Redirect to components page after a short delay
      setTimeout(() => {
        navigate('/components');
      }, 1500);
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit component');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex min-h-screen relative w-full bg-black md:pl-80">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="md:hidden">
          <MobileSideBar />
        </div>

        <div className="flex-1 px-6 flex flex-col gap-5 min-w-0 pt-14 pb-20">
          <Toaster theme="dark" position="bottom-right" />
          <h1 className="font-bold text-5xl mb-2">Submit Component</h1>
          <p className="text-neutral-400 text-lg mb-8">Share your amazing UI components with the community.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">
            
            <div className="flex flex-col gap-2">
              <label className="text-neutral-300 font-bold">Component Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Glowing Button"
                className="bg-neutral-900 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-400 transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-neutral-300 font-bold">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe what this component does..."
                className="bg-neutral-900 border border-neutral-700 text-white rounded-lg px-4 py-3 h-24 focus:outline-none focus:border-neutral-400 transition-colors"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-neutral-300 font-bold">React Code (JSX) *</label>
              <p className="text-xs text-neutral-500 mb-1">Make sure it's valid React JSX code.</p>
              <div className="h-96 w-full rounded-lg overflow-hidden border border-neutral-700">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  path="component.jsx"
                  value={formData.code}
                  onChange={(value) => setFormData({ ...formData, code: value })}
                  onMount={handleEditorDidMount}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    padding: { top: 16, bottom: 16 }
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-neutral-300 font-bold">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="button, animation, glow (comma separated)"
                  className="bg-neutral-900 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-400 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-neutral-300 font-bold">Dependencies</label>
                <input
                  type="text"
                  name="dependencies"
                  value={formData.dependencies}
                  onChange={handleChange}
                  placeholder="framer-motion, clsx (comma separated)"
                  className="bg-neutral-900 border border-neutral-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-neutral-400 transition-colors"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`mt-4 w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-neutral-800 to-neutral-600 border border-neutral-500 text-white shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-neutral-300'}`}
            >
              {loading ? 'Submitting...' : 'Submit Component'}
            </motion.button>

          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default SubmitComponentPage;
