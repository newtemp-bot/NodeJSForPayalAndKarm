const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");
const fs = require("fs");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/auth");

dotenv.config({ path: path.join(__dirname, '.env') }); // Ensure .env file is loaded

const app = express();
const port = process.env.PORT || 3000;

// Logger setup
const logFilePath = path.join(__dirname, "server.log");
const logStream = fs.createWriteStream(logFilePath, { flags: "a" });

function log(message) {
    const timestamp = new Date().toISOString();
    logStream.write(`[${timestamp}] ${message}\n`);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Set the views directory

// Middleware
app.use((req, res, next) => {
    log(`${req.method} ${req.url}`);
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); // Serve static files from the 'public' directory
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
app.use(cookieParser());

// Connect to MongoDB
connectDB().then(() => log("Connected to MongoDB")).catch((err) => log(`Could not connect to MongoDB: ${err.message}`));

// Routes
app.use("/admin", adminRoutes);
app.use("/students", studentRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.redirect("/students");
});

app.listen(port, () => {
    log(`Server is running on http://localhost:${port}`);
});
