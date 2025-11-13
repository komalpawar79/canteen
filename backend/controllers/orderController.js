import mongoose from 'mongoose';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';

const createOrder = async (req, res) => {
  try {
    const { canteenId, items, orderMode, paymentMethod, specialRequests, deliveryAddress, tableNumber } = req.body;
    const userId = req.userId;

    // Validate required fields
    if (!canteenId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields: canteenId or items' });
    }

    let totalAmount = 0;
    let tax = 5; // 5% tax

    console.log('Creating order with items:', JSON.stringify(items, null, 2));

    // Validate and calculate total for each item
    const validatedItems = [];
    for (let item of items) {
      const { menuItem, quantity } = item;
      
      // Validate menuItem ID format
      if (!menuItem || String(menuItem).trim().length === 0) {
        console.error('Invalid menuItem ID:', menuItem);
        return res.status(400).json({ error: `Invalid menu item ID: "${menuItem}"` });
      }

      try {
        // Ensure menuItem is a valid ObjectId string
        const menuItemId = String(menuItem).trim();
        
        // Try to validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(menuItemId)) {
          console.error('Not a valid ObjectId:', menuItemId);
          return res.status(400).json({ error: `Invalid MongoDB ObjectId format: "${menuItemId}". Expected 24-character hex string.` });
        }

        const menuItemDoc = await MenuItem.findById(menuItemId);
        if (!menuItemDoc) {
          console.error('Menu item not found in DB:', menuItemId);
          return res.status(404).json({ error: `Menu item not found: ${menuItemId}` });
        }
        
        totalAmount += menuItemDoc.price * quantity;
        validatedItems.push({
          menuItem: menuItemDoc._id,
          quantity,
          price: menuItemDoc.price,
          specialInstructions: item.specialInstructions || ''
        });
      } catch (err) {
        console.error('Error validating menu item:', menuItem, err.message);
        return res.status(400).json({ error: `Error validating menu item "${menuItem}": ${err.message}` });
      }
    }

    const discount = 0;
    const finalAmount = totalAmount + (totalAmount * tax / 100) - discount;

    const order = new Order({
      user: userId,
      canteen: canteenId,
      items: validatedItems,
      orderMode,
      totalAmount,
      discount,
      tax: (totalAmount * tax / 100),
      finalAmount,
      paymentMethod,
      specialRequests,
      deliveryAddress,
      tableNumber,
      estimatedTime: 30
    });

    await order.save();
    await order.populate('user canteen items.menuItem');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user canteen items.menuItem');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('canteen items.menuItem')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user canteen items.menuItem');

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        feedback: { 
          rating, 
          comment, 
          submittedAt: new Date() 
        } 
      },
      { new: true }
    );

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  submitFeedback,
};
