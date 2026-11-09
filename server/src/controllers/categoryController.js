import { Category, StorageLocation } from '../models/Category.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    // Seed categories if database is fresh
    if (categories.length === 0) {
      const defaultCategories = [
        { name: 'FOOD', icon: 'Apple', subcategories: ['Dairy', 'Fruits', 'Vegetables', 'Packaged Food', 'Bakery', 'Snacks', 'Beverages'], recommendedLocation: 'Refrigerator' },
        { name: 'MEDICINE', icon: 'Pill', subcategories: ['Tablets', 'Capsules', 'Syrups', 'First Aid'], recommendedLocation: 'Medicine Box' },
        { name: 'PERSONAL CARE', icon: 'Sparkles', subcategories: ['Cosmetics', 'Skincare', 'Haircare', 'Oral Care'], recommendedLocation: 'Bathroom' },
        { name: 'SANITARY PRODUCTS', icon: 'Shield', subcategories: ['Hygiene', 'Pads', 'Wipes'], recommendedLocation: 'Bathroom' },
        { name: 'CLEANING PRODUCTS', icon: 'Sparkles', subcategories: ['Detergents', 'Disinfectants', 'Dishwashing'], recommendedLocation: 'Cleaning Storage' },
        { name: 'GROCERIES', icon: 'ShoppingBag', subcategories: ['Spices', 'Grains', 'Oils'], recommendedLocation: 'Grocery Shelf' },
        { name: 'BABY PRODUCTS', icon: 'Heart', subcategories: ['Baby Food', 'Diapers', 'Care'], recommendedLocation: 'Storeroom' },
        { name: 'OTHER', icon: 'Package', subcategories: ['General', 'Misc'], recommendedLocation: 'Kitchen Cupboard' }
      ];

      const created = await Category.insertMany(defaultCategories);
      return res.json({ success: true, categories: created });
    }

    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStorageLocations = async (req, res) => {
  try {
    const userId = req.user._id;
    const locations = await StorageLocation.find({ userId }).sort({ name: 1 });

    const defaults = [
      'Refrigerator', 'Freezer', 'Kitchen Cupboard', 'Grocery Shelf', 
      'Storeroom', 'Medicine Box', 'Bathroom', 'Cosmetic Shelf', 'Cleaning Storage', 'Other'
    ];

    const customNames = locations.map(l => l.name);
    const combined = Array.from(new Set([...defaults, ...customNames]));

    res.json({ success: true, storageLocations: combined });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createStorageLocation = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Location name is required.' });

    const location = await StorageLocation.create({
      userId: req.user._id,
      name
    });

    res.status(201).json({ success: true, location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
