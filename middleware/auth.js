module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.session.isAdmin = false;
        // req.isAdmin = false;
        res.locals.isAdmin = false;
        return next();
    }
    if (req.isAdmin) {
        return next();
    }
    next('unAuthenticated');
}

module.exports.isAdmin = (req, res, next) => {
    const adminKeys = process.env.ADMIN_KEYS.split(',');
    const { key } = req.body;
    if (key && adminKeys.includes(key)) {
        req.session.isAdmin = true;
        res.locals.isAdmin = true;
        return next();
    }
    next('unAuthenticated');
}