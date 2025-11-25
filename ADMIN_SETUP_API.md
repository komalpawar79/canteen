# Admin Setup - API Method

Since MongoDB direct insert is not permitted, use the **Setup Admin API endpoint** instead!

---

## ✅ Quick Setup (2 Steps)

### Step 1: Create Admin User via API

Open your browser console or use **Postman/cURL** to call:

```
POST http://localhost:5000/api/auth/setup-admin
Content-Type: application/json

{
  "name": "Administrator",
  "email": "admin@quickbite.com",
  "password": "Admin@123",
  "universityId": "ADMIN001"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id_here",
    "name": "Administrator",
    "email": "admin@quickbite.com",
    "role": "admin"
  }
}
```

### Step 2: Login with Admin Credentials

1. Go to: http://localhost:3000/login
2. Email: `admin@quickbite.com`
3. Password: `Admin@123`
4. Click **Login**
5. ✅ Redirects to admin dashboard!

---

## How to Call the API

### Option 1: Browser Console

```javascript
fetch('http://localhost:5000/api/auth/setup-admin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Administrator',
    email: 'admin@quickbite.com',
    password: 'Admin@123',
    universityId: 'ADMIN001'
  })
})
.then(r => r.json())
.then(data => console.log(data))
```

### Option 2: Postman

1. **Method:** POST
2. **URL:** `http://localhost:5000/api/auth/setup-admin`
3. **Headers:** 
   - Key: `Content-Type`
   - Value: `application/json`
4. **Body (raw JSON):**
   ```json
   {
     "name": "Administrator",
     "email": "admin@quickbite.com",
     "password": "Admin@123",
     "universityId": "ADMIN001"
   }
   ```
5. **Send** → Get response with token

### Option 3: cURL

```bash
curl -X POST http://localhost:5000/api/auth/setup-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Administrator",
    "email": "admin@quickbite.com",
    "password": "Admin@123",
    "universityId": "ADMIN001"
  }'
```

### Option 4: PowerShell

```powershell
$body = @{
    name = "Administrator"
    email = "admin@quickbite.com"
    password = "Admin@123"
    universityId = "ADMIN001"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/setup-admin" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

---

## Security Notes

✅ **Features:**
- Only creates admin if **no admin exists yet**
- If admin already created, returns error: `"Admin user already exists"`
- Password is hashed automatically (bcryptjs, 10 salt rounds)
- One-time setup to prevent unauthorized admin creation

❌ **Cannot:**
- Create multiple admins
- Create admin if one already exists
- Bypass the existing admin check

---

## Troubleshooting

### ❌ Error: "Admin user already exists"
- **Means:** Admin was already created
- **Solution:** Proceed to login with existing admin credentials
- Or delete the existing admin from MongoDB (if you have permission)

### ❌ Error: "Email already registered"
- **Means:** Email `admin@quickbite.com` is registered as student/staff
- **Solution:** Use different email, e.g., `superadmin@quickbite.com`

### ❌ Error: "Please provide name, email, password, and universityId"
- **Means:** Missing required fields
- **Solution:** Include all 4 fields in request body

### ❌ After login, redirected to `/login` again
- **Means:** Role was not set to `admin` in database
- **Solution:** The setup endpoint sets role to `admin` automatically ✅

### ❌ "Cannot reach http://localhost:5000"
- **Means:** Backend server is not running
- **Solution:** Start backend with `node server.js` in `backend/` folder

---

## Admin Credentials

| Field | Value |
|-------|-------|
| Email | admin@quickbite.com |
| Password | Admin@123 |
| University ID | ADMIN001 |
| Role | admin |
| Department | Administration |
| Verified | Yes ✅ |
| Active | Yes ✅ |

---

## After Login

Once logged in as admin at `/admin`, you can:

✅ View real-time dashboard statistics  
✅ Manage menu items (add, edit, delete)  
✅ Track live orders  
✅ View low stock alerts  
✅ Manage staff members  
✅ Create promotional coupons  
✅ Analyze revenue trends  
✅ Monitor daily traffic  

---

## API Endpoint Details

**Endpoint:** `POST /api/auth/setup-admin`

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 chars)",
  "universityId": "string (required, unique)"
}
```

**Response on Success (201):**
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "token": "JWT token string",
  "user": {
    "id": "MongoDB user ID",
    "name": "Administrator",
    "email": "admin@quickbite.com",
    "role": "admin"
  }
}
```

**Response on Error (400/500):**
```json
{
  "success": false,
  "error": "Error description"
}
```

---

## Complete Flow

```
1. Make POST request to /api/auth/setup-admin
   ↓
2. Backend checks if admin exists
   ├─ Yes → Return error
   └─ No → Continue
   ↓
3. Validate all required fields
   ├─ Missing → Return error
   └─ OK → Continue
   ↓
4. Hash password with bcryptjs
   ↓
5. Create user document with role: "admin"
   ↓
6. Save to MongoDB
   ↓
7. Generate JWT token
   ↓
8. Return token + user data
   ↓
9. Frontend stores token in localStorage
   ↓
10. User logs out and tries to login
    ↓
11. Calls /api/auth/login with credentials
    ↓
12. Backend verifies password
    ↓
13. Returns token + user with role: "admin"
    ↓
14. AdminDashboard checks user.role === "admin" ✅
    ↓
15. Dashboard loads successfully!
```

---

## Status

✅ **Setup Admin Endpoint Created**  
✅ **Added to Auth Routes**  
✅ **Password Hashing Automatic**  
✅ **Security Checks in Place**  
✅ **Ready to Use**

**Next Step:** Call the setup endpoint to create your admin user!

