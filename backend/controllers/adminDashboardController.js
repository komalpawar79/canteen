import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import User from '../models/User.js';
import Canteen from '../models/Canteen.js';
import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';
import Settlement from '../models/Settlement.js';
import Notification from '../models/Notification.js';
import SystemConfig from '../models/SystemConfig.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import AdminSettings from '../models/AdminSettings.js';
import ApiResponse from '../utils/apiResponse.js';
import { Parser } from 'json2csv';

// ==================== 1. DASHBOARD OVERVIEW ====================

export const getAdminStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [totalUsers, activeCanteens, ordersToday, revenueData, monthRevenue] = await Promise.all([
      User.countDocuments(),
      Canteen.countDocuments({ isActive: true }),
      Order.countDocuments({ createdAt: { $gte: today }, status: { $ne: 'cancelled' } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: today }, paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth }, paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } }
      ])
    ]);

    const avgOrderValue = ordersToday > 0 ? (revenueData[0]?.total || 0) / ordersToday : 0;

    res.json(new ApiResponse(200, {
      totalUsers,
      activeCanteens,
      ordersToday,
      revenueToday: revenueData[0]?.total || 0,
      revenueMonth: monthRevenue[0]?.total || 0,
      avgOrderValue: Math.round(avgOrderValue)
    }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const getTopSellingItems = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const topItems = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      { $group: { _id: '$items.menuItem', totalSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'menuitems', localField: '_id', foreignField: '_id', as: 'item' } },
      { $unwind: '$item' },
      { $project: { name: '$item.name', totalSold: 1, revenue: 1, category: '$item.category' } }
    ]);

    res.json(new ApiResponse(200, { topItems }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const getActiveCanteens = async (req, res) => {
  try {
    const canteens = await Canteen.find({ isActive: true })
      .populate('manager', 'name email')
      .select('name location avgRating totalRatings')
      .limit(10);

    res.json(new ApiResponse(200, { canteens }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const getUserGrowth = async (req, res) => {
  try {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    const growth = await Promise.all(
      last7Days.map(async (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        const count = await User.countDocuments({ createdAt: { $gte: date, $lt: nextDay } });
        return { date: date.toISOString().split('T')[0], users: count };
      })
    );

    res.json(new ApiResponse(200, { growth }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const getOrderVolumeChart = async (req, res) => {
  try {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    const volume = await Promise.all(
      last7Days.map(async (date) => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        const count = await Order.countDocuments({ createdAt: { $gte: date, $lt: nextDay }, status: { $ne: 'cancelled' } });
        return { date: date.toISOString().split('T')[0], orders: count };
      })
    );

    res.json(new ApiResponse(200, { volume }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const getCategorySales = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      { $lookup: { from: 'menuitems', localField: 'items.menuItem', foreignField: '_id', as: 'item' } },
      { $unwind: '$item' },
      { $group: { _id: '$item.category', value: { $sum: '$items.quantity' } } },
      { $project: { name: '$_id', value: 1, _id: 0 } }
    ]);

    res.json(new ApiResponse(200, { sales }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// ==================== 2. USER MANAGEMENT ====================

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search, status } = req.query;
    const query = {};
    
    // ✅ FILTER: Only show admin-created users (exclude regular students)
    // Admin-created roles: canteen_manager, staff, faculty, admin
    // Regular signup users: student (these are self-registered and shouldn't appear here)
    query.role = { $in: ['canteen_manager', 'staff', 'faculty', 'admin'] };
    
    if (role) query.role = role; // Override if specific role is requested
    if (status) query.isActive = status === 'active';
    if (search) query.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
      { universityId: new RegExp(search, 'i') }
    ];

    const users = await User.find(query)
      .select('-password')
      .populate('canteenAssigned', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json(new ApiResponse(200, { users, total, page: parseInt(page), pages: Math.ceil(total / limit) }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, universityId, department, canteenAssigned } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(new ApiResponse(400, null, 'Email already exists'));
    }

    // For canteen_manager and admin, auto-generate universityId if not provided
    let finalUniversityId = universityId;
    if ((role === 'canteen_manager' || role === 'admin') && !universityId) {
      finalUniversityId = `${role.toUpperCase()}-${Date.now()}`;
    }

    // Check if universityId already exists (only if provided)
    if (finalUniversityId) {
      const existingId = await User.findOne({ universityId: finalUniversityId });
      if (existingId) {
        return res.status(400).json(new ApiResponse(400, null, 'University ID already exists'));
      }
    }

    const userData = {
      name,
      email,
      password,
      phone,
      role: role || 'student',
      universityId: finalUniversityId,
      department,
      isVerified: true,
      isActive: true
    };

    // If canteen manager, assign canteen
    if (role === 'canteen_manager' && canteenAssigned) {
      userData.canteenAssigned = canteenAssigned;
    }

    const user = new User(userData);
    await user.save();

    const userResponse = await User.findById(user._id).select('-password').populate('canteenAssigned', 'name');
    res.status(201).json(new ApiResponse(201, { user: userResponse }, 'User created successfully'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(id, { isActive }, { new: true }).select('-password');
    res.json(new ApiResponse(200, { user }, 'User status updated'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    res.json(new ApiResponse(200, { user }, 'User role updated'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const exportUsers = async (req, res) => {
  try {
    const users = await User.find().select('name email role universityId isActive createdAt');
    const fields = ['name', 'email', 'role', 'universityId', 'isActive', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(users);

    res.header('Content-Type', 'text/csv');
    res.attachment('users.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// ==================== 3. CANTEEN MANAGEMENT ====================

export const createCanteen = async (req, res) => {
  try {
    console.log('Creating canteen with data:', req.body);
    const canteen = new Canteen(req.body);
    await canteen.save();
    console.log('Canteen created:', canteen._id);
    res.status(201).json(new ApiResponse(201, { canteen }, 'Canteen created'));
  } catch (error) {
    console.error('Error creating canteen:', error);
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const updateCanteen = async (req, res) => {
  try {
    const { id } = req.params;
    const canteen = await Canteen.findByIdAndUpdate(id, req.body, { new: true });
    res.json(new ApiResponse(200, { canteen }, 'Canteen updated'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const updateCanteenStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const canteen = await Canteen.findByIdAndUpdate(id, { isActive }, { new: true });
    res.json(new ApiResponse(200, { canteen }, 'Canteen status updated'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const getAllCanteens = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const canteens = await Canteen.find()
      .populate('manager', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Canteen.countDocuments();
    res.json(new ApiResponse(200, { canteens, total, page: parseInt(page), pages: Math.ceil(total / limit) }));
  } catch (error) {
    console.error('Error fetching canteens:', error);
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const deleteCanteen = async (req, res) => {
  try {
    const { id } = req.params;
    const canteen = await Canteen.findByIdAndDelete(id);
    
    if (!canteen) {
      return res.status(404).json(new ApiResponse(404, null, 'Canteen not found'));
    }

    res.json(new ApiResponse(200, null, 'Canteen deleted successfully'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// ==================== 4. CATEGORY & MENU MANAGEMENT ====================

export const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(new ApiResponse(201, { category }, 'Category created'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
    res.json(new ApiResponse(200, { category }, 'Category updated'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json(new ApiResponse(200, null, 'Category deleted'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1 });
    res.json(new ApiResponse(200, { categories }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    const populatedItem = await MenuItem.findById(item._id).populate('canteen', 'name');
    res.status(201).json(new ApiResponse(201, { item: populatedItem }, 'Menu item created'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const getAllMenuItems = async (req, res) => {
  try {
    const { page = 1, limit = 20, canteen, category } = req.query;
    const query = {};
    if (canteen) query.canteen = canteen;
    if (category) query.category = category;

    const items = await MenuItem.find(query)
      .populate('canteen', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await MenuItem.countDocuments(query);
    res.json(new ApiResponse(200, { items, total, page: parseInt(page), pages: Math.ceil(total / limit) }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByIdAndUpdate(id, req.body, { new: true }).populate('canteen', 'name');
    res.json(new ApiResponse(200, { item }, 'Menu item updated'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    await MenuItem.findByIdAndDelete(id);
    res.json(new ApiResponse(200, null, 'Menu item deleted'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// ==================== 5. ORDERS MANAGEMENT ====================

export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, canteen, status, paymentMethod, startDate, endDate } = req.query;
    const query = {};
    
    if (canteen) query.canteen = canteen;
    if (status) query.status = status;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('canteen', 'name')
      .populate('items.menuItem', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);
    res.json(new ApiResponse(200, { orders, total, page: parseInt(page), pages: Math.ceil(total / limit) }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true })
      .populate('user canteen items.menuItem');
    
    res.json(new ApiResponse(200, { order }, 'Order status updated'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const refundOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) return res.status(404).json(new ApiResponse(404, null, 'Order not found'));
    if (order.paymentStatus === 'refunded') return res.status(400).json(new ApiResponse(400, null, 'Already refunded'));

    order.paymentStatus = 'refunded';
    order.status = 'cancelled';
    await order.save();

    const transaction = new Transaction({
      user: order.user,
      order: order._id,
      type: 'refund',
      amount: order.finalAmount,
      status: 'completed',
      description: 'Order refund'
    });
    await transaction.save();

    res.json(new ApiResponse(200, { order }, 'Order refunded'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// ==================== 6. PAYMENT & TRANSACTIONS ====================

export const getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const transactions = await Transaction.find(query)
      .populate('user', 'name email')
      .populate('order', 'finalAmount')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Transaction.countDocuments(query);
    res.json(new ApiResponse(200, { transactions, total, page: parseInt(page), pages: Math.ceil(total / limit) }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const getAllSettlements = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status) query.status = status;

    const settlements = await Settlement.find(query)
      .populate('canteen', 'name')
      .populate('approvedBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Settlement.countDocuments(query);
    res.json(new ApiResponse(200, { settlements, total, page: parseInt(page), pages: Math.ceil(total / limit) }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const approveSettlement = async (req, res) => {
  try {
    const { id } = req.params;
    const settlement = await Settlement.findByIdAndUpdate(
      id,
      { status: 'approved', approvedBy: req.user._id },
      { new: true }
    );
    res.json(new ApiResponse(200, { settlement }, 'Settlement approved'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// ==================== 7. REPORTS & DOWNLOADS ====================

export const generateReport = async (req, res) => {
  try {
    const { type, format = 'json', startDate, endDate } = req.query;
    let data = [];

    const dateQuery = {};
    if (startDate) dateQuery.$gte = new Date(startDate);
    if (endDate) dateQuery.$lte = new Date(endDate);

    switch (type) {
      case 'revenue':
        data = await Order.aggregate([
          { $match: { paymentStatus: 'completed', ...(Object.keys(dateQuery).length && { createdAt: dateQuery }) } },
          { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$finalAmount' }, orders: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]);
        break;

      case 'canteen-performance':
        data = await Order.aggregate([
          { $match: { status: { $ne: 'cancelled' }, ...(Object.keys(dateQuery).length && { createdAt: dateQuery }) } },
          { $group: { _id: '$canteen', totalOrders: { $sum: 1 }, totalRevenue: { $sum: '$finalAmount' } } },
          { $lookup: { from: 'canteens', localField: '_id', foreignField: '_id', as: 'canteen' } },
          { $unwind: '$canteen' },
          { $project: { name: '$canteen.name', totalOrders: 1, totalRevenue: 1 } }
        ]);
        break;

      case 'user-activity':
        data = await Order.aggregate([
          { $match: { ...(Object.keys(dateQuery).length && { createdAt: dateQuery }) } },
          { $group: { _id: '$user', totalOrders: { $sum: 1 }, totalSpent: { $sum: '$finalAmount' } } },
          { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
          { $unwind: '$user' },
          { $project: { name: '$user.name', email: '$user.email', totalOrders: 1, totalSpent: 1 } },
          { $sort: { totalOrders: -1 } },
          { $limit: 100 }
        ]);
        break;

      case 'item-sales':
        data = await Order.aggregate([
          { $match: { status: { $ne: 'cancelled' }, ...(Object.keys(dateQuery).length && { createdAt: dateQuery }) } },
          { $unwind: '$items' },
          { $group: { _id: '$items.menuItem', totalSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
          { $lookup: { from: 'menuitems', localField: '_id', foreignField: '_id', as: 'item' } },
          { $unwind: '$item' },
          { $project: { name: '$item.name', category: '$item.category', totalSold: 1, revenue: 1 } },
          { $sort: { totalSold: -1 } }
        ]);
        break;

      default:
        return res.status(400).json(new ApiResponse(400, null, 'Invalid report type'));
    }

    if (format === 'csv') {
      const parser = new Parser();
      const csv = parser.parse(data);
      res.header('Content-Type', 'text/csv');
      res.attachment(`${type}-report.csv`);
      return res.send(csv);
    }

    res.json(new ApiResponse(200, { data, type }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// ==================== 8. SUBSCRIPTION PLANS ====================

export const createPlan = async (req, res) => {
  try {
    const plan = new SubscriptionPlan(req.body);
    await plan.save();
    res.status(201).json(new ApiResponse(201, { plan }, 'Plan created'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await SubscriptionPlan.findByIdAndUpdate(id, req.body, { new: true });
    res.json(new ApiResponse(200, { plan }, 'Plan updated'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    await SubscriptionPlan.findByIdAndDelete(id);
    res.json(new ApiResponse(200, null, 'Plan deleted'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const getAllPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.json(new ApiResponse(200, { plans }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// ==================== 9. NOTIFICATIONS ====================

export const sendNotification = async (req, res) => {
  try {
    const { type, recipients, subject, message, template } = req.body;

    const notification = new Notification({
      type,
      recipients,
      subject,
      message,
      template,
      sentBy: req.user._id,
      status: 'sent',
      sentAt: new Date()
    });

    await notification.save();
    res.status(201).json(new ApiResponse(201, { notification }, 'Notification sent'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const notifications = await Notification.find()
      .populate('sentBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Notification.countDocuments();
    res.json(new ApiResponse(200, { notifications, total, page: parseInt(page), pages: Math.ceil(total / limit) }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// ==================== 9.5. ADMIN SETTINGS ====================

export const getAdminSettings = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    
    // Create default settings if not found
    if (!settings) {
      settings = new AdminSettings();
      await settings.save();
    }

    res.json(new ApiResponse(200, { settings }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const updateAdminSettings = async (req, res) => {
  try {
    const { adminProfile, restaurantSettings, operatingHours, menuSettings, healthStatus, preferences } = req.body;
    
    let settings = await AdminSettings.findOne();
    
    if (!settings) {
      settings = new AdminSettings();
    }

    // Update fields
    if (adminProfile) settings.adminProfile = { ...settings.adminProfile, ...adminProfile };
    if (restaurantSettings) settings.restaurantSettings = { ...settings.restaurantSettings, ...restaurantSettings };
    if (operatingHours) settings.operatingHours = { ...settings.operatingHours, ...operatingHours };
    if (menuSettings) settings.menuSettings = { ...settings.menuSettings, ...menuSettings };
    if (healthStatus) settings.healthStatus = { ...settings.healthStatus, ...healthStatus, lastChecked: new Date() };
    if (preferences) settings.preferences = { ...settings.preferences, ...preferences };

    settings.updatedBy = req.user._id;
    await settings.save();

    res.json(new ApiResponse(200, { settings }, 'Settings updated successfully'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const getRestaurantInfo = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    
    if (!settings) {
      settings = new AdminSettings();
      await settings.save();
    }

    res.json(new ApiResponse(200, { 
      name: settings.restaurantSettings.name,
      address: settings.restaurantSettings.address,
      contactNumber: settings.restaurantSettings.contactNumber,
      isOpen: settings.restaurantSettings.isOpen
    }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const updateRestaurantInfo = async (req, res) => {
  try {
    const { name, address, contactNumber, isOpen } = req.body;
    
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = new AdminSettings();
    }

    settings.restaurantSettings = {
      ...settings.restaurantSettings,
      name: name || settings.restaurantSettings.name,
      address: address || settings.restaurantSettings.address,
      contactNumber: contactNumber || settings.restaurantSettings.contactNumber,
      isOpen: isOpen !== undefined ? isOpen : settings.restaurantSettings.isOpen
    };

    await settings.save();

    res.json(new ApiResponse(200, { restaurantSettings: settings.restaurantSettings }, 'Restaurant info updated'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const getHealthStatus = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    
    if (!settings) {
      settings = new AdminSettings();
      await settings.save();
    }

    res.json(new ApiResponse(200, { healthStatus: settings.healthStatus }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const updateHealthStatus = async (req, res) => {
  try {
    const { status, maintenanceMode, maintenanceMessage, healthNotes } = req.body;
    
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = new AdminSettings();
    }

    settings.healthStatus = {
      ...settings.healthStatus,
      status: status || settings.healthStatus.status,
      maintenanceMode: maintenanceMode !== undefined ? maintenanceMode : settings.healthStatus.maintenanceMode,
      maintenanceMessage: maintenanceMessage || settings.healthStatus.maintenanceMessage,
      healthNotes: healthNotes || settings.healthStatus.healthNotes,
      lastChecked: new Date()
    };

    await settings.save();

    res.json(new ApiResponse(200, { healthStatus: settings.healthStatus }, 'Health status updated'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// ==================== 10. SYSTEM CONFIGURATION ====================

export const getSystemConfig = async (req, res) => {
  try {
    const configs = await SystemConfig.find();
    res.json(new ApiResponse(200, { configs }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const updateSystemConfig = async (req, res) => {
  try {
    const { key, value, category, description } = req.body;
    
    const config = await SystemConfig.findOneAndUpdate(
      { key },
      { value, category, description },
      { new: true, upsert: true }
    );

    res.json(new ApiResponse(200, { config }, 'Config updated'));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

// ==================== 11. PLATFORM HEALTH ====================

export const getSystemHealth = async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date(),
      database: 'connected',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    };

    res.json(new ApiResponse(200, { health }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export const getPerformanceMetrics = async (req, res) => {
  try {
    const [totalOrders, avgResponseTime] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { actualTime: { $exists: true } } },
        { $group: { _id: null, avg: { $avg: '$actualTime' } } }
      ])
    ]);

    const metrics = {
      totalOrders,
      avgResponseTime: avgResponseTime[0]?.avg || 0,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024
    };

    res.json(new ApiResponse(200, { metrics }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, null, error.message));
  }
};

export default {
  getAdminStats,
  getTopSellingItems,
  getActiveCanteens,
  getUserGrowth,
  getOrderVolumeChart,
  getCategorySales,
  getAllUsers,
  createUser,
  updateUserStatus,
  updateUserRole,
  exportUsers,
  createCanteen,
  updateCanteen,
  updateCanteenStatus,
  deleteCanteen,
  getAllCanteens,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  getAllOrders,
  updateOrderStatus,
  refundOrder,
  getAllTransactions,
  getAllSettlements,
  approveSettlement,
  generateReport,
  createPlan,
  updatePlan,
  deletePlan,
  getAllPlans,
  sendNotification,
  getNotifications,
  getAdminSettings,
  updateAdminSettings,
  getRestaurantInfo,
  updateRestaurantInfo,
  getHealthStatus,
  updateHealthStatus,
  getSystemConfig,
  updateSystemConfig,
  getSystemHealth,
  getPerformanceMetrics
};
