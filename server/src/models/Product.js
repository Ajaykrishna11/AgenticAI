import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    productName: { type: String, required: true, trim: true },
    brand: { type: String, default: 'Generic', trim: true },
    category: { type: String, required: true, default: 'FOOD' },
    subcategory: { type: String, default: 'Packaged Food' },
    productType: { type: String, default: 'General' },
    manufacturingDate: { type: Date, default: null },
    expiryDate: { type: Date, required: true },
    quantity: { type: Number, required: true, default: 1 },
    unit: { type: String, default: 'pcs' },
    storageLocation: { type: String, default: 'Refrigerator' },
    imageUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['SAFE', 'EXPIRING_SOON', 'URGENT', 'EXPIRES_TODAY', 'EXPIRED'],
      default: 'SAFE'
    },
    remainingDays: { type: Number, default: 30 },
    confidenceScore: { type: Number, default: 100 },
    rawOcrText: { type: String, default: '' },
    scannedAt: { type: Date, default: Date.now },
    isArchived: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Helper static method to calculate status given an expiry date
productSchema.statics.calculateStatus = function (expiryDate) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const exp = new Date(expiryDate);
  const expDay = new Date(exp.getFullYear(), exp.getMonth(), exp.getDate());

  const diffTime = expDay.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let status = 'SAFE';
  if (diffDays < 0) {
    status = 'EXPIRED';
  } else if (diffDays === 0) {
    status = 'EXPIRES_TODAY';
  } else if (diffDays <= 7) {
    status = 'URGENT';
  } else if (diffDays <= 30) {
    status = 'EXPIRING_SOON';
  } else {
    status = 'SAFE';
  }

  return { status, remainingDays: diffDays };
};

export const Product = mongoose.model('Product', productSchema);
