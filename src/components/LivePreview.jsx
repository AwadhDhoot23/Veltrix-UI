import React, { useState, useEffect, useRef, useMemo } from 'react';

const BABEL_CDN = 'https://unpkg.com/@babel/standalone/babel.min.js';

// Load Babel standalone from CDN once — cached by the browser after first visit
function loadBabel() {
  return new Promise((resolve, reject) => {
    if (window.Babel) { resolve(window.Babel); return; }
    // Avoid creating a duplicate script tag
    const existing = document.querySelector(`script[src="${BABEL_CDN}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Babel));
      existing.addEventListener('error', () => reject(new Error('Babel CDN failed to load')));
      return;
    }
    const script = document.createElement('script');
    script.src = BABEL_CDN;
    script.onload = () => resolve(window.Babel);
    script.onerror = () => reject(new Error('Could not load Babel compiler from CDN'));
    document.head.appendChild(script);
  });
}

/**
 * Minimal pre-processor — only strips `export default` so the component
 * becomes a regular named function/const in the module scope.
 * We detect the component name so we know what to render.
 * All `import` statements are left completely untouched.
 */
function preprocessCode(code) {
  let processed = code;
  let componentName = 'App';

  // export default function Foo → function Foo
  const m1 = processed.match(/export\s+default\s+function\s+([A-Z][A-Za-z0-9_]*)/);
  if (m1) {
    componentName = m1[1];
    processed = processed.replace(/export\s+default\s+function\s+/, 'function ');
    return { processed, componentName };
  }

  // export default const Foo = → const Foo =
  const m2 = processed.match(/export\s+default\s+const\s+([A-Z][A-Za-z0-9_]*)/);
  if (m2) {
    componentName = m2[1];
    processed = processed.replace(/export\s+default\s+const\s+/, 'const ');
    return { processed, componentName };
  }

  // Trailing: export default ComponentName; → remove that line
  const m3 = processed.match(/^export\s+default\s+([A-Z][A-Za-z0-9_]+)\s*;?\s*$/m);
  if (m3) {
    componentName = m3[1];
    processed = processed.replace(/^export\s+default\s+[A-Z][A-Za-z0-9_]+\s*;?\s*$/m, '').trim();
    return { processed, componentName };
  }

  // Fallback: find any capitalized function or const in the code
  const m4 = processed.match(/(?:^|\n)\s*(?:function|const)\s+([A-Z][A-Za-z0-9_]*)/);
  if (m4) componentName = m4[1];

  return { processed, componentName };
}

/**
 * Build the full iframe srcdoc HTML.
 *
 * How it works:
 * 1. An <importmap> tells the browser where to fetch npm packages (esm.sh on Cloudflare).
 *    No external bundler service needed — the browser's native module system handles it.
 * 2. Tailwind play CDN is injected so class-based styling works in the preview.
 * 3. The compiled JS (JSX transformed to React.createElement) runs as a <script type="module">.
 * 4. After render, the iframe sends a postMessage so the parent can hide the loading overlay.
 */
function buildSrcdoc(compiledCode, componentName, importMap) {
  // Escape </script> sequences so they don't prematurely close the script tag
  const safeCode = compiledCode.replace(/<\/script>/gi, '<\\/script>');
  const safeImportMap = JSON.stringify(importMap).replace(/<\/script>/gi, '<\\/script>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<script type="importmap">${safeImportMap}<\/script>
<script src="https://cdn.tailwindcss.com"><\/script>
<style>
  html, body {
    margin: 0; padding: 0;
    background: #000;
    min-height: 100vh;
  }
  #root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
</head>
<body>
<div id="root"></div>
<script type="module">
/* ── User Component Code ────────────────────────────────────────────────── */
${safeCode}
/* ── End User Component Code ────────────────────────────────────────────── */

(async () => {
  try {
    const { createElement } = await import('react');
    const { createRoot } = await import('react-dom/client');

    const Component = typeof ${componentName} !== 'undefined'
      ? ${componentName}
      : () => createElement('div', {
          style: { color: '#f87171', padding: '20px', fontFamily: 'monospace' }
        }, 'Component "${componentName}" not found. Check your export.');
        
    createRoot(document.getElementById('root')).render(createElement(Component));
    
    const ro = new ResizeObserver(() => {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: 'VELTRIX_RESIZE', height }, '*');
    });
    ro.observe(document.body);
    
    window.parent.postMessage({ type: 'VELTRIX_PREVIEW_READY' }, '*');
  } catch (err) {
    document.getElementById('root').innerHTML =
      '<div style="color:#f87171;padding:24px;font-family:monospace;font-size:13px;line-height:1.7">'
      + '<strong style="color:#fca5a5">⚠️ Render Error</strong><br>' + err.message
      + '</div>';
    window.parent.postMessage({ type: 'VELTRIX_PREVIEW_READY' }, '*');
  }
})();
<\/script>
</body>
</html>`;
}

// Base packages always available in every preview — no admin input needed
const BASE_IMPORTS = {
  "react":               "https://esm.sh/react@19",
  "react/jsx-runtime":   "https://esm.sh/react@19/jsx-runtime",
  "react-dom":           "https://esm.sh/react-dom@19",
  "react-dom/client":    "https://esm.sh/react-dom@19/client",
  "framer-motion":       "https://esm.sh/framer-motion@12?external=react,react-dom",
  "lucide-react":        "https://esm.sh/lucide-react?external=react,react-dom",
  "clsx":                "https://esm.sh/clsx",
  "tailwind-merge":      "https://esm.sh/tailwind-merge",
  "gsap":                "https://esm.sh/gsap",
};

/**
 * LivePreview — replaces Sandpack.
 *
 * @param {string}   code         Raw JSX component code from MongoDB (imports intact)
 * @param {string[]} dependencies Additional npm packages beyond the base set
 */
function LivePreview({ code, dependencies = [] }) {
  const iframeRef  = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState(null);
  const [iframeHeight, setIframeHeight] = useState('530px');

  // Build importmap: base deps + any component-specific ones from the DB
  const importMap = useMemo(() => ({
    imports: {
      ...BASE_IMPORTS,
      ...Object.fromEntries(
        (dependencies || [])
          .filter(dep => dep && !BASE_IMPORTS[dep])
          .map(dep => [dep, `https://esm.sh/${dep}?external=react,react-dom`])
      ),
    }
  }), [dependencies?.join(',')]);

  // Listen for the VELTRIX_PREVIEW_READY message sent after render inside the iframe
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'VELTRIX_PREVIEW_READY') {
        // Small delay so the iframe paint is visible before we fade the overlay
        setTimeout(() => setIsLoading(false), 150);
      } else if (e.data?.type === 'VELTRIX_RESIZE' && e.data.height) {
        setIframeHeight(Math.max(530, e.data.height) + 'px');
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Compile and inject whenever code changes
  useEffect(() => {
    if (!code) return;

    setIsLoading(true);
    setError(null);

    let cancelled = false;

    // Safety net: if the iframe never responds in 25s, remove the loader anyway
    const safetyTimer = setTimeout(() => {
      if (!cancelled) setIsLoading(false);
    }, 25000);

    loadBabel()
      .then(Babel => {
        if (cancelled) return;

        const { processed, componentName } = preprocessCode(code);

        let compiled;
        try {
          compiled = Babel.transform(processed, {
            presets: [['react', { runtime: 'automatic' }]],
            filename: 'App.jsx',
          }).code;
        } catch (babelErr) {
          if (!cancelled) {
            setError(`JSX syntax error: ${babelErr.message}`);
            setIsLoading(false);
          }
          clearTimeout(safetyTimer);
          return;
        }

        if (iframeRef.current && !cancelled) {
          iframeRef.current.srcdoc = buildSrcdoc(compiled, componentName, importMap);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setIsLoading(false);
        }
        clearTimeout(safetyTimer);
      });

    return () => {
      cancelled = true;
      clearTimeout(safetyTimer);
    };
  }, [code, importMap]);

  return (
    <div
      className="relative w-full rounded-lg overflow-hidden bg-black"
      style={{ height: iframeHeight, minHeight: '530px', transition: 'height 0.3s ease' }}
    >
      {/* Branded loading overlay — shown while Babel compiles + esm.sh fetches packages */}
      {isLoading && !error && (
        <div className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center gap-6">
          <h2
            className="font-extrabold text-3xl tracking-tight text-white"
            style={{ textShadow: '0 0 24px rgba(255,255,255,0.18)' }}
          >
            Veltrix UI
          </h2>
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 border-2 border-neutral-800 rounded-full" />
              <div className="absolute inset-0 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
            </div>
            <span className="text-neutral-500 text-[11px] font-semibold tracking-[0.3em] uppercase">
              Rendering preview…
            </span>
          </div>
          <p className="text-neutral-700 text-xs text-center max-w-[200px]">
            Loading packages from CDN
          </p>
        </div>
      )}

      {/* Error overlay — shown if Babel fails or code is broken */}
      {error && (
        <div className="absolute inset-0 z-10 bg-black flex items-start p-6 overflow-auto">
          <div className="text-red-400 font-mono text-sm leading-relaxed">
            <p className="text-red-300 font-bold mb-2">⚠️ Preview Error</p>
            <p className="whitespace-pre-wrap">{error}</p>
          </div>
        </div>
      )}

      {/* The actual preview iframe */}
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts"
        title="Component Preview"
        className="w-full block border-0"
        style={{
          height: iframeHeight,
          minHeight: '530px',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.35s ease, height 0.3s ease',
        }}
      />
    </div>
  );
}

export default LivePreview;
