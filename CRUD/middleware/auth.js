const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/auth/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.user.enrollmentNumber = decoded.enrollmentNumber; // Ensure enrollmentNumber is included in the JWT payload
        next();
    } catch (ex) {
        res.redirect("/auth/login");
    }
};

module.exports.isLoggedIn = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            req.user.enrollmentNumber = decoded.enrollmentNumber;
            return res.redirect("/students/details");
        } catch (ex) {
            // Invalid token, proceed to login/register
        }
    }
    next();
};

module.exports.isAdmin = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect("/auth/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "admin") {
            return res.status(403).send("Access denied.");
        }
        req.user = decoded;
        next();
    } catch (ex) {
        res.redirect("/auth/login");
    }
};
