const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const session = require("express-session");

dotenv.config();

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
app.set("views", __dirname + "/views"); // Set the views directory

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
const courseSchema = new mongoose.Schema({
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
            type: String,
            ref: "students",
        },
    ],
});

const Course = mongoose.model("courses", courseSchema);

const Student = mongoose.model("students", studentSchema);

// HTML Routes
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        const successMessage = req.session.successMessage;
        const errorMessage = req.session.errorMessage;
        req.session.successMessage = null;
        req.session.errorMessage = null;
        res.render("list", { data: students, successMessage, errorMessage });
    } catch (err) {
        log(`Server Error: ${err.message}`);
        res.status(500).send("Server Error");
    }
});

app.get("/students/new", async (req, res) => {
    try {
        const courses = await Course.find({ startDate: { $gt: new Date() } });
        const successMessage = req.session.successMessage;
        const errorMessage = req.session.errorMessage;
        req.session.successMessage = null;
        req.session.errorMessage = null;
        res.render("add", { data: courses, successMessage, errorMessage });
    } catch (err) {
        log(`Server Error: ${err.message}`);
        res.status(500).send("Server Error");
    }
});
app.post("/students/add", async (req, res) => {
    const { name, dob, courses } = req.body;

    try {
        const newStudent = new Student({ name, dob });
        const savedStudent = await newStudent.save();
        let studentID =  savedStudent._id.toString();
        await Course.updateMany(
            { _id: { $in: courses } },
            { $addToSet: { studentsEnrolled: studentID } }
        );
        req.session.successMessage = "Student added successfully!";
        res.redirect("/students");
    } catch (err) {
        log(`Server Error: ${err.message}`);
        req.session.errorMessage = "Failed to add student.";
        res.redirect("/students");
    }
});

app.get("/students/view/:id", async (req, res) => {
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
        const successMessage = req.session.successMessage;
        const errorMessage = req.session.errorMessage;
        req.session.successMessage = null;
        req.session.errorMessage = null;
        res.render("view", { data: students, successMessage, errorMessage });
    } catch (err) {
        log(`Server Error: ${err.message}`);
        res.status(500).send("Server Error");
    }
});

app.get("/students/delete/:id", async (req, res) => {
    const studentId = req.params.id;
    try {
        await Student.findByIdAndDelete(studentId);
        await Course.updateMany(
            { studentsEnrolled: studentId },
            { $pull: { studentsEnrolled: studentId } }
        );
        req.session.successMessage = "Student deleted successfully!";
        res.redirect("/students");
    } catch (err) {
        log(`Server Error: ${err.message}`);
        req.session.errorMessage = "Failed to delete student.";
        res.redirect("/students");
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
