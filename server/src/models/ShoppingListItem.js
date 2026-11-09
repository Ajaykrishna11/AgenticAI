import mongoose from 'mongoose';

const shoppingListItemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
    itemName: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: 'pcs' },
    category: { type: String, default: 'General' },
    status: { type: String, enum: ['PENDING', 'PURCHASED'], default: 'PENDING' },
    suggestedByAi: { type: Boolean, default: false },
    reason: { type: String, default: '' }
  },
  { timestamps: true }
);

export const ShoppingListItem = mongoose.models.ShoppingListItem || mongoose.model('ShoppingListItem', shoppingListItemSchema);
