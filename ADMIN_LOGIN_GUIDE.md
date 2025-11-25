# How to Access Admin Page - Setup Guide

## Problem
❌ URL shows `/admin` but you're redirected to `/login`

**Reason:** You need to login as an **admin user**, but there's no admin user in MongoDB yet.

---

## Solution: Insert Admin User into MongoDB

### Option 1: Using MongoDB Compass (Easy GUI)

1. **Open MongoDB Compass**
2. **Connect to your database** (Local: mongodb://localhost:27017)
3. **Go to:** `quickbite` → `users` collection
4. **Click:** "INSERT DOCUMENT" button
5. **Copy and paste** this JSON:

```json
{
  "name": "Administrator",
  "email": "admin@quickbite.com",
  "password": "$2a$10$cQ7JZOoPMExQ/P.Gvgx/MuOtJaGPai28uAmjf51x5oOfPSe6jVIam",
  "role": "admin",
  "universityId": "ADMIN001",
  "department": "Administration",
  "phone": "+91-9999999999",
  "isVerified": true,
  "isActive": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

6. **Click:** "Insert" button
7. ✅ Admin user created!

---

### Option 2: Using MongoDB Shell

Run this command in MongoDB shell:

```javascript
db.users.insertOne({
  "name": "Administrator",
  "email": "admin@quickbite.com",
  "password": "$2a$10$cQ7JZOoPMExQ/P.Gvgx/MuOtJaGPai28uAmjf51x5oOfPSe6jVIam",
  "role": "admin",
  "universityId": "ADMIN001",
  "department": "Administration",
  "phone": "+91-9999999999",
  "isVerified": true,
  "isActive": true,
  "createdAt": new Date(),
  "updatedAt": new Date()
})
```

---

## Login to Admin Panel

### Step 1: Go to Login Page
- Open: http://localhost:3000/login

### Step 2: Enter Admin Credentials
- **Email:** `admin@quickbite.com`
- **Password:** `Admin@123`

### Step 3: Click Login
- ✅ You'll be redirected to `/admin`

### Step 4: Access Admin Dashboard
- **URL:** http://localhost:3000/admin
- ✅ Full access to admin panel with all features

---

## Admin Panel Features

Once logged in as admin, you can:

### 📊 Dashboard Overview
- Real-time statistics (orders, revenue, active orders, users)
- Peak hour traffic analysis
- Weekly revenue trends
- Top performing menu items

### 🍔 Menu Management
- Add new menu items
- Edit existing items
- Delete items
- View inventory status

### 📦 Order Management
- View all active orders
- Update order status (preparing, ready, completed)
- Track order history
- View order details

### ⚠️ Inventory Alerts
- Low stock items
- Quick reorder buttons
- Stock level tracking

### 👥 Staff Management
- View staff members
- Performance ratings
- Shift tracking

### 💰 Financial Insights
- Daily revenue
- Weekly trends
- Payment status tracking

### 🎟️ Coupon Management
- Create promotional codes
- Manage active coupons
- Track coupon usage

---

## Troubleshooting

### ❌ "Invalid email or password"
- Make sure you inserted the admin user correctly
- Email must be: `admin@quickbite.com` (exactly)
- Password is: `Admin@123`
- Check the hashed password in database: `$2a$10$cQ7JZOoPMExQ/P.Gvgx/MuOtJaGPai28uAmjf51x5oOfPSe6jVIam`

### ❌ After login, redirected to `/login` again
- Role must be: `"role": "admin"` (not "student" or "staff")
- Check MongoDB document has correct role field

### ❌ MongoDB connection issues
- Start MongoDB service (Windows):
  ```powershell
  net start MongoDB
  ```
- Or use: `mongod` command

---

## Login Flow

```
1. You enter credentials (admin@quickbite.com / Admin@123)
2. Backend verifies credentials against MongoDB
3. Backend returns JWT token + user data with role: "admin"
4. Frontend stores token in localStorage
5. Frontend sets user.role = "admin" in auth store
6. AdminDashboard checks: user.role === "admin" ✅
7. Dashboard loads successfully with all real data
```

---

## What Makes Login Work for Admin

**Backend Response on Successful Login:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id_from_mongodb",
    "name": "Administrator",
    "email": "admin@quickbite.com",
    "role": "admin"  ← This must be "admin"!
  }
}
```

**Frontend AdminDashboard Auth Check:**
```javascript
useEffect(() => {
  // Check if user has admin role
  if (!isAuthenticated || !user || user.role !== 'admin') {
    navigate('/login', { replace: true });
  }
}, [isAuthenticated, user, navigate]);
```

✅ If `user.role === "admin"`, dashboard loads
❌ If `user.role !== "admin"`, redirects to login

---

## Quick Reference

| Item | Value |
|------|-------|
| Admin Email | admin@quickbite.com |
| Admin Password | Admin@123 |
| Hashed Password | $2a$10$cQ7JZOoPMExQ/P.Gvgx/MuOtJaGPai28uAmjf51x5oOfPSe6jVIam |
| Login URL | http://localhost:3000/login |
| Admin Panel URL | http://localhost:3000/admin |
| Database | MongoDB (quickbite) |
| Collection | users |

---

## Status

✅ **Security:** Proper role-based access control implemented
✅ **Backend:** Ready to accept admin login
✅ **Frontend:** Admin page protected and authenticated
⏳ **Next:** Insert admin user into MongoDB

