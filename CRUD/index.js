const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Logger setup
const logFilePath = path.join(__dirname, 'server.log');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

function log(message) {
    const timestamp = new Date().toISOString();
    logStream.write(`[${timestamp}] ${message}\n`);
}

app.set("view engine", "ejs");
app.set("views", __dirname + "/views"); // Set the views directory

// Middleware
app.use((req, res, next) => {
    log(`${req.method} ${req.url}`);
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); // Serve static files from the 'public' directory

// MongoDB connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => log("Connected to MongoDB"))
    .catch((err) => log(`Could not connect to MongoDB: ${err.message}`));

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
const courseSchema = new mongoose.Schema(
    {
        courseName: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        studentsEnrolled: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "students",
            },
        ],
    },
);

const Course = mongoose.model("courses", courseSchema);

const Student = mongoose.model("students", studentSchema);

// HTML Routes
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.render("list", { data: students });
    } catch (err) {
        log(`Server Error: ${err.message}`);
        res.status(500).send("Server Error");
    }
});

app.get("/students/new", async (req, res) => {
    try {
        const courses = await Course.find({ "startDate": { "$gt": new Date() } });
        res.render("add", { data: courses });
    } catch (err) {
        log(`Server Error: ${err.message}`);
        res.status(500).send("Server Error");
    }
});

app.get("/view/:id", async (req, res) => {
    const studentId = req.params.id;
    const pipeline = [
        {
            $lookup: {
                from: "courses",
                let: { studentId: "$_id" },
                pipeline: [
                    {
                        $addFields: {
                            studentsEnrolledObjectIds: {
                                $map: {
                                    input: "$studentsEnrolled",
                                    as: "student",
                                    in: { $toObjectId: "$$student" }, // Convert string IDs to ObjectId
                                },
                            },
                        },
                    },
                    {
                        $match: {
                            $expr: {
                                $in: [
                                    "$$studentId",
                                    "$studentsEnrolledObjectIds",
                                ], // Match student ID
                            },
                        },
                    },
                    {
                        $project: {
                            courseName: 1,
                            startDate: 1,
                            duration: 1,
                        },
                    },
                ],
                as: "enrolledCourses",
            },
        },
        {
            $project: {
                name: 1,
                dob: 1,
                "enrolledCourses.courseName": 1,
                "enrolledCourses.startDate": 1,
                "enrolledCourses.duration": 1,
            },
        },
        {
            $match: {
                _id: new mongoose.Types.ObjectId(studentId),
            },
        },
    ];

    try {
        const students = await Student.aggregate(pipeline);
        res.render("view", { data: students });
    } catch (err) {
        log(`Server Error: ${err.message}`);
        res.status(500).send("Server Error");
    }
});

// API Routes
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        log(`Server Error: ${err.message}`);
        res.status(500).send("Server Error");
    }
});

// ...existing code...

app.listen(port, () => {
    log(`Server is running on http://localhost:${port}`);
});
