const jwt = require('jsonwebtoken'); // Import jsonwebtoken

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Correct header name
    if (!authHeader) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1]; // Extract Bearer token
    if (!token) {
        return res.status(401).json({ error: "Access denied. Token missing." });
    }

    try {
        // console.log(process.env.JWT_SECRET); // Log JWT_SECRET for debugging
        const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = verified; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = authenticateToken;
