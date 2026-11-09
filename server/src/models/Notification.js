import mongoose from 'mongoose';
import { AgentLog } from './AgentLog.js';
import { ShoppingListItem } from './ShoppingListItem.js';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    title: { type: String, required: true },
    message: { type: String, required: true },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM'
    },
    notificationType: { type: String, default: 'EXPIRY_ALERT' },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export { AgentLog, ShoppingListItem };
