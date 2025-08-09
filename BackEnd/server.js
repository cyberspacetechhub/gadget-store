require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const errorHandler = require('./middleware/errorHandler');
const APIResponse = require('./utils/APIResponse');
const { logger } = require('./middleware/logEvents');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDb = require('./config/dbConn');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');

const PORT = process.env.PORT || 3600;

// Connect to MongoDB
connectDb();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
    max: process.env.RATE_LIMIT_MAX_REQUESTS || 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        errorCode: 'RATE_LIMIT_EXCEEDED'
    }
});
app.use('/api/', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Custom middleware logger
app.use(logger);

// Handle credentials check - before CORS
app.use(credentials);

// CORS middleware
app.use(cors(corsOptions));

// Additional CORS headers as fallback
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:3000', 
        'http://127.0.0.1:5173',
        'https://gadget-store-sigma.vercel.app'
    ];
    
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Built-in middleware for handling urlencoded form data
app.use(express.urlencoded({ extended: false }));

// Built-in middleware for json
app.use(express.json({ limit: '10mb' }));

// Middleware for cookies
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, '/public')));

// Health check endpoint
app.get('/health', (req, res) => {
    APIResponse.success(res, {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    }, 'Server is healthy');
});

// Root route
app.use('/', require('./routes/root'));

// Public API routes (no authentication required)
app.use('/api/auth/register', require('./routes/register'));
app.use('/api/auth/login', require('./routes/auth'));
app.use('/api/auth/refresh', require('./routes/refresh'));
app.use('/api/auth/logout', require('./routes/logout'));
app.use('/api/auth/forgot-password', require('./routes/forgotPassword'));
app.use('/api/auth/reset-password', require('./routes/resetPassword'));
app.use('/api/auth/verify-email', require('./routes/verifyEmail'));

// Public product routes
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));

// Protected routes (authentication required)
app.use(verifyJWT);

// Upload routes
app.use('/api/upload', require('./routes/upload'));

// User routes
app.use('/api/customers', require('./routes/customers'));
app.use('/api/addresses', require('./routes/addresses'));

// Shopping routes
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));

// Payment routes
app.use('/api/payments', require('./routes/payments'));

// Admin routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/analytics', require('./routes/analytics'));

// Vendor routes
app.use('/api/vendor', require('./routes/vendor'));

// Handle 404 for undefined routes
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        APIResponse.error(res, '404 - Route not found', 404, 'ROUTE_NOT_FOUND');
    } else {
        res.type('txt').send('404 - Route not found');
    }
});

// Global error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed.');
        process.exit(0);
    });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server when MongoDB connects
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
});