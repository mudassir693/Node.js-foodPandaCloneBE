const jwt = require('jsonwebtoken');

const AuthUser = (req, res, next) => {
    const authToken = req.headers.token;
    
    if (!authToken) {
        return res.status(401).json({ data: 'Token not provided', error: true, status: 401 });
    }

    const token = authToken.split(' ')[1];
    
    jwt.verify(token, process.env.JWT_TOKEN, (error, decoded) => {
        if (error) {
            return res.status(401).json({ data: 'Invalid or expired token', error: true, status: 401 });
        }

        req.user = decoded;
        next();
    });
};

const verifyRole = (requiredRole) => (req, res, next) => {
    AuthUser(req, res, () => {
        if (req.user && req.user.Role === requiredRole) {
            return next();
        }
        return res.status(403).json({ data: `Access denied. Requires ${requiredRole} role.`, error: true, status: 403 });
    });
};

const verifyAdmin = (req, res, next) => {
    AuthUser(req, res, () => {
        if (req.user.AdminTeam) {
            return next();
        }
        return res.status(403).json({ data: 'Admin access required', error: true, status: 403 });
    });
};

const verifyAdminOrUser = (req, res, next) => {
    AuthUser(req, res, () => {
        if (req.user.id === req.params.id || req.user.AdminTeam) {
            return next();
        }
        return res.status(403).json({ data: 'User or Admin access required', error: true, status: 403 });
    });
};

const verifyResturantOwner = (req, res, next) => {
    AuthUser(req, res, () => {
        if (req.user.category === 'Resturant' || req.user.AdminTeam) {
            return next();
        }
        return res.status(403).json({ data: 'Restaurant owner or Admin access required', error: true, status: 403 });
    });
};

module.exports = { AuthUser, verifyAdmin, verifyAdminOrUser, verifyResturantOwner };
