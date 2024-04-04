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

const ensureAdminOrEditor = (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log("ensureAdminOrEditor req.user.role", req.user.role);
        if (req.user.role === 'admin' || req.user.role === 'editor' || req.user.role === 'administrator' || req.user.role === 'author') {
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

module.exports = { ensureAdminOrEditor , ensureAdmin, ensureEditor, ensureAuthor };