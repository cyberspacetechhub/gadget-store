const jwt = require('jsonwebtoken');
const APIResponse = require('../utils/APIResponse');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
        return APIResponse.error(res, 'Access token required', 401, 'TOKEN_REQUIRED');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return APIResponse.error(res, 'Invalid or expired token', 403, 'TOKEN_INVALID');
        }
        
        req.user = decoded.UserInfo.username || decoded.UserInfo.email;
        req.userId = decoded.UserInfo._id || decoded.UserInfo.id;
        req.roles = decoded.UserInfo.roles;
        next();
    });
};

module.exports = verifyJWT;