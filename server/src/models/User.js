import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: '' },
    role: { type: String, default: 'USER' },
    settings: {
      emailNotifications: { type: Boolean, default: true },
      expiryNoticeDays: { type: Number, default: 7 },
      theme: { type: String, default: 'dark' }
    }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
