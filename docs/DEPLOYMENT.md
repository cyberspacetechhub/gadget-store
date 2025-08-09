# 🚀 Deployment Guide

This guide covers deploying the Gadget E-commerce Platform to production environments.

## 📋 Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Paystack/Stripe account
- Vercel account (for frontend)
- Render/Railway account (for backend)

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account
   - Create a new cluster

2. **Configure Database**
   ```bash
   # Create database: gadget-ecommerce
   # Create collections: users, products, categories, orders, etc.
   ```

3. **Get Connection String**
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/gadget-ecommerce
   ```

4. **Configure Network Access**
   - Add IP addresses: 0.0.0.0/0 (for production)
   - Create database user with read/write permissions

## ☁️ Cloudinary Setup

1. **Create Cloudinary Account**
   - Go to [Cloudinary](https://cloudinary.com)
   - Sign up for free account

2. **Get API Credentials**
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Configure Upload Presets**
   - Create upload preset for products
   - Enable auto-optimization
   - Set folder structure

## 💳 Payment Gateway Setup

### Paystack (Primary)

1. **Create Paystack Account**
   - Go to [Paystack](https://paystack.com)
   - Complete business verification

2. **Get API Keys**
   ```env
   PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
   PAYSTACK_SECRET_KEY=sk_test_xxxxx
   ```

3. **Configure Webhooks**
   ```
   Webhook URL: https://your-api-domain.com/api/payments/webhook
   Events: charge.success, charge.failed
   ```

### Stripe (Optional)

1. **Create Stripe Account**
   - Go to [Stripe](https://stripe.com)
   - Complete account setup

2. **Get API Keys**
   ```env
   STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
   STRIPE_SECRET_KEY=sk_test_xxxxx
   ```

## 🖥️ Backend Deployment (Render)

1. **Prepare for Deployment**
   ```bash
   cd BackEnd
   
   # Create production environment file
   cp .env.example .env.production
   
   # Update production values
   NODE_ENV=production
   DATABASE_URI=mongodb+srv://...
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

2. **Deploy to Render**
   - Connect GitHub repository
   - Create new Web Service
   - Configure build settings:
     ```
     Build Command: npm install
     Start Command: npm start
     ```

3. **Environment Variables**
   ```env
   NODE_ENV=production
   DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/gadget-ecommerce
   ACCESS_TOKEN_SECRET=your_super_secret_access_token_here
   REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   PAYSTACK_SECRET_KEY=sk_live_xxxxx
   PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
   STRIPE_SECRET_KEY=sk_live_xxxxx
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

4. **Custom Domain (Optional)**
   - Add custom domain in Render dashboard
   - Update DNS records
   - SSL certificate is auto-generated

## 🌐 Frontend Deployment (Vercel)

1. **Prepare for Deployment**
   ```bash
   cd Front_End
   
   # Create production environment file
   echo "VITE_API_URL=https://your-backend-domain.onrender.com/api" > .env.production
   echo "VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx" >> .env.production
   ```

2. **Deploy to Vercel**
   - Connect GitHub repository
   - Import project
   - Configure build settings:
     ```
     Framework Preset: Vite
     Build Command: npm run build
     Output Directory: dist
     Install Command: npm install
     ```

3. **Environment Variables**
   ```env
   VITE_API_URL=https://your-backend-domain.onrender.com/api
   VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
   ```

4. **Custom Domain (Optional)**
   - Add custom domain in Vercel dashboard
   - Update DNS records
   - SSL certificate is auto-generated

## 🔧 Post-Deployment Configuration

### 1. Update CORS Origins
```javascript
// BackEnd/config/allowedOrigins.js
const allowedOrigins = [
    'https://your-frontend-domain.vercel.app',
    'https://your-custom-domain.com'
];
```

### 2. Configure Rate Limiting
```javascript
// BackEnd/server.js
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
```

### 3. Set up Monitoring
- Configure error tracking (Sentry)
- Set up uptime monitoring
- Configure log aggregation

### 4. Database Indexing
```javascript
// Create indexes for better performance
db.products.createIndex({ name: "text", description: "text" })
db.products.createIndex({ category: 1, status: 1 })
db.products.createIndex({ price: 1 })
db.users.createIndex({ email: 1 })
db.orders.createIndex({ user: 1, createdAt: -1 })
```

## 🔒 Security Checklist

- [ ] Environment variables are secure
- [ ] Database has proper access controls
- [ ] API rate limiting is configured
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] Input validation is implemented
- [ ] Authentication tokens are secure
- [ ] File upload restrictions are in place
- [ ] Error messages don't expose sensitive data

## 📊 Performance Optimization

### Backend
- [ ] Database queries are optimized
- [ ] Proper indexing is implemented
- [ ] Caching is configured
- [ ] Image optimization is enabled
- [ ] Compression middleware is active

### Frontend
- [ ] Code splitting is implemented
- [ ] Images are optimized
- [ ] Lazy loading is configured
- [ ] Bundle size is optimized
- [ ] CDN is configured

## 🧪 Testing in Production

1. **Smoke Tests**
   ```bash
   # Test API health
   curl https://your-api-domain.com/health
   
   # Test authentication
   curl -X POST https://your-api-domain.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
   ```

2. **Frontend Tests**
   - Test all major user flows
   - Verify payment integration
   - Check responsive design
   - Test PWA functionality

## 📈 Monitoring & Analytics

### Application Monitoring
- Set up error tracking (Sentry)
- Configure performance monitoring
- Set up uptime monitoring

### Business Analytics
- Google Analytics
- Payment analytics
- User behavior tracking

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        # Add deployment steps

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        # Add deployment steps
```

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check allowed origins configuration
   - Verify frontend URL in backend config

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check network access settings

3. **Payment Integration Issues**
   - Verify API keys are correct
   - Check webhook configurations

4. **Image Upload Issues**
   - Verify Cloudinary credentials
   - Check upload preset configuration

### Logs and Debugging
```bash
# Check application logs
heroku logs --tail -a your-app-name

# Monitor database performance
# Use MongoDB Atlas monitoring tools

# Check API response times
# Use application monitoring tools
```

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review application logs
3. Contact support team
4. Create GitHub issue

---

**Happy Deploying! 🚀**