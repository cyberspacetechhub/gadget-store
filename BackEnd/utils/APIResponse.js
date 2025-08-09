// Utility for consistent API responses

class APIResponse {
    static success(res, data = null, message = 'Success', statusCode = 200, meta = null) {
        const response = {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        };

        if (meta) {
            response.meta = meta;
        }

        return res.status(statusCode).json(response);
    }

    static error(res, message = 'An error occurred', statusCode = 500, errorCode = null, details = null) {
        const response = {
            success: false,
            message,
            timestamp: new Date().toISOString(),
        };

        if (errorCode) {
            response.errorCode = errorCode;
        }

        if (details && process.env.NODE_ENV === 'development') {
            response.details = details;
        }

        return res.status(statusCode).json(response);
    }

    static paginated(res, data, page, limit, total, message = 'Success') {
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        const meta = {
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages,
                hasNextPage,
                hasPrevPage,
                nextPage: hasNextPage ? page + 1 : null,
                prevPage: hasPrevPage ? page - 1 : null,
            }
        };

        return this.success(res, data, message, 200, meta);
    }
}

module.exports = APIResponse;