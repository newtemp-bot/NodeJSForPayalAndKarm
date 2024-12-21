const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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
    { timestamps: true,versionKey: false }
);

const student = mongoose.model("students", studentSchema);

// HTML Routes
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});


app.get("/students", async (req, res) => {
    try {
        const students = await student.find();
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Students</title>
            <link rel="stylesheet" href="/styles.css">
            </head>
            <body>
            <table>
                <thead>
                <tr>
                    <th>Students Name</th>
                    <th>Date of Birth</th>
                </tr>
                </thead>
                <tbody>
                ${students
                .map(
                    (student) => `
                    <tr>
                    <td>${student.name}</td>
                    <td>${new Date(student.dob).toLocaleDateString()}</td>
                    </tr>`
                )
                .join("")}
                </tbody>
            </table>
            </body>
            </html>
        `);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// API Routes
app.get("/api/students", async (req, res) => {
    try {
        const students = await student.find();
        res.json(students);
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// ...existing code...

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
