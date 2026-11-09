import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Category, StorageLocation } from '../models/Category.js';
import { Notification } from '../models/Notification.js';

export const seedInitialData = async () => {
  try {
    // 1. Seed Categories if empty
    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      await Category.insertMany([
        { name: 'FOOD', icon: 'Apple', subcategories: ['Dairy', 'Fruits', 'Vegetables', 'Packaged Food', 'Bakery', 'Snacks', 'Beverages'], recommendedLocation: 'Refrigerator' },
        { name: 'MEDICINE', icon: 'Pill', subcategories: ['Tablets', 'Capsules', 'Syrups', 'First Aid'], recommendedLocation: 'Medicine Box' },
        { name: 'PERSONAL CARE', icon: 'Sparkles', subcategories: ['Cosmetics', 'Skincare', 'Haircare', 'Oral Care'], recommendedLocation: 'Bathroom' },
        { name: 'SANITARY PRODUCTS', icon: 'Shield', subcategories: ['Hygiene', 'Pads', 'Wipes'], recommendedLocation: 'Bathroom' },
        { name: 'CLEANING PRODUCTS', icon: 'Sparkles', subcategories: ['Detergents', 'Disinfectants', 'Dishwashing'], recommendedLocation: 'Cleaning Storage' },
        { name: 'GROCERIES', icon: 'ShoppingBag', subcategories: ['Spices', 'Grains', 'Oils'], recommendedLocation: 'Grocery Shelf' },
        { name: 'BABY PRODUCTS', icon: 'Heart', subcategories: ['Baby Food', 'Diapers', 'Care'], recommendedLocation: 'Storeroom' },
        { name: 'OTHER', icon: 'Package', subcategories: ['General', 'Misc'], recommendedLocation: 'Kitchen Cupboard' }
      ]);
      console.log('[Seed Service]: Categories seeded successfully.');
    }

    // 2. Create Demo User
    let demoUser = await User.findOne({ email: 'demo@smartshelf.ai' });
    if (!demoUser) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('demo123', salt);
      demoUser = await User.create({
        name: 'Alex Johnson',
        email: 'demo@smartshelf.ai',
        passwordHash
      });
      console.log('[Seed Service]: Demo User created (demo@smartshelf.ai / demo123).');
    }

    // 3. Seed Storage Locations for Demo User
    const locCount = await StorageLocation.countDocuments({ userId: demoUser._id });
    if (locCount === 0) {
      const locations = [
        'Refrigerator', 'Freezer', 'Kitchen Cupboard', 'Grocery Shelf',
        'Storeroom', 'Medicine Box', 'Bathroom', 'Cosmetic Shelf', 'Cleaning Storage'
      ];
      await StorageLocation.insertMany(locations.map(name => ({ userId: demoUser._id, name })));
    }

    // 4. Seed Demo Products if empty for demo user
    const prodCount = await Product.countDocuments({ userId: demoUser._id });
    if (prodCount === 0) {
      const now = new Date();

      const demoProducts = [
        {
          userId: demoUser._id,
          productName: 'Fresh Whole Milk',
          brand: 'Amul',
          category: 'FOOD',
          subcategory: 'Dairy',
          productType: 'Beverage',
          expiryDate: new Date(now.getTime() + 2 * 86400000), // +2 days (URGENT)
          quantity: 2,
          unit: 'cartons',
          storageLocation: 'Refrigerator',
          imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
          status: 'URGENT',
          remainingDays: 2
        },
        {
          userId: demoUser._id,
          productName: 'Whole Wheat Sandwich Bread',
          brand: 'Britannia',
          category: 'FOOD',
          subcategory: 'Bakery',
          productType: 'Packaged Food',
          expiryDate: new Date(now.getTime() + 3 * 86400000), // +3 days (URGENT)
          quantity: 1,
          unit: 'loaf',
          storageLocation: 'Kitchen Cupboard',
          imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
          status: 'URGENT',
          remainingDays: 3
        },
        {
          userId: demoUser._id,
          productName: 'Paracetamol Dolo 650mg',
          brand: 'Micro Labs',
          category: 'MEDICINE',
          subcategory: 'Tablets',
          productType: 'Painkiller',
          expiryDate: new Date(now.getTime() + 300 * 86400000), // +300 days (SAFE)
          quantity: 15,
          unit: 'tablets',
          storageLocation: 'Medicine Box',
          imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
          status: 'SAFE',
          remainingDays: 300
        },
        {
          userId: demoUser._id,
          productName: 'Head & Shoulders Shampoo',
          brand: 'Head & Shoulders',
          category: 'PERSONAL CARE',
          subcategory: 'Haircare',
          productType: 'Shampoo',
          expiryDate: new Date(now.getTime() + 500 * 86400000), // +500 days (SAFE)
          quantity: 1,
          unit: 'bottle',
          storageLocation: 'Bathroom',
          imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80',
          status: 'SAFE',
          remainingDays: 500
        },
        {
          userId: demoUser._id,
          productName: 'Nivea Sunprotect Sunscreen SPF 50',
          brand: 'Nivea',
          category: 'PERSONAL CARE',
          subcategory: 'Skincare',
          productType: 'Sunscreen',
          expiryDate: new Date(now.getTime() + 200 * 86400000), // +200 days (SAFE)
          quantity: 1,
          unit: 'tube',
          storageLocation: 'Cosmetic Shelf',
          imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80',
          status: 'SAFE',
          remainingDays: 200
        },
        {
          userId: demoUser._id,
          productName: 'Colgate Total Dental Toothpaste',
          brand: 'Colgate',
          category: 'PERSONAL CARE',
          subcategory: 'Oral Care',
          productType: 'Toothpaste',
          expiryDate: new Date(now.getTime() + 400 * 86400000), // +400 days (SAFE)
          quantity: 2,
          unit: 'tubes',
          storageLocation: 'Bathroom',
          imageUrl: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?auto=format&fit=crop&w=400&q=80',
          status: 'SAFE',
          remainingDays: 400
        },
        {
          userId: demoUser._id,
          productName: 'Cheddar Cheese Slices',
          brand: 'Amul',
          category: 'FOOD',
          subcategory: 'Dairy',
          productType: 'Packaged Food',
          expiryDate: new Date(now.getTime() + 5 * 86400000), // +5 days (URGENT)
          quantity: 1,
          unit: 'pack',
          storageLocation: 'Refrigerator',
          imageUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=400&q=80',
          status: 'URGENT',
          remainingDays: 5
        },
        {
          userId: demoUser._id,
          productName: 'Greek Fruit Yogurt',
          brand: 'Epigamia',
          category: 'FOOD',
          subcategory: 'Dairy',
          productType: 'Snack',
          expiryDate: new Date(now.getTime() - 3 * 86400000), // -3 days (EXPIRED)
          quantity: 1,
          unit: 'cup',
          storageLocation: 'Refrigerator',
          imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80',
          status: 'EXPIRED',
          remainingDays: -3
        }
      ];

      const inserted = await Product.insertMany(demoProducts);
      console.log(`[Seed Service]: ${inserted.length} demo products created.`);

      // Seed Notifications
      await Notification.insertMany([
        {
          userId: demoUser._id,
          productId: inserted[0]._id,
          title: '⚠️ Expiry Alert: Milk',
          message: 'Your Fresh Whole Milk will expire in 2 days. Please consume it soon!',
          priority: 'CRITICAL',
          isRead: false
        },
        {
          userId: demoUser._id,
          productId: inserted[1]._id,
          title: '⚠️ Expiry Alert: Bread',
          message: 'Your Whole Wheat Bread will expire in 3 days.',
          priority: 'HIGH',
          isRead: false
        },
        {
          userId: demoUser._id,
          productId: inserted[7]._id,
          title: '🚨 Item Expired: Greek Yogurt',
          message: 'Greek Fruit Yogurt passed its expiry date 3 days ago.',
          priority: 'CRITICAL',
          isRead: false
        }
      ]);
    }
  } catch (err) {
    console.error(`[Seed Service Error]: ${err.message}`);
  }
};
