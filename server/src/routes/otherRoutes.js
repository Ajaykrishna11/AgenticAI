import express from 'express';
import { getCategories, getStorageLocations, createStorageLocation } from '../controllers/categoryController.js';
import { getExpiringSoon, getUrgent, getExpired, runExpiryAgent } from '../controllers/expiryController.js';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../controllers/notificationController.js';
import { getShoppingList, addItem, updateItem, deleteItem } from '../controllers/shoppingController.js';
import { getDashboardAnalytics, getCategoryAnalytics, getMonthlyAnalytics } from '../controllers/analyticsController.js';
import { handleChatMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

// Category Routes
export const categoryRouter = express.Router();
categoryRouter.get('/', protect, getCategories);
categoryRouter.get('/locations', protect, getStorageLocations);
categoryRouter.post('/locations', protect, createStorageLocation);

// Expiry Routes
export const expiryRouter = express.Router();
expiryRouter.use(protect);
expiryRouter.get('/expiring-soon', getExpiringSoon);
expiryRouter.get('/urgent', getUrgent);
expiryRouter.get('/expired', getExpired);
expiryRouter.post('/run-agent', runExpiryAgent);
expiryRouter.post('/run', runExpiryAgent); // POST /api/agents/expiry/run

// Notification Routes
export const notificationRouter = express.Router();
notificationRouter.use(protect);
notificationRouter.get('/', getNotifications);
notificationRouter.put('/read-all', markAllAsRead);
notificationRouter.put('/:id/read', markAsRead);
notificationRouter.delete('/:id', deleteNotification);

// Shopping List Routes
export const shoppingRouter = express.Router();
shoppingRouter.use(protect);
shoppingRouter.get('/', getShoppingList);
shoppingRouter.post('/', addItem);
shoppingRouter.put('/:id', updateItem);
shoppingRouter.delete('/:id', deleteItem);

// Analytics Routes
export const analyticsRouter = express.Router();
analyticsRouter.use(protect);
analyticsRouter.get('/dashboard', getDashboardAnalytics);
analyticsRouter.get('/categories', getCategoryAnalytics);
analyticsRouter.get('/monthly', getMonthlyAnalytics);

// Chatbot Routes
export const chatRouter = express.Router();
chatRouter.post('/', protect, handleChatMessage);
