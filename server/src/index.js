const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const componentRoutes = require('./routes/component.routes');

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allow the configured frontend origin, fall back to * for local dev.
// Set ALLOWED_ORIGIN in your deployment environment (e.g. https://veltrix-ui.vercel.app)
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ── RATE LIMITING ─────────────────────────────────────────────────────────────
// Protect the login endpoint from brute-force attacks.
// Max 10 login attempts per IP per 15-minute window.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again in 15 minutes.' },
});

// Apply only to the login route — not to /api/auth/me or other public routes
app.use('/api/auth/login', loginLimiter);

// ── ROUTES ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/components', componentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Veltrix UI API is running' });
});

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});