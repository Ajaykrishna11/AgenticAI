import { Notification } from '../models/Notification.js';

export const notificationAgent = {
  name: 'NOTIFICATION_AGENT',

  async evaluateAndNotify(product) {
    const { userId, category, status, remainingDays, productName } = product;

    let priority = null;
    let title = '';
    let message = '';
    let shouldNotify = false;

    if (status === 'EXPIRED') {
      priority = 'CRITICAL';
      title = '🚨 Item Expired';
      message = `Your ${productName} (${category}) has passed its expiry date. Please dispose of it safely.`;
      shouldNotify = true;
    } else if (status === 'EXPIRES_TODAY') {
      priority = 'CRITICAL';
      title = '⚠️ Expires Today!';
      message = `Your ${productName} expires today (${new Date(product.expiryDate).toLocaleDateString()}). Use or consume it immediately.`;
      shouldNotify = true;
    } else if (category === 'MEDICINE' && remainingDays <= 10 && remainingDays > 0) {
      priority = 'HIGH';
      title = '💊 Medicine Expiry Alert';
      message = `Your medicine ${productName} will expire in ${remainingDays} days. Please verify if still required.`;
      shouldNotify = true;
    } else if (category === 'FOOD' && remainingDays <= 7 && remainingDays > 0) {
      priority = 'HIGH';
      title = '🍞 Food Expiry Alert';
      message = `Your food product ${productName} will expire in ${remainingDays} days. Consider consuming it soon.`;
      shouldNotify = true;
    } else if (category === 'PERSONAL CARE' && remainingDays <= 30 && remainingDays > 0) {
      priority = 'MEDIUM';
      title = '🧴 Personal Care Notice';
      message = `${productName} expires in ${remainingDays} days. Keep track of remaining usage.`;
      shouldNotify = true;
    } else if (status === 'URGENT') {
      priority = 'HIGH';
      title = '⚠️ Urgent Expiry Warning';
      message = `${productName} expires in ${remainingDays} days.`;
      shouldNotify = true;
    }

    if (!shouldNotify) return null;

    // Deduplication check: Do not create duplicate notification on the same day for this product & user
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existing = await Notification.findOne({
      userId,
      productId: product._id,
      createdAt: { $gte: startOfDay }
    });

    if (existing) {
      return null; // Already notified today
    }

    const newNotif = await Notification.create({
      userId,
      productId: product._id,
      title,
      message,
      priority,
      notificationType: 'EXPIRY_ALERT'
    });

    return newNotif;
  }
};
