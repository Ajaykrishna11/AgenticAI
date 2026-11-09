import mongoose from 'mongoose';

const productUsageSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    quantityUsed: { type: Number, required: true, default: 1 },
    usedAt: { type: Date, default: Date.now },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export const ProductUsage = mongoose.model('ProductUsage', productUsageSchema);
