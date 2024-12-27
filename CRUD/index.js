const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views"); // Set the views directory

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); // Serve static files from the 'public' directory

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
        res.render("list", { data: students });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

app.get("/view/:id", async (req, res) => {
    console.log(req.params.id);
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
        console.log(students);
        res.render("view", { data: students });
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
