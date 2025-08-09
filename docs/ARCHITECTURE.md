# 🏗️ Architecture Documentation

## 📋 Overview

The codebase has been restructured with a proper service layer architecture, discriminator models, and separated controllers for better maintainability and code organization.

## 🔧 Key Changes Made

### 1. **Service Layer Architecture**
- **Before**: Controllers directly interacted with models
- **After**: Controllers use services, services contain business logic

### 2. **Discriminator Models**
- **Before**: Single User model with roles
- **After**: Base User model with Customer and Admin discriminators

### 3. **Separated Controllers**
- **Before**: Single authController for all auth operations
- **After**: Separate controllers for login, logout, refresh, customer, and admin

## 📁 New Directory Structure

```
BackEnd/
├── controllers/
│   ├── auth/
│   │   ├── loginController.js      # Login only
│   │   ├── logoutController.js     # Logout only  
│   │   └── refreshController.js    # Token refresh only
│   ├── admin/
│   │   └── adminController.js      # Admin operations
│   ├── customer/
│   │   └── customerController.js   # Customer operations
│   ├── productController.js        # Uses productService
│   └── cartController.js          # Uses cartService
├── services/
│   ├── user/
│   │   ├── adminService.js         # Admin business logic
│   │   └── customerService.js      # Customer business logic
│   ├── product/
│   │   └── productService.js       # Product business logic
│   └── cart/
│       └── cartService.js          # Cart business logic
├── models/
│   ├── User.js                     # Base user model
│   └── user/
│       ├── Admin.js                # Admin discriminator
│       └── Customer.js             # Customer discriminator
```

## 🎯 Service Layer Benefits

### **Separation of Concerns**
- Controllers handle HTTP requests/responses
- Services handle business logic
- Models handle data structure

### **Reusability**
- Services can be used by multiple controllers
- Business logic is centralized
- Easy to test individual components

### **Maintainability**
- Changes to business logic only affect services
- Controllers remain thin and focused
- Clear code organization

## 🔐 User Model Architecture

### **Base User Model** (`models/User.js`)
```javascript
{
  username: String,
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  userType: String, // 'Customer' or 'Admin'
  // ... common fields
}
```

### **Customer Discriminator** (`models/user/Customer.js`)
```javascript
{
  // Inherits all User fields +
  addresses: [ObjectId],
  wishlist: [ObjectId],
  loyaltyPoints: Number,
  preferredCategories: [String],
  dateOfBirth: Date,
  gender: String
}
```

### **Admin Discriminator** (`models/user/Admin.js`)
```javascript
{
  // Inherits all User fields +
  permissions: [String],
  lastLogin: Date,
  loginAttempts: Number,
  isSuper: Boolean,
  department: String
}
```

## 🎮 Controller Responsibilities

### **Auth Controllers** (No Services - Direct Model Access)
- `loginController.js` - User authentication only
- `logoutController.js` - User logout only
- `refreshController.js` - Token refresh only

### **User Controllers** (Use Services)
- `customerController.js` - Customer operations via customerService
- `adminController.js` - Admin operations via adminService

### **Feature Controllers** (Use Services)
- `productController.js` - Product operations via productService
- `cartController.js` - Cart operations via cartService

## 🔧 Service Layer Structure

### **User Services**
```javascript
// customerService.js
class CustomerService {
  async createCustomer(userData)
  async getCustomerById(id)
  async updateCustomer(id, updateData)
  async addToWishlist(customerId, productId)
  async removeFromWishlist(customerId, productId)
  async getWishlist(customerId)
  async updateLoyaltyPoints(customerId, points)
}

// adminService.js
class AdminService {
  async createAdmin(userData)
  async getAdminById(id)
  async getAllCustomers(page, limit, filters)
  async updateCustomerStatus(customerId, isActive)
  async getDashboardStats()
  async updatePermissions(adminId, permissions)
}
```

### **Feature Services**
```javascript
// productService.js
class ProductService {
  async createProduct(productData, userId)
  async getProducts(filters, page, limit, sort)
  async getProductById(id)
  async updateProduct(id, updateData, userId, userRoles)
  async deleteProduct(id, userId, userRoles)
  async searchProducts(query, limit)
  async getComparisonData(ids)
}

// cartService.js
class CartService {
  async getOrCreateCart(userId)
  async addToCart(userId, productId, quantity)
  async updateCartItem(userId, productId, quantity)
  async removeFromCart(userId, productId)
  async clearCart(userId)
  async syncCartPrices(userId)
  async validateCartItems(userId)
}
```

## 🛣️ Updated Routes

### **Authentication Routes**
```javascript
POST /api/auth/login      → loginController.login
POST /api/auth/logout     → logoutController.logout
GET  /api/auth/refresh    → refreshController.refresh
POST /api/auth/register   → customerController.register
```

### **User Routes**
```javascript
// Customer routes (protected)
GET    /api/customers/profile     → customerController.getProfile
PUT    /api/customers/profile     → customerController.updateProfile
GET    /api/customers/wishlist    → customerController.getWishlist
POST   /api/customers/wishlist    → customerController.addToWishlist
DELETE /api/customers/wishlist/:id → customerController.removeFromWishlist

// Admin routes (admin only)
GET  /api/admin/dashboard         → adminController.getDashboardStats
GET  /api/admin/customers         → adminController.getAllCustomers
PUT  /api/admin/customers/:id/status → adminController.updateCustomerStatus
POST /api/admin/admins            → adminController.createAdmin
```

### **Feature Routes**
```javascript
// Products (public + protected)
GET    /api/products              → productController.getProducts
GET    /api/products/:id          → productController.getProduct
POST   /api/products              → productController.createProduct (admin/vendor)
PUT    /api/products/:id          → productController.updateProduct (admin/vendor)
DELETE /api/products/:id          → productController.deleteProduct (admin/vendor)

// Cart (protected)
GET    /api/cart                  → cartController.getCart
POST   /api/cart/add              → cartController.addToCart
PUT    /api/cart/update           → cartController.updateCartItem
DELETE /api/cart/remove/:id       → cartController.removeFromCart
```

## ✅ Benefits Achieved

### **1. Better Code Organization**
- Clear separation between controllers and business logic
- Easier to locate and modify specific functionality
- Consistent code structure across the application

### **2. Improved Maintainability**
- Changes to business logic only affect services
- Controllers remain focused on HTTP handling
- Reduced code duplication

### **3. Enhanced Testability**
- Services can be unit tested independently
- Controllers can be tested with mocked services
- Clear boundaries between components

### **4. Better User Management**
- Proper discriminator models for different user types
- Type-specific fields and methods
- Cleaner database queries

### **5. Scalability**
- Easy to add new user types (Vendor, etc.)
- Services can be extended without affecting controllers
- Clear patterns for adding new features

## 🔄 Migration Notes

### **Database Changes**
- User documents now have `userType` field
- Existing users need migration to set userType
- New discriminator collections are created automatically

### **API Changes**
- Authentication responses now include `userType`
- Role-based access uses discriminator types
- New customer-specific and admin-specific endpoints

### **Code Changes**
- All controllers now use services for business logic
- Auth operations separated into individual controllers
- Improved error handling and validation

## 🚀 Next Steps

1. **Add Vendor Discriminator**
   - Create Vendor model extending User
   - Add vendor-specific services and controllers
   - Implement vendor dashboard and product management

2. **Implement Remaining Services**
   - Order service and controller
   - Review service and controller
   - Payment service and controller

3. **Add Service Tests**
   - Unit tests for all services
   - Integration tests for controllers
   - End-to-end API tests

4. **Performance Optimization**
   - Add caching layer to services
   - Optimize database queries
   - Implement pagination helpers

---

**The architecture is now properly structured for scalability and maintainability! 🎉**