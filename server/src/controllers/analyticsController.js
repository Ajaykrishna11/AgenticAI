import { Product } from '../models/Product.js';
import { ProductUsage } from '../models/ProductUsage.js';

export const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const products = await Product.find({ userId, isArchived: false });

    let safeCount = 0;
    let expiringSoonCount = 0;
    let urgentCount = 0;
    let expiresTodayCount = 0;
    let expiredCount = 0;

    const categoryMap = {};

    products.forEach(p => {
      const { status } = Product.calculateStatus(p.expiryDate);
      if (status === 'SAFE') safeCount++;
      else if (status === 'EXPIRING_SOON') expiringSoonCount++;
      else if (status === 'URGENT') urgentCount++;
      else if (status === 'EXPIRES_TODAY') expiresTodayCount++;
      else if (status === 'EXPIRED') expiredCount++;

      const cat = p.category || 'OTHER';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const totalProducts = products.length;
    const estimatedWasteRate = totalProducts > 0 ? ((expiredCount / totalProducts) * 100).toFixed(1) : '0.0';

    // Recent products
    const recentProducts = await Product.find({ userId, isArchived: false })
      .sort({ createdAt: -1 })
      .limit(5);

    // Usage counts
    const usageCount = await ProductUsage.countDocuments({ userId });

    res.json({
      success: true,
      stats: {
        totalProducts,
        safeCount,
        expiringSoonCount,
        urgentCount: urgentCount + expiresTodayCount,
        expiredCount,
        usedCount: usageCount,
        wasteRate: parseFloat(estimatedWasteRate)
      },
      recentProducts,
      categoryDistribution: Object.entries(categoryMap).map(([name, count]) => ({ name, count }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategoryAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const products = await Product.find({ userId, isArchived: false });

    const categories = {};
    products.forEach(p => {
      const cat = p.category || 'OTHER';
      if (!categories[cat]) {
        categories[cat] = { total: 0, expired: 0, safe: 0 };
      }
      categories[cat].total += 1;
      const { status } = Product.calculateStatus(p.expiryDate);
      if (status === 'EXPIRED') categories[cat].expired += 1;
      else categories[cat].safe += 1;
    });

    const data = Object.entries(categories).map(([name, val]) => ({
      category: name,
      total: val.total,
      expired: val.expired,
      safe: val.safe
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMonthlyAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const products = await Product.find({ userId });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = {};

    // Pre-populate last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthlyData[key] = { month: key, added: 0, expired: 0 };
    }

    products.forEach(p => {
      const addedDate = new Date(p.createdAt);
      const addedKey = `${monthNames[addedDate.getMonth()]} ${addedDate.getFullYear()}`;
      if (monthlyData[addedKey]) {
        monthlyData[addedKey].added += 1;
      }

      const expDate = new Date(p.expiryDate);
      if (p.status === 'EXPIRED') {
        const expKey = `${monthNames[expDate.getMonth()]} ${expDate.getFullYear()}`;
        if (monthlyData[expKey]) {
          monthlyData[expKey].expired += 1;
        }
      }
    });

    res.json({
      success: true,
      monthlyTrend: Object.values(monthlyData)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
