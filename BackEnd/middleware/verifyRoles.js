const APIResponse = require('../utils/APIResponse');

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) {
            return APIResponse.error(res, 'Access denied', 401, 'UNAUTHORIZED');
        }

        const rolesArray = [...allowedRoles];
        const userRoles = Array.isArray(req.roles) ? req.roles : [req.roles];
        const result = userRoles.map(role => rolesArray.includes(role)).find(val => val === true);
        
        if (!result) {
            return APIResponse.error(res, 'Insufficient permissions', 403, 'FORBIDDEN');
        }
        
        next();
    };
};

module.exports = verifyRoles;