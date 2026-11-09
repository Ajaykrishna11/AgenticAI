import { Product } from '../models/Product.js';
import { ProductUsage } from '../models/ProductUsage.js';
import { recommendationAgent } from '../agents/recommendationAgent.js';

export const getProducts = async (req, res) => {
  try {
    const userId = req.user._id;
    const { category, storageLocation, status, search, sortBy } = req.query;

    const filter = { userId, isArchived: false };

    if (category && category !== 'ALL') {
      filter.category = category;
    }

    if (storageLocation && storageLocation !== 'ALL') {
      filter.storageLocation = storageLocation;
    }

    if (status && status !== 'ALL') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOptions = { expiryDate: 1 }; // Default sort by earliest expiring date
    if (sortBy === 'newest') sortOptions = { createdAt: -1 };
    else if (sortBy === 'oldest') sortOptions = { createdAt: 1 };
    else if (sortBy === 'name') sortOptions = { productName: 1 };

    const products = await Product.find(filter).sort(sortOptions);

    // Dynamic status recalculation on fetch to guarantee accuracy
    const updatedProducts = products.map(p => {
      const { status, remainingDays } = Product.calculateStatus(p.expiryDate);
      p.status = status;
      p.remainingDays = remainingDays;
      return p;
    });

    res.json({
      success: true,
      count: updatedProducts.length,
      products: updatedProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.user._id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found or access denied.' });
    }

    const { status, remainingDays } = Product.calculateStatus(product.expiryDate);
    product.status = status;
    product.remainingDays = remainingDays;

    const usages = await ProductUsage.find({ productId: product._id }).sort({ usedAt: -1 });

    res.json({
      success: true,
      product,
      usageHistory: usages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      productName,
      brand,
      category,
      subcategory,
      productType,
      manufacturingDate,
      expiryDate,
      quantity,
      unit,
      storageLocation,
      imageUrl
    } = req.body;

    if (!productName || !expiryDate) {
      return res.status(400).json({ success: false, message: 'Product Name and Expiry Date are required.' });
    }

    const { status, remainingDays } = Product.calculateStatus(expiryDate);

    const product = await Product.create({
      userId,
      productName,
      brand: brand || 'Generic',
      category: category || 'FOOD',
      subcategory: subcategory || 'General',
      productType: productType || 'Household',
      manufacturingDate: manufacturingDate || null,
      expiryDate,
      quantity: quantity || 1,
      unit: unit || 'pcs',
      storageLocation: storageLocation || 'Kitchen Cupboard',
      imageUrl: imageUrl || '',
      status,
      remainingDays
    });

    res.status(201).json({
      success: true,
      message: 'Product successfully added to inventory!',
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.user._id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found or access denied.' });
    }

    const fields = ['productName', 'brand', 'category', 'subcategory', 'productType', 'manufacturingDate', 'expiryDate', 'quantity', 'unit', 'storageLocation', 'imageUrl'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    if (req.body.expiryDate) {
      const { status, remainingDays } = Product.calculateStatus(product.expiryDate);
      product.status = status;
      product.remainingDays = remainingDays;
    }

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully!',
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found or access denied.' });
    }

    res.json({
      success: true,
      message: 'Product removed from inventory.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markProductUsed = async (req, res) => {
  try {
    const { quantityUsed = 1, notes = 'Used item' } = req.body;
    const product = await Product.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const newQty = Math.max(0, product.quantity - quantityUsed);
    product.quantity = newQty;
    await product.save();

    await ProductUsage.create({
      productId: product._id,
      userId: req.user._id,
      quantityUsed,
      notes
    });

    // Check if quantity reached 0 and trigger AI Shopping List suggestion
    if (newQty === 0) {
      await recommendationAgent.suggestReplenishment(req.user._id, product, 'Product quantity depleted to 0');
    }

    res.json({
      success: true,
      message: `Marked ${quantityUsed} as used. Remaining quantity: ${newQty}`,
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ success: false, message: 'Valid non-negative quantity required.' });
    }

    const product = await Product.findOne({ _id: req.params.id, userId: req.user._id });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    product.quantity = quantity;
    await product.save();

    res.json({
      success: true,
      message: `Quantity updated to ${quantity}`,
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
