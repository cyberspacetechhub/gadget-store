const jwt = require('jsonwebtoken');

const optionalJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
        // No token provided, continue as guest
        req.userId = null;
        req.roles = [];
        return next();
    }

    const token = authHeader.split(' ')[1];
    
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                // Invalid token, continue as guest
                req.userId = null;
                req.roles = [];
                return next();
            }
            
            // Valid token, set user info
            req.userId = decoded.UserInfo.id;
            req.roles = decoded.UserInfo.roles;
            next();
        }
    );
};

module.exports = optionalJWT;