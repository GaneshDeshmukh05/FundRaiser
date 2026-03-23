require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Import models so Sequelize registers them before sync
require('./models/Fundraiser');
require('./models/Contribution');

const fundraiserRoutes = require('./routes/fundraisers');
const contributionRoutes = require('./routes/contributions');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/fundraisers', fundraiserRoutes);
app.use('/api/contributions', contributionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: 'sqlite', timestamp: new Date().toISOString() });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ──────────────────────────────────────────────────────────────────
// sequelize.sync() creates the SQLite tables automatically on first run
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ SQLite database synced (groupgift.sqlite)');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Database sync error:', err.message);
    process.exit(1);
  });
