import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    icon: { type: String, default: 'Package' },
    subcategories: [{ type: String }],
    recommendedLocation: { type: String, default: 'Kitchen Cupboard' },
    defaultNoticeDays: { type: Number, default: 7 }
  },
  { timestamps: true }
);

export const Category = mongoose.model('Category', categorySchema);

const storageLocationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const StorageLocation = mongoose.model('StorageLocation', storageLocationSchema);
