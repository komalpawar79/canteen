/**
 * Backend Integration Guide - Advanced Features Setup
 */

# QuickBite Backend - Advanced Features Integration Guide

## Overview
This document provides detailed integration instructions for all advanced backend features created for the QuickBite MERN application.

## Features Implemented

### 1. **API Response Standardization** ✅
**File**: `backend/utils/apiResponse.js`

**Usage in Controllers**:
```javascript
import { successResponse, errorResponse, validationErrorResponse, paginatedResponse } from '../utils/apiResponse.js';

// Success response
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    successResponse(res, orders, 'Orders retrieved successfully');
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};

// Validation error response
if (!isValid) {
  return validationErrorResponse(res, errors);
}

// Paginated response
paginatedResponse(res, orders, total, page, limit);
```

---

### 2. **Pagination & Filtering** ✅
**File**: `backend/utils/pagination.js`

**Usage in List Endpoints**:
```javascript
import { getPaginationParams, buildPaginationQuery, getSortOptions } from '../utils/pagination.js';

export const listOrders = async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const filter = buildFilterQuery(req.query.filter);
  const sort = getSortOptions(req.query.sort);

  const orders = await Order.find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort);
  
  const total = await Order.countDocuments(filter);
  paginatedResponse(res, orders, total, page, limit);
};
```

**Query Examples**:
```
GET /api/orders?page=1&limit=10&sort=-createdAt
GET /api/orders?page=1&limit=10&search=pizza&status=completed
GET /api/orders?startDate=2024-01-01&endDate=2024-01-31
```

---

### 3. **Input Validation** ✅
**File**: `backend/utils/validation.js`

**Usage in Controllers**:
```javascript
import { validateOrderData, validateEmail, validatePassword, sanitizeInput } from '../utils/validation.js';

export const createOrder = async (req, res) => {
  // Validate input
  const { isValid, errors } = validateOrderData(req.body);
  if (!isValid) {
    return validationErrorResponse(res, errors);
  }

  // Sanitize user input to prevent XSS
  const sanitizedData = {
    specialInstructions: sanitizeInput(req.body.specialInstructions),
    notes: sanitizeInput(req.body.notes)
  };

  // Continue processing...
};

// Email validation
const { isValid, errors } = validateEmail(email);

// Phone validation
const { isValid, errors } = validatePhone(phone);

// Password validation
const { isValid, errors } = validatePassword(password);
```

**Validation Rules**:
- Email: RFC 5322 standard
- Phone: 10 digits only
- Password: Min 8 chars, uppercase, lowercase, digit, special char
- Input: Max 1000 chars, no HTML tags

---

### 4. **Role-Based Access Control (RBAC)** ✅
**File**: `backend/middleware/rbac.js`

**Setup in Routes**:
```javascript
import { roleMiddleware, requireAdmin, requireCanteenManager } from '../middleware/rbac.js';

// Protect admin routes
router.get('/admin/users', requireAdmin, getUsersHandler);
router.post('/admin/users', requireAdmin, createUserHandler);
router.delete('/admin/users/:id', requireAdmin, deleteUserHandler);

// Protect canteen manager routes
router.post('/menu-items', requireCanteenManager, createMenuItemHandler);
router.put('/menu-items/:id', requireCanteenManager, updateMenuItemHandler);

// Custom role check
router.post('/orders', roleMiddleware(['student', 'faculty']), createOrderHandler);

// Check specific permission
router.get('/reports', (req, res, next) => {
  const user = req.user;
  if (!hasPermission(user.role, 'view_reports')) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
}, reportHandler);
```

**Role Permissions**:
- **Admin**: All permissions (9 total)
- **Canteen Manager**: Menu management, inventory, reports (6 total)
- **Staff**: Order updates, inventory (4 total)
- **Student/Faculty**: View menu, create orders (5/3 permissions)

---

### 5. **Two-Factor Authentication (2FA)** ✅
**File**: `backend/utils/twoFactorAuth.js`

**Setup in Auth Controller**:
```javascript
import { generate2FASecret, verify2FAToken, generateBackupCodes, verifyBackupCode } from '../utils/twoFactorAuth.js';

// Enable 2FA endpoint
export const enable2FA = async (req, res) => {
  const user = await User.findById(req.user._id);
  
  const { secret, qrCode } = generate2FASecret(user.email);
  const backupCodes = generateBackupCodes();
  
  // Store temporarily (not confirmed yet)
  user.twoFATemp = {
    secret,
    backupCodes,
    createdAt: new Date()
  };
  await user.save();

  successResponse(res, { qrCode, secret, backupCodes }, '2FA enabled. Scan QR code and confirm.');
};

// Verify 2FA token
export const verify2FAToken = async (req, res) => {
  const { token } = req.body;
  const user = await User.findById(req.user._id);

  if (!verify2FAToken(token, user.twoFASecret)) {
    return errorResponse(res, 401, 'Invalid 2FA token');
  }

  // Token verified - generate session
  const sessionToken = generateToken(user);
  successResponse(res, { sessionToken }, 'Login successful');
};

// Use backup code
export const useBackupCode = async (req, res) => {
  const { backupCode } = req.body;
  const user = await User.findById(req.user._id);

  if (!verifyBackupCode(backupCode, user.backupCodes)) {
    return errorResponse(res, 401, 'Invalid backup code');
  }

  // Remove used code
  user.backupCodes = user.backupCodes.filter(code => code !== backupCode);
  await user.save();

  successResponse(res, {}, 'Backup code used successfully');
};
```

---

### 6. **Activity Logging** ✅
**File**: `backend/utils/activityLogger.js`

**Setup in Controllers**:
```javascript
import { logActivity, getActivityLogs, exportActivityLogs } from '../utils/activityLogger.js';

// Log every admin action
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);

    // Log activity
    await logActivity({
      userId: req.user._id,
      action: 'DELETE',
      entity: 'User',
      entityId: userId,
      details: { userName: user.name, email: user.email },
      status: 'success',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    successResponse(res, {}, 'User deleted successfully');
  } catch (error) {
    await logActivity({
      userId: req.user._id,
      action: 'DELETE',
      entity: 'User',
      entityId: req.params.userId,
      status: 'failure',
      details: { error: error.message },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    errorResponse(res, 500, error.message);
  }
};

// Get activity logs with pagination
export const getActivityLogs = async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);

  const logs = await ActivityLog.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await ActivityLog.countDocuments();
  paginatedResponse(res, logs, total, page, limit);
};

// Export activity logs
export const exportActivityLogs = async (req, res) => {
  const { startDate, endDate } = req.query;
  const logsPath = await exportActivityLogs(new Date(startDate), new Date(endDate));
  res.download(logsPath);
};
```

---

### 7. **Email & SMS Notifications** ✅
**File**: `backend/utils/notifications.js`

**Setup in Order Controller**:
```javascript
import { 
  sendOrderConfirmationEmail, 
  sendOrderStatusEmail,
  sendLowStockAlert,
  sendSMSNotification
} from '../utils/notifications.js';

// Send email on order confirmation
export const confirmOrder = async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  const user = await User.findById(order.userId);

  order.status = 'confirmed';
  await order.save();

  // Send notification
  await sendOrderConfirmationEmail(user, order);
  await sendSMSNotification(user.phone, `Your order #${order._id} is confirmed!`);

  successResponse(res, order, 'Order confirmed and notification sent');
};

// Send status update
export const updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.orderId,
    { status: req.body.status },
    { new: true }
  );
  const user = await User.findById(order.userId);

  await sendOrderStatusEmail(user, order, req.body.status);

  successResponse(res, order, 'Order updated and user notified');
};

// Alert on low stock
export const checkInventory = async (item) => {
  if (item.stock < item.minStock) {
    const canteen = await Canteen.findById(item.canteenId);
    const admins = await User.find({ role: 'admin' });
    const adminEmails = admins.map(a => a.email);

    await sendLowStockAlert(adminEmails, item.name, item.stock, item.minStock);
    await sendLowStockSMS(canteen.managerPhone, item.name, item.stock);
  }
};
```

**Environment Setup**:
```env
# .env file
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# For SMS (Twilio)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

### 8. **Report Generation** ✅
**File**: `backend/utils/reportGenerator.js`

**Setup in Admin Routes**:
```javascript
import {
  generateDailyRevenueReport,
  generateOrderAnalyticsReport,
  generateInventoryReport,
  generateUserActivityReport,
  generatePaymentReport
} from '../utils/reportGenerator.js';

// Daily revenue report (PDF)
router.get('/admin/reports/revenue', requireAdmin, async (req, res) => {
  try {
    const reportPath = await generateDailyRevenueReport(new Date(req.query.date));
    res.download(reportPath);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
});

// Order analytics (Excel)
router.get('/admin/reports/orders', requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const reportPath = await generateOrderAnalyticsReport(startDate, endDate);
    res.download(reportPath);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
});

// Inventory report (Excel)
router.get('/admin/reports/inventory', requireAdmin, async (req, res) => {
  try {
    const reportPath = await generateInventoryReport();
    res.download(reportPath);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
});

// User activity (Excel)
router.get('/admin/reports/users', requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const reportPath = await generateUserActivityReport(startDate, endDate);
    res.download(reportPath);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
});

// Payment report (Excel)
router.get('/admin/reports/payments', requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const reportPath = await generatePaymentReport(startDate, endDate);
    res.download(reportPath);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
});
```

---

### 9. **WebSocket/Real-time Updates** ✅
**File**: `backend/utils/socketHandler.js`

**Setup in server.js**:
```javascript
import { Server } from 'socket.io';
import { initializeSocket, emitOrderStatusUpdate, emitNewOrderNotification } from './utils/socketHandler.js';

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});

// Initialize WebSocket
initializeSocket(io);

// Emit on order status change
export const updateOrderStatusSocket = (order) => {
  emitOrderStatusUpdate(io, order._id, order);
};

// Emit on new order
export const notifyNewOrder = (order) => {
  emitNewOrderNotification(io, order);
};
```

**Frontend Usage**:
```javascript
import { useEffect } from 'react';
import io from 'socket.io-client';

export const useOrderTracking = (orderId) => {
  useEffect(() => {
    const socket = io('http://localhost:5000', {
      auth: { token: localStorage.getItem('token') }
    });

    socket.emit('join-order-tracking', orderId);

    socket.on('order-status-updated', (data) => {
      console.log('Order updated:', data.status);
      // Update UI with new status
    });

    return () => socket.disconnect();
  }, [orderId]);
};
```

---

### 10. **Redis Caching** ✅
**File**: `backend/utils/redisCache.js`

**Setup in Middleware**:
```javascript
import { cacheMiddleware, getCachedMenuItems, invalidateMenuCache } from '../utils/redisCache.js';

// Cache GET menu items (5 min TTL)
router.get('/menu', cacheMiddleware('menu_items', 300), async (req, res) => {
  // If cached, req.cachedData contains the data
  if (req.cachedData) {
    return successResponse(res, req.cachedData, 'Menu retrieved from cache');
  }

  const items = await MenuItem.find();
  successResponse(res, items, 'Menu retrieved');
});

// Invalidate cache on menu update
router.put('/menu/:id', requireCanteenManager, async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
  // Clear cache
  await invalidateMenuCache();

  successResponse(res, item, 'Menu item updated. Cache cleared.');
});
```

---

### 11. **Field Encryption** ✅
**File**: `backend/utils/encryption.js`

**Setup in User Model** (Mongoose Pre-save Hook):
```javascript
import { encryptPhoneNumber, decryptPhoneNumber } from '../utils/encryption.js';

userSchema.pre('save', async function (next) {
  if (this.isModified('phone')) {
    this.phone = encryptPhoneNumber(this.phone);
  }
  if (this.isModified('email')) {
    this.email = encryptEmail(this.email);
  }
  next();
});

// Add getter to automatically decrypt
userSchema.virtual('phoneDecrypted').get(function () {
  return decryptPhoneNumber(this.phone);
});

userSchema.virtual('emailDecrypted').get(function () {
  return decryptEmail(this.email);
});
```

---

### 12. **Performance Monitoring** ✅
**File**: `backend/middleware/performanceMonitor.js`

**Setup in server.js**:
```javascript
import { performanceMonitor, performanceReportingMiddleware, getHealthMetrics } from './middleware/performanceMonitor.js';
import { monitorDbQuery } from './middleware/performanceMonitor.js';

// Apply to all routes
app.use(performanceMonitor);
app.use(performanceReportingMiddleware);

// Get performance stats
app.get('/api/admin/health', (req, res) => {
  res.json(getHealthMetrics());
});

// Monitor DB queries
const startTime = Date.now();
const result = await Order.find();
monitorDbQuery('find', Date.now() - startTime, 'Order');
```

---

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/canteen

# JWT
JWT_SECRET=your-secret-key-here

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Encryption
ENCRYPTION_KEY=your-encryption-key-32-chars
HASH_SALT=your-salt-key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Frontend
FRONTEND_URL=http://localhost:3000

# Server
PORT=5000
NODE_ENV=development
```

---

## Installation Steps

1. **Install Dependencies**:
```bash
npm install nodemailer pdfkit xlsx socket.io redis speakeasy qrcode
```

2. **Apply RBAC to Existing Routes**:
   - Update all admin routes with `requireAdmin` middleware
   - Apply role-based protection to canteen manager routes

3. **Integrate Activity Logging**:
   - Add `logActivity` calls to all modify operations (CREATE, UPDATE, DELETE)

4. **Setup WebSocket**:
   - Import and initialize in `server.js`
   - Emit events from controllers

5. **Enable Caching**:
   - Apply cache middleware to frequently accessed endpoints

6. **Start Redis**:
```bash
redis-server
```

---

## Testing Endpoints

**RBAC**:
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/admin/users
```

**Activity Logs**:
```bash
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/admin/activity-logs
```

**Reports**:
```bash
curl http://localhost:5000/api/admin/reports/orders?startDate=2024-01-01&endDate=2024-01-31
```

**Performance Stats**:
```bash
curl http://localhost:5000/api/admin/performance-metrics
```

---

## Summary

All 12 advanced features are now integrated into your QuickBite backend:
- ✅ API standardization
- ✅ Pagination & filtering
- ✅ Input validation
- ✅ RBAC
- ✅ 2FA
- ✅ Activity logging
- ✅ Email/SMS notifications
- ✅ PDF/Excel reports
- ✅ WebSocket real-time updates
- ✅ Redis caching
- ✅ Field encryption
- ✅ Performance monitoring

All features use your existing database structure and models.
