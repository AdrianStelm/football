const jwt = require('jsonwebtoken')
const { secret } = require('.././../config')

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(403).json({ message: "User isn't authorized" });
        }
        
        const decodedData = jwt.verify(token, secret);
        console.log(decodedData)
        req.user = decodedData;
        next();
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: "User isn't authorized" });
    }
};