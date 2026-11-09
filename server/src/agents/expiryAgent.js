import { Product } from '../models/Product.js';
import { notificationAgent } from './notificationAgent.js';

export const expiryAgent = {
  name: 'EXPIRY_AGENT',

  async runDailyExpiryScan(targetUserId = null) {
    const query = { isArchived: false };
    if (targetUserId) {
      query.userId = targetUserId;
    }

    const products = await Product.find(query);
    let updatedCount = 0;
    let alertsTriggered = 0;
    const summary = [];

    for (const prod of products) {
      const { status, remainingDays } = Product.calculateStatus(prod.expiryDate);
      
      const statusChanged = prod.status !== status || prod.remainingDays !== remainingDays;
      prod.status = status;
      prod.remainingDays = remainingDays;
      await prod.save();

      if (statusChanged) {
        updatedCount++;
      }

      // Check notification rules for expiring items
      const notifCreated = await notificationAgent.evaluateAndNotify(prod);
      if (notifCreated) {
        alertsTriggered++;
        summary.push({
          productId: prod._id,
          productName: prod.productName,
          status,
          remainingDays
        });
      }
    }

    return {
      success: true,
      totalChecked: products.length,
      updatedCount,
      alertsTriggered,
      summary,
      timestamp: new Date()
    };
  }
};
