import { Product } from '../models/Product.js';
import { recommendationAgent } from '../agents/recommendationAgent.js';

export const handleChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message payload is required.' });
    }

    const queryLower = message.toLowerCase().trim();
    const products = await Product.find({ userId, isArchived: false });

    // Status evaluation
    const evaluated = products.map(p => {
      const { status, remainingDays } = Product.calculateStatus(p.expiryDate);
      p.status = status;
      p.remainingDays = remainingDays;
      return p;
    });

    let reply = '';
    let action = 'INFO';
    let suggestedData = null;

    if (queryLower.includes('expiring soon') || queryLower.includes('urgent') || queryLower.includes('soon')) {
      const expiring = evaluated.filter(p => p.status === 'EXPIRING_SOON' || p.status === 'URGENT' || p.status === 'EXPIRES_TODAY');
      if (expiring.length === 0) {
        reply = "🎉 Great news! None of your stored products are expiring soon. Everything in your inventory is fresh and safe!";
      } else {
        const list = expiring.map(p => `• **${p.productName}** (${p.category}) - ${p.remainingDays <= 0 ? 'Expires Today' : `Expires in ${p.remainingDays} days`}`).join('\n');
        reply = `You have **${expiring.length}** item(s) approaching expiry:\n\n${list}\n\nI recommend using these items first to minimize waste.`;
        suggestedData = expiring;
      }
    } else if (queryLower.includes('expired')) {
      const expired = evaluated.filter(p => p.status === 'EXPIRED');
      if (expired.length === 0) {
        reply = "✅ You have no expired items in your SmartShelf inventory!";
      } else {
        const list = expired.map(p => `• **${p.productName}** (${p.category}) - Expired on ${new Date(p.expiryDate).toLocaleDateString()}`).join('\n');
        reply = `⚠️ You currently have **${expired.length}** expired item(s):\n\n${list}\n\nWould you like me to suggest adding these to your Smart Shopping List?`;
        suggestedData = expired;
        action = 'EXPIRED_ITEMS';
      }
    } else if (queryLower.includes('medicine') || queryLower.includes('drug') || queryLower.includes('pill')) {
      const medicines = evaluated.filter(p => p.category === 'MEDICINE');
      if (medicines.length === 0) {
        reply = "You do not currently have any medicine products stored in your inventory.";
      } else {
        const list = medicines.map(p => `• **${p.productName}** (${p.subcategory}) - Location: ${p.storageLocation} (Exp: ${new Date(p.expiryDate).toLocaleDateString()})`).join('\n');
        reply = `🏥 You have **${medicines.length}** medicine product(s):\n\n${list}`;
        suggestedData = medicines;
      }
    } else if (queryLower.includes('cook') || queryLower.includes('recipe') || queryLower.includes('use first') || queryLower.includes('eat')) {
      const foodExpiring = evaluated.filter(p => p.category === 'FOOD' && p.remainingDays <= 10 && p.remainingDays >= 0);
      const recs = recommendationAgent.generateRecommendations(foodExpiring);
      if (recs.length > 0) {
        reply = `💡 **Chef & Usage Recommendation**:\n\n${recs[0].message}`;
      } else {
        reply = "You have plenty of time on all stored food items! Pick whichever ingredients you prefer for your meal today.";
      }
    } else if (queryLower.includes('category') || queryLower.includes('most')) {
      const catCounts = {};
      evaluated.forEach(p => {
        catCounts[p.category] = (catCounts[p.category] || 0) + 1;
      });
      const sorted = Object.entries(catCounts).sort((a, b) => b[1] - a[1]);
      if (sorted.length === 0) {
        reply = "Your inventory is currently empty. Scan or add products to view category breakdowns!";
      } else {
        const top = sorted[0];
        const breakdown = sorted.map(([c, cnt]) => `• **${c}**: ${cnt} item(s)`).join('\n');
        reply = `📊 Your top category is **${top[0]}** with ${top[1]} product(s).\n\nCategory Distribution:\n${breakdown}`;
      }
    } else {
      reply = `I am your **SmartShelf AI Assistant**! 🤖\n\nYou currently have **${evaluated.length}** total item(s) stored in your inventory across Refrigerator, Medicine Box, Pantry, and other storage locations.\n\nTry asking me:\n• *"What is expiring soon?"*\n• *"What should I cook first?"*\n• *"How many medicines do I have?"*\n• *"Show expired products."*`;
    }

    res.json({
      success: true,
      reply,
      action,
      suggestedData,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
