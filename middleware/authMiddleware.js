// middleware/authMiddleware.js

const ensureAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'admin' || req.user.role === 'administrator') {
            return next();
        } else {
            return res.status(403).send('Forbidden');
        }
    } else {
        return res.redirect('/auth/login');
    }
};

const ensureEditor = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'editor' || req.user.role === 'admin' || req.user.role === 'administrator') {
            return next();
        } else {
            return res.status(403).send('Forbidden');
        }
    } else {
        return res.redirect('/auth/login');
    }
};

const ensureAuthor = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.role === 'author' || req.user.role === 'admin' || req.user.role === 'administrator') {
            return next();
        } else {
            return res.status(403).send('Forbidden');
        }
    } else {
        return res.redirect('/auth/login');
    }
};

module.exports = { ensureAdmin, ensureEditor, ensureAuthor };