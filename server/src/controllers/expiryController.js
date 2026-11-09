import { Product } from '../models/Product.js';
import { orchestratorAgent } from '../agents/orchestratorAgent.js';
import { recommendationAgent } from '../agents/recommendationAgent.js';

export const getExpiringSoon = async (req, res) => {
  try {
    const products = await Product.find({
      userId: req.user._id,
      isArchived: false,
      status: 'EXPIRING_SOON'
    }).sort({ expiryDate: 1 });

    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUrgent = async (req, res) => {
  try {
    const products = await Product.find({
      userId: req.user._id,
      isArchived: false,
      status: { $in: ['URGENT', 'EXPIRES_TODAY'] }
    }).sort({ expiryDate: 1 });

    const recommendations = recommendationAgent.generateRecommendations(products);

    res.json({ success: true, count: products.length, products, recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getExpired = async (req, res) => {
  try {
    const products = await Product.find({
      userId: req.user._id,
      isArchived: false,
      status: 'EXPIRED'
    }).sort({ expiryDate: 1 });

    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const runExpiryAgent = async (req, res) => {
  try {
    const scanResult = await orchestratorAgent.runExpiryMonitoringPipeline(req.user._id);

    res.json({
      success: true,
      message: 'Expiry Monitoring Agent executed successfully!',
      audit: scanResult
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
