// middleware//setAdminStatusAndUsername.js
// Middleware to set isAdmin and username
const setAdminStatusAndUsername = (req, res, next) => {
    console.log('setAdminStatusAndUsername middleware called');
    console.log('req.user:', req.user);
    res.locals.isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'editor' || req.user.role === 'administrator');
    res.locals.username = req.user && req.user.username;
    console.log('res.locals.isAdmin:', res.locals.isAdmin);
    console.log('res.locals.username:', res.locals.username);
    next();
};
module.exports = setAdminStatusAndUsername;