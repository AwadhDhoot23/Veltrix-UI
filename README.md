<div align="center">
  <h1>⚡ Veltrix UI</h1>
  <p><strong>A curated library of beautiful, copy-paste ready React UI components.</strong></p>
  <p>Browse components, preview them live in the browser, copy the code, and use them in your projects instantly.</p>

  <br/>

  ![React](https://img.shields.io/badge/React-18-blue?logo=react)
  ![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
  ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?logo=mongodb)
  ![Vite](https://img.shields.io/badge/Vite-Build-purple?logo=vite)
  ![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)

</div>

---

## 🌐 Live Demo

> **Frontend**: [https://veltrix-ui.vercel.app](https://veltrix-ui.vercel.app)  
> **Backend API**: [https://veltrix-ui-backend.onrender.com](https://veltrix-ui-backend.onrender.com)

---

## ✨ Features

- 🎨 **Component Library** — Browse a growing collection of handcrafted React UI components
- 👁️ **Live Preview** — See every component rendered live in the browser before copying
- 📋 **One-Click Copy** — Instantly copy the JSX code for any component
- ❤️ **Favourites** — Favourite components locally, no account required
- 🆕 **New Badge** — Components uploaded in the last 7 days are highlighted with a "New" badge
- 📈 **View Counts** — See how many times each component has been viewed
- 🔍 **Search & Filter** — Search by name or filter by category tags
- 📊 **Sort** — Sort components by Newest or Most Viewed
- 🔐 **Secure Admin Panel** — A hidden admin panel for managing components (protected by JWT auth)
- 📱 **Responsive** — Fully responsive design for desktop and mobile

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations & micro-interactions |
| **GSAP** | Advanced scroll animations |
| **react-live** | In-browser React component rendering |
| **Monaco Editor** | VS Code-like code editor in the browser |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP requests |
| **Material UI Icons** | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **MongoDB + Mongoose** | NoSQL database |
| **MongoDB Atlas** | Cloud database hosting |
| **JWT (jsonwebtoken)** | Authentication tokens |
| **bcryptjs** | Password hashing |
| **CORS** | Cross-origin resource sharing |

---

## 📁 Project Structure

```
Veltrix-UI/
├── src/                          # Frontend (React)
│   ├── components/
│   │   ├── CardComponent.jsx     # Component card with live preview
│   │   ├── Sidebar.jsx           # Navigation sidebar
│   │   ├── MobileSideBar.jsx     # Mobile navigation
│   │   ├── DependenciesDropdown.jsx
│   │   └── Footer.jsx
│   ├── context/
│   │   ├── AuthContext.jsx       # JWT auth state management
│   │   └── ComponentsContext.jsx # Global components state
│   ├── data/
│   │   ├── Components.js         # Filter tags data
│   │   └── PreviewRegistry.jsx   # Maps slugs to static preview components
│   ├── pages/
│   │   ├── HomePage.jsx          # Landing page
│   │   ├── ComponentsPage.jsx    # Browse all components
│   │   ├── ComponentDetailPage.jsx # Single component view
│   │   ├── LoginPage.jsx         # Login page
│   │   ├── AdminPage.jsx         # Secret admin panel (/veltrix-admin)
│   │   └── NotFound.jsx          # 404 page
│   ├── ui/                       # Static component preview files
│   └── utils/
│       ├── api.js                # Axios instance
│       ├── cn.js                 # classnames utility
│       └── livePreviewHelpers.js # Code sandboxing for react-live
│
└── server/                       # Backend (Node.js)
    └── src/
        ├── config/db.js          # MongoDB connection
        ├── controller/
        │   ├── auth.controller.js
        │   └── component.controller.js
        ├── middleware/
        │   └── auth.middleware.js # JWT protect middleware
        ├── models/
        │   ├── User.models.js
        │   └── Component.models.js
        ├── routes/
        │   ├── auth.routes.js
        │   └── component.routes.js
        └── index.js              # Express app entry point
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB installed locally OR a MongoDB Atlas URI

### 1. Clone the repository
```bash
git clone https://github.com/AwadhDhoot23/Veltrix-UI.git
cd Veltrix-UI
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Set up the Backend
```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:
```env
MONGO_URI=mongodb://127.0.0.1:27017/veltrix-ui
JWT_SECRET=your_secret_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 4. Run the App

In one terminal (backend):
```bash
cd server
node src/index.js
```

In another terminal (frontend):
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Admin Panel

The admin panel is hidden at a secret URL. It is **not linked anywhere** in the public UI.

- **URL**: `/veltrix-admin`
- **Access**: Log in with your admin account credentials
- **Features**: Create, edit, and delete components using a Monaco code editor

---

## 📡 API Endpoints

### Public
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/components` | Get all components |
| `GET` | `/api/components/:slug` | Get component by slug (also increments view count) |

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT token |
| `GET` | `/api/auth/me` | Get current logged-in user |

### Admin (Protected — requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/components` | Create a new component |
| `PUT` | `/api/components/:id` | Update a component |
| `DELETE` | `/api/components/:id` | Delete a component |

---

## 🌍 Deployment

| Service | Purpose | Link |
|---|---|---|
| **Vercel** | Frontend hosting | Auto-deploys from `main` branch |
| **Render** | Backend API hosting | Free tier with auto-sleep |
| **MongoDB Atlas** | Cloud database | Free M0 cluster |

### Environment Variables for Deployment

**Vercel** (Frontend):
```
VITE_API_URL=https://your-render-backend.onrender.com/api
```

**Render** (Backend):
```
MONGO_URI=mongodb+srv://...your atlas connection string...
JWT_SECRET=your_production_secret_key
CLIENT_URL=https://your-vercel-app.vercel.app
PORT=5000
```

---

## 📸 Screenshots

> Browse components, preview them live, and copy the code with one click.

---

## 🤝 Contributing

This is a curated library — components are reviewed and uploaded by the admin to maintain quality. If you'd like to suggest a component, open an issue!

---

## 📄 License

MIT License — feel free to use components in your own projects.

---

<div align="center">
  <p>Built with ❤️ by <strong>Awadh</strong></p>
</div>
