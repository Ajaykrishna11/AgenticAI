import { ShoppingListItem } from '../models/ShoppingListItem.js';

export const getShoppingList = async (req, res) => {
  try {
    const items = await ShoppingListItem.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const suggested = items.filter(i => i.suggestedByAi && i.status === 'PENDING');
    const manual = items.filter(i => !i.suggestedByAi && i.status === 'PENDING');
    const purchased = items.filter(i => i.status === 'PURCHASED');

    res.json({
      success: true,
      counts: {
        total: items.length,
        suggested: suggested.length,
        manual: manual.length,
        purchased: purchased.length
      },
      sections: {
        suggestedItems: suggested,
        manualItems: manual,
        purchasedItems: purchased
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addItem = async (req, res) => {
  try {
    const { itemName, quantity = 1, unit = 'pcs', category = 'General', productId = null } = req.body;
    if (!itemName) return res.status(400).json({ success: false, message: 'Item name is required.' });

    const item = await ShoppingListItem.create({
      userId: req.user._id,
      productId,
      itemName,
      quantity,
      unit,
      category,
      suggestedByAi: false
    });

    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { status, quantity } = req.body;
    const item = await ShoppingListItem.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    if (status) item.status = status;
    if (quantity !== undefined) item.quantity = quantity;

    await item.save();

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    await ShoppingListItem.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true, message: 'Item removed from shopping list.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
