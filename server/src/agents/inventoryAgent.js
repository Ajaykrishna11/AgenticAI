import { Product } from '../models/Product.js';

export const inventoryAgent = {
  name: 'INVENTORY_AGENT',

  async checkExistingInventory(userId, newProductData) {
    if (!userId) return { duplicateFound: false };

    const { productName, brand } = newProductData;
    if (!productName) return { duplicateFound: false };

    // Search case-insensitive match for product name and brand for user
    const existing = await Product.findOne({
      userId,
      isArchived: false,
      productName: { $regex: new RegExp(`^${productName.trim()}$`, 'i') }
    });

    if (existing) {
      return {
        duplicateFound: true,
        existingProduct: existing,
        suggestedAction: 'UPDATE_QUANTITY',
        message: `Similar product "${existing.productName}" already exists in inventory (Current Qty: ${existing.quantity}). Would you like to update quantity instead of creating a duplicate entry?`
      };
    }

    return {
      duplicateFound: false,
      suggestedAction: 'CREATE_NEW'
    };
  }
};
