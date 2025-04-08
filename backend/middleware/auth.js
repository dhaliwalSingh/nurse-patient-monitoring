const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (context) => {
    const authHeader = context.req.headers.authorization;

    if (!authHeader) {
        throw new Error('Authorization header is missing.');
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) {
        throw new Error('Invalid authorization format.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded; // { userId, role }
    } catch (error) {
        throw new Error('Invalid/Expired token.');
    }
};

module.exports = authMiddleware;
