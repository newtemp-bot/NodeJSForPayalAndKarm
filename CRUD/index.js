const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // Set the views directory

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// MongoDB connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB", err));

// Student schema and model
const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        dob: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true, versionKey: false }
);

const Student = mongoose.model("students", studentSchema);

// HTML Routes
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.render('list', { data: students });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// API Routes
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// ...existing code...

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
