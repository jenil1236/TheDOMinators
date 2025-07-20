export const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.session.isAdmin = false;
        req.isAdmin = false;
        return next();
    }
    if (req.isAdmin) {
        return next();
    }
    next('unAuthenticated');
}

export const isAdmin = (req, res, next) => {
    const adminKeys = process.env.ADMIN_KEYS.split(',');
    const { key } = req.body;
    if (key && adminKeys.includes(key)) {
        req.session.isAdmin = true;
        return next();
    }
    next('unAuthenticated');
}