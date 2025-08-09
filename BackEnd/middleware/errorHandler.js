const { logEvents } = require('./logEvents');
const APIResponse = require('../utils/APIResponse');

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.txt');
    console.error(err.stack);

    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(val => val.message);
        return APIResponse.error(res, `Validation Error: ${errors.join(', ')}`, 400, 'VALIDATION_ERROR');
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return APIResponse.error(res, `${field} already exists`, 409, 'DUPLICATE_FIELD');
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return APIResponse.error(res, 'Invalid token', 401, 'INVALID_TOKEN');
    }

    if (err.name === 'TokenExpiredError') {
        return APIResponse.error(res, 'Token expired', 401, 'TOKEN_EXPIRED');
    }

    // Mongoose cast error
    if (err.name === 'CastError') {
        return APIResponse.error(res, 'Invalid ID format', 400, 'INVALID_ID');
    }

    APIResponse.error(res, message, status, err.code);
};

module.exports = errorHandler;