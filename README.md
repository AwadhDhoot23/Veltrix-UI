<div align="center">
  <h1>Veltrix UI</h1>
  <p><strong>Next-Generation Component Architecture & Interactive React UI Library</strong></p>
  <p>Production-ready, animated React components with live in-browser compilation sandboxes, copy-ready source, and zero runtime lock-in.</p>

  <br/>

  [![React](https://img.shields.io/badge/React-19-black?style=for-the-badge&logo=react)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-7-black?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-black?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-black?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
  [![GSAP](https://img.shields.io/badge/GSAP-3-black?style=for-the-badge&logo=greensock)](https://gsap.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-black?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
  [![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
</div>

---

## Overview

**Veltrix UI** is a full-stack, cloud-powered developer library inspired by modern platforms like React Bits, Aceternity UI, and Shadcn UI. 

Unlike traditional component registries that force heavy npm dependencies or rigid third-party runtime wrappers, Veltrix UI provides **100% raw source code ownership**: drop self-contained components directly into your `/components` folder and customize them freely.

- **Live Production URL**: [https://veltrix-ui.vercel.app](https://veltrix-ui.vercel.app)
- **Backend API**: [https://veltrix-ui-backend.onrender.com](https://veltrix-ui-backend.onrender.com)
- **Hidden Admin Dashboard**: `/veltrix-admin` (JWT Protected)

---

## Architectural Highlights

### 1. ShapeGrid 2D Projection Background Engine
- Native Canvas 2D math projections simulating 3D matrix rotations (`tiltX`, `tiltY`) without heavy WebGL/Three.js bundles.
- Global cursor tracking with velocity damping, smoothstep lighting decay, cascade wave ripples, and DPR pixel throttling (`MAX_PIXELS = 8e6`).
- Section-scoped boundary tracking preventing offscreen canvas processing and memory leaks.

### 2. Signature Bento Sandbox Showcase
Interactive production components running directly on the landing page:
- **Lumen Auth**: Full-width split-screen authentication suite with live regex entropy password strength calculation, glowing orb motion, and OAuth badges.
- **Futuristic Terminal Box**: Interactive developer command console with live typing, cursor blinking, and one-click quick-run execution badges.
- **Interactive Particle Field**: Canvas physics particle network with cursor repulsion and distance-based line clustering.
- **Apple-Style Morphing Dock**: Proximity-based magnification utilizing Framer Motion spring physics with organic damping.
- **Animated Testimonial Carousel**: Zero-layout-shift social proof rotator powered by `AnimatePresence`.
- **Endless Scrolling Marquee**: Hardware-accelerated infinite linear track with pause-on-hover interaction.

### 3. Dynamic In-Browser Babel & ESM Compiler
- Sandboxed `<iframe>` compilation pipeline powered by `@babel/standalone`.
- Native browser ES Modules resolved on the fly via `esm.sh` import maps without requiring backend bundlers or container servers.
- Automatic adaptive height tracking via bidirectional `postMessage` protocol.

### 4. Zero-Friction Catalog Navigation & Progressive Loading
- Dynamic multi-tag categorization with instant tag deselect and reset to `All`.
- Infinite progressive chunk loading (`INITIAL_CHUNK_SIZE = 12`, `CHUNK_INCREMENT = 6`) triggered by `IntersectionObserver`.
- Custom-built Sort selector matching the unified dark aesthetic across both desktop and mobile viewports.
- Responsive mobile drawer navigation with touch scroll locking and tap propagation isolation.

---

## Tech Stack

### Frontend Architecture
| Technology | Version | Purpose |
|---|---|---|
| **React** | `^19.0.0` | UI architecture and component state |
| **Vite** | `^7.0.0` | Next-gen bundler and rapid HMR development |
| **Tailwind CSS** | `^4.0.0` | Utility-first design tokens and responsive layout |
| **Framer Motion** | `^12.0.0` | Spring physics, gestures, layout animations |
| **GSAP + ScrollTrigger** | `^3.12.0` | High-precision scroll-linked entrance choreography |
| **Babel Standalone** | `^7.26.0` | Client-side JSX parsing and live transpilation |
| **Monaco Editor** | `^4.7.0` | VS Code-grade code editor in the Admin Panel |
| **React Router** | `^6.28.0` | Client-side declarative routing |
| **Axios** | `^1.7.0` | HTTP client with automatic bearer token interceptors |
| **Lucide & MUI Icons** | Latest | Minimalist vector iconography |

### Backend & Cloud Architecture
| Technology | Version | Purpose |
|---|---|---|
| **Node.js + Express** | `v18+` | RESTful API server |
| **MongoDB + Mongoose** | `v8.9.0` | Document database for catalog components |
| **MongoDB Atlas** | Cloud | High-availability managed NoSQL cluster |
| **JSON Web Tokens (JWT)** | `^9.0.0` | Stateless authentication tokens |
| **bcryptjs** | `^2.4.0` | Cryptographic password hashing |
| **Express Rate Limit** | `^7.5.0` | Protection against credential stuffing and brute-force |

---

## Directory Structure

```
Veltrix-UI/
├── src/
│   ├── components/
│   │   ├── BentoShowcase.jsx      # Living Bento sandbox grid (Lumen Auth, Terminal, Dock, etc.)
│   │   ├── CardComponent.jsx      # High-performance catalog card with favorites & hover physics
│   │   ├── DependenciesDropdown.jsx # Expandable copy-ready npm install box
│   │   ├── Footer.jsx             # Minimalist platform footer
│   │   ├── LivePreview.jsx        # Babel iframe compiler with import map resolution
│   │   ├── MobileSideBar.jsx      # Touch-optimized mobile navigation drawer
│   │   ├── ShapeGrid.css          # Canvas container styles
│   │   ├── ShapeGrid.jsx          # Perspective math & canvas particle engine
│   │   └── Sidebar.jsx            # Desktop sticky navigation bar
│   ├── context/
│   │   ├── AuthContext.jsx        # JWT login session state
│   │   └── ComponentsContext.jsx  # Global component state & API synchronization
│   ├── hooks/
│   │   └── useFavorites.js        # LocalStorage synchronized bookmarking hook
│   ├── pages/
│   │   ├── AdminPage.jsx          # Protected CRUD console with Monaco code editor
│   │   ├── ComponentDetailPage.jsx# Live sandbox, syntax highlighted source, and props table
│   │   ├── ComponentsPage.jsx     # Filterable, sortable, progressive-loading catalog
│   │   ├── HomePage.jsx           # Landing experience with ShapeGrid & Bento showcase
│   │   └── NotFound.jsx           # 404 handler
│   └── utils/
│       ├── api.js                 # Axios instance with interceptors
│       ├── cn.js                  # Tailwind class merge helper
│       └── constants.js           # Navigation links and application routes
│
└── server/
    └── src/
        ├── config/db.js           # Mongoose connection handler
        ├── controller/
        │   ├── auth.controller.js # Login, register, session verification
        │   └── component.controller.js # CRUD business logic & atomic view incrementing
        ├── middleware/
        │   └── auth.middleware.js # Bearer token verification guard
        ├── models/
        │   ├── Component.models.js# Schema with indexing on slug & viewsCount
        │   └── User.models.js     # Admin user model with bcrypt hashing
        ├── routes/
        │   ├── auth.routes.js     # /api/auth routes
        │   └── component.routes.js# /api/components routes
        └── index.js               # Express application entrypoint
```

---

## Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/AwadhDhoot23/Veltrix-UI.git
cd Veltrix-UI
```

### 2. Frontend Setup
```bash
npm install
npm run dev
```
Frontend launches at `http://localhost:5173`.

### 3. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/veltrix
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

Start the API server:
```bash
node src/index.js
```
Backend API will listen at `http://localhost:5000`.

---

## API Reference

### Public Endpoints
- `GET /api/components` — Fetch all published components (sorted by newest or filtered by tag).
- `GET /api/components/:slug` — Fetch component details and atomically increment `viewsCount`.

### Authentication Endpoints
- `POST /api/auth/login` — Authenticate admin credentials and receive signed JWT.
- `POST /api/auth/register` — Register admin account (secured by environment guards).
- `GET /api/auth/me` — Verify active session token.

### Admin Endpoints (Requires `Authorization: Bearer <token>`)
- `POST /api/components` — Publish a new component with JSX source, tags, and dependencies.
- `PUT /api/components/:id` — Update existing component code or metadata.
- `DELETE /api/components/:id` — Remove component from catalog.

---

## Production Deployment

| Layer | Host | Pipeline |
|---|---|---|
| **Frontend** | [Vercel](https://vercel.com/) | Auto-builds from `main` branch with Vite production bundle |
| **Backend** | [Render](https://render.com/) | Node.js web service running Express |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) | Cloud cluster with encrypted connections |

---

## License

Distributed under the **MIT License**. Free for personal and commercial usage in modern applications.
