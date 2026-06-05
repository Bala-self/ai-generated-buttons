require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { globalLimiter } = require('./middleware/rateLimit');
const errorHandler = require('./middleware/errorHandler');
const startDailyCron = require('./jobs/dailyGenerator');

const authRoutes = require('./routes/auth');
const buttonRoutes = require('./routes/buttons');
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '256kb' }));
app.use(morgan('dev'));
app.use(globalLimiter);

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, ts: new Date().toISOString() })
);

app.use('/api/auth', authRoutes);
app.use('/api/buttons', buttonRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 API running on http://localhost:${PORT}`);
    startDailyCron();
  });
})();
