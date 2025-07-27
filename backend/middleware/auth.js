export const protect = (req, res, next) => {
  if (req.isAuthenticated()) {
        req.session.isAdmin = false;
        req.isAdmin = false;
        return next();
    }
    if (req.isAdmin) {
        return next();
    }
    res.status(401).json({ message: "Not authorized" });
};

export const isAdmin = (req, res, next) => {
    const adminKeys = process.env.ADMIN_KEYS.split(',');
    const { key } = req.body;
    if (key && adminKeys.includes(key)) {
        req.session.isAdmin = true;
        return next();
    }
    res.status(401).json({ message: "Not authorized" });
}

