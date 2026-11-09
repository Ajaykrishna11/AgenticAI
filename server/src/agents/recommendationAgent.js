import { ShoppingListItem } from '../models/ShoppingListItem.js';

export const recommendationAgent = {
  name: 'RECOMMENDATION_AGENT',

  /**
   * Generates tailored recommendations for a collection of expiring products
   */
  generateRecommendations(products = []) {
    const foodItems = products.filter(p => p.category === 'FOOD' && p.remainingDays >= 0 && p.remainingDays <= 7);
    const medItems = products.filter(p => p.category === 'MEDICINE' && p.remainingDays <= 10);
    const expiredItems = products.filter(p => p.status === 'EXPIRED');

    const recommendations = [];

    // Food Recipe / Usage Ideas
    if (foodItems.length > 0) {
      const names = foodItems.map(f => f.productName).join(', ');
      let recipeIdea = "Consider using these ingredients in your next meal to reduce food waste.";
      
      const lowerNames = names.toLowerCase();
      if (lowerNames.includes('milk') && lowerNames.includes('bread')) {
        recipeIdea = "Idea: Combine milk, bread, and eggs/cheese to prepare French Toast or a Breakfast Casserole.";
      } else if (lowerNames.includes('milk') || lowerNames.includes('cheese')) {
        recipeIdea = "Idea: Prepare a creamy pasta sauce, smoothie, or hot beverage before dairy expires.";
      } else if (lowerNames.includes('fruit') || lowerNames.includes('apple') || lowerNames.includes('banana')) {
        recipeIdea = "Idea: Blend expiring fruits into a refreshing morning smoothie or fruit salad.";
      }

      recommendations.push({
        type: 'RECIPE_SUGGESTION',
        title: '👨‍🍳 Recipe & Usage Suggestion',
        message: `Expiring soon: ${names}. ${recipeIdea}`,
        priority: 'MEDIUM',
        affectedProducts: foodItems.map(f => f._id)
      });
    }

    // Medicine Safety Reminder
    if (medItems.length > 0) {
      const names = medItems.map(m => m.productName).join(', ');
      recommendations.push({
        type: 'MEDICINE_SAFETY',
        title: '💊 Medical Storage Notice',
        message: `The following medicines are nearing expiry: ${names}. Please check if they are still needed and consult your pharmacist for proper medical disposal guidelines after expiry.`,
        priority: 'HIGH',
        affectedProducts: medItems.map(m => m._id)
      });
    }

    // Expired Items Replenishment Suggestion
    if (expiredItems.length > 0) {
      recommendations.push({
        type: 'SHOPPING_REPLENISHMENT',
        title: '🛒 Shopping List Recommendation',
        message: `You have ${expiredItems.length} expired items (${expiredItems.slice(0, 3).map(e => e.productName).join(', ')}). Click below to add them to your Smart Shopping List.`,
        priority: 'MEDIUM',
        affectedProducts: expiredItems.map(e => e._id)
      });
    }

    return recommendations;
  },

  /**
   * Automatically suggests replenishment to shopping list if product is used up or expired
   */
  async suggestReplenishment(userId, product, reason = 'Product quantity zero or expired') {
    if (!userId || !product) return null;

    const existing = await ShoppingListItem.findOne({
      userId,
      itemName: product.productName,
      status: 'PENDING'
    });

    if (existing) return existing;

    const item = await ShoppingListItem.create({
      userId,
      productId: product._id,
      itemName: product.productName,
      quantity: 1,
      unit: product.unit || 'pcs',
      category: product.category,
      suggestedByAi: true,
      reason,
      status: 'PENDING'
    });

    return item;
  }
};
