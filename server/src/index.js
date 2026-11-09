import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import { seedInitialData } from './services/seedService.js';
import { initExpiryScheduler } from './services/expiryScheduler.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import {
  categoryRouter,
  expiryRouter,
  notificationRouter,
  shoppingRouter,
  analyticsRouter,
  chatRouter
} from './routes/otherRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'SMARTSHELF AI Backend & Agent Orchestrator',
    timestamp: new Date()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/categories', categoryRouter);
app.use('/api/expiry', expiryRouter);
app.use('/api/agents/expiry', expiryRouter); // Handles POST /api/agents/expiry/run
app.use('/api/notifications', notificationRouter);
app.use('/api/shopping-list', shoppingRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/chat', chatRouter);

// Database Connection & Server Startup
connectDB().then(async () => {
  await seedInitialData();
  initExpiryScheduler();

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`SMARTSHELF AI REST API SERVER RUNNING ON PORT ${PORT}`);
    console.log(`Health Check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}).catch(err => {
  console.error('[Server Error]: Could not start server', err);
});
