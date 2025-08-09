# 🛒 Gadget E-commerce Platform

A world-class, full-featured gadget e-commerce platform with modern UI/UX and smart comparison tools, similar to Best Buy, Newegg, and Jumia.

## 🚀 Features

### Core Features
- **User System**: Complete authentication with JWT, roles (admin, vendor, customer)
- **Product Management**: CRUD operations, categories, specifications, image uploads
- **Smart Search & Filters**: Keyword search, brand/spec filters, auto-suggestions
- **Comparison Tool**: Compare up to 3 gadgets side-by-side
- **Shopping Cart**: Full cart management with real-time updates
- **Checkout System**: Secure payment processing with Paystack/Stripe
- **Reviews & Q&A**: User reviews, ratings, media uploads, voting system
- **Admin Dashboard**: Complete management interface
- **Vendor Panel**: Vendor-managed product listings

### Smart Features
- Auto-suggestions in search
- Frequently bought together recommendations
- Wishlist functionality
- Review voting system
- Lazy loading with skeleton screens
- PWA support
- Dark mode

### Security & Performance
- HTTPS enforcement
- JWT authentication
- Helmet security headers
- Rate limiting
- Input sanitization
- Optimized images with Cloudinary
- Responsive design
- SEO optimized

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Hook Form** - Form handling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image management
- **Paystack/Stripe** - Payment processing

### DevOps & Deployment
- **Vercel** - Frontend hosting
- **Render/Railway** - Backend hosting
- **MongoDB Atlas** - Database hosting
- **GitHub Actions** - CI/CD (optional)

## 📁 Project Structure

```
gadget-ecommerce/
├── BackEnd/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── Front_End/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React contexts
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
│   └── public/          # Static assets
└── docs/                # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gadget-ecommerce/BackEnd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   DATABASE_URI=mongodb://localhost:27017/gadget-ecommerce
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   PAYSTACK_SECRET_KEY=your_paystack_secret
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../Front_End
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### Product Endpoints
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin/Vendor)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search` - Search products
- `GET /api/products/compare` - Get comparison data

### Cart Endpoints
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:productId` - Remove item
- `DELETE /api/cart/clear` - Clear cart

### Order Endpoints
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

## 🎨 UI Components

### Layout Components
- `Header` - Navigation with search, cart, user menu
- `Footer` - Site footer with links
- `Layout` - Main layout wrapper
- `AdminLayout` - Admin dashboard layout
- `VendorLayout` - Vendor dashboard layout

### Product Components
- `ProductCard` - Product display card
- `ProductGrid` - Product listing grid
- `ProductDetails` - Detailed product view
- `ProductComparison` - Side-by-side comparison
- `ProductReviews` - Reviews and ratings

### Shopping Components
- `CartDropdown` - Cart preview dropdown
- `CartPage` - Full cart page
- `CheckoutForm` - Checkout process
- `OrderSummary` - Order details

### Common Components
- `LoadingSpinner` - Loading indicators
- `Modal` - Reusable modal
- `Button` - Styled button variants
- `Input` - Form input components
- `SearchModal` - Global search interface

## 🔐 Authentication & Authorization

### User Roles
- **Customer** (2023) - Basic shopping privileges
- **Vendor** (1984) - Product management
- **Admin** (2001) - Full system access

### JWT Implementation
- Access tokens (15 minutes)
- Refresh tokens (7 days)
- Automatic token refresh
- Secure HTTP-only cookies

### Protected Routes
- Role-based access control
- Route guards
- Automatic redirects

## 💳 Payment Integration

### Paystack (Primary)
- Card payments
- Bank transfers
- Mobile money
- Webhook verification

### Stripe (Optional)
- International payments
- Multiple currencies
- Subscription support

## 📱 Mobile & PWA

### Responsive Design
- Mobile-first approach
- Touch-friendly interface
- Optimized performance

### PWA Features
- Offline capability
- Push notifications
- App-like experience
- Install prompts

## 🔍 SEO & Performance

### SEO Optimization
- Meta tags
- Open Graph
- Structured data
- Sitemap generation

### Performance
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies

## 🧪 Testing

### Backend Testing
```bash
cd BackEnd
npm test
```

### Frontend Testing
```bash
cd Front_End
npm test
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy

### Backend (Render/Railway)
1. Connect GitHub repository
2. Set start command: `npm start`
3. Configure environment variables
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shedrach**
- GitHub: [@shedrach](https://github.com/shedrach)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React team for the amazing framework
- TailwindCSS for the utility-first CSS
- MongoDB for the flexible database
- All open source contributors

---

**Happy Coding! 🚀**