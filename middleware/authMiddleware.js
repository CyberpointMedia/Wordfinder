// middleware/authMiddleware.js

const isAdmin = (req, res, next) => {
    if (req.session.role === 'admin') {
        next(); // User is an admin, proceed to the next middleware/route handler
    } else {
        res.status(403).send('Forbidden'); // User is not an admin, send a forbidden status
    }
};
module.exports = { isAdmin };
