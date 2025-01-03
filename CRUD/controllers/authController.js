const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Student = require("../models/student");

exports.register = async (req, res) => {
    const { username, password, confirmPassword, enrollmentNumber } = req.body;

    if (!username || !password || !confirmPassword || !enrollmentNumber) {
        req.session.errorMessage = "All fields are required.";
        return res.redirect("/auth/register");
    }

    if (password !== confirmPassword) {
        req.session.errorMessage = "Passwords do not match.";
        return res.redirect("/auth/register");
    }

    try {
        const student = await Student.findOne({ enrollmentNumber });
        if (!student) {
            req.session.errorMessage = "Invalid enrollment number.";
            return res.redirect("/auth/register");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            password: hashedPassword,
            role: "student",
            studentId: student._id,
        });

        await newUser.save();
        req.session.successMessage = "User registered successfully. Please log in.";
        res.redirect("/auth/login");
    } catch (err) {
        if (err.code === 11000) {
            req.session.errorMessage = "Username already exists.";
            return res.redirect("/auth/register");
        }
        console.error(`Server Error: ${err.message}`);
        res.status(500).send("Server Error");
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!req.body.username || !req.body.password) {
        req.session.errorMessage = "All fields are required.";
        return res.redirect("/auth/login");
    }

    try {
        const user = await User.findOne({ username }).populate("studentId");
        if (!user) {
            req.session.errorMessage = "Invalid username or password.";
            return res.redirect("/auth/login");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.session.errorMessage = "Invalid username or password.";
            return res.redirect("/auth/login");
        }

        const payload = {
            _id: user._id,
            role: user.role,
            studentId: user.studentId,
        };

        if (user.role === "student" && user.studentId) {
            payload.enrollmentNumber = user.studentId.enrollmentNumber;
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.cookie("token", token, { httpOnly: true });

        if (user.role === "admin") {
            res.redirect("/admin/students");
        } else {
            res.redirect(`/students/view`);
        }
    } catch (err) {
        console.error(`Server Error: ${err.message}`);
        console.error(err.stack); // Log the stack trace for debugging
        res.status(500).send("Server Error");
    }
};

exports.renderRegister = (req, res) => {
    const successMessage = req.session.successMessage;
    const errorMessage = req.session.errorMessage;
    req.session.successMessage = null;
    req.session.errorMessage = null;
    res.render("register", { successMessage, errorMessage });
};

exports.renderLogin = (req, res) => {
    const successMessage = req.session.successMessage;
    const errorMessage = req.session.errorMessage;
    req.session.successMessage = null;
    req.session.errorMessage = null;
    res.render("login", { successMessage, errorMessage, registerLink: "/auth/register" });
};

exports.clearMessages = (req, res, next) => {
    req.session.successMessage = null;
    req.session.errorMessage = null;
    next();
};

exports.logout = (req, res) => {
    res.clearCookie("token");
    req.session.successMessage = "You have been logged out successfully.";
    res.redirect("/auth/login");
};