module.exports = function (allowedRoles) {
    return function (req, res, next) {
        const jwt = require('jsonwebtoken');
        const { secret } = require('../../config');
        
        if (req.method === "OPTIONS") {
            return next();
        }
        
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(403).json({ message: "User isn't authorized" });
            }
            
            const decoded = jwt.verify(token, secret);
            const userRole = decoded.role; 
            
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ message: 'You are not allowed' });
            }
            next();
        } catch (error) {
            console.error(error);
            return res.status(403).json({message: "User isn't authorized"});
        }
    };
};