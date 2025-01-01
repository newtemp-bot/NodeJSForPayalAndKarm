const mongoose = require("mongoose");
const Student = require("../models/student");
const Course = require("../models/course");

exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        const successMessage = req.session.successMessage;
        const errorMessage = req.session.errorMessage;
        req.session.successMessage = null;
        req.session.errorMessage = null;
        res.render("list", { data: students, successMessage, errorMessage });
    } catch (err) {
        console.error(`Server Error: ${err.message}`);
        res.status(500).send("Server Error");
    }
};

exports.getStudentForm = async (req, res) => {
    try {
        const courses = await Course.find({ startDate: { $gt: new Date() } });
        const successMessage = req.session.successMessage;
        const errorMessage = req.session.errorMessage;
        req.session.successMessage = null;
        req.session.errorMessage = null;
        res.render("upsert", { data: courses, student: null, successMessage, errorMessage });
    } catch (err) {
        console.error(`Server Error: ${err.message}`);
        res.status(500).send("Server Error");
    }
};

exports.editStudentForm = async (req, res) => {
    const studentId = req.params.id;
    try {
        const student = await Student.findById(studentId);
        const courses = await Course.find({ startDate: { $gt: new Date() } });
        res.render("upsert", { data: courses, student });
    } catch (err) {
        console.error(`Server Error: ${err.message}`);
        res.status(500).send("Server Error");
    }
};

exports.addStudent = async (req, res) => {
    const { name, dob, courses } = req.body;

    try {
        const newStudent = new Student({ name, dob });
        const savedStudent = await newStudent.save();
        let studentID = savedStudent._id.toString();
        await Course.updateMany(
            { _id: { $in: courses } },
            { $addToSet: { studentsEnrolled: studentID } }
        );
        req.session.successMessage = "Student added successfully!";
        res.redirect("/students");
    } catch (err) {
        console.error(`Server Error: ${err.message}`);
        req.session.errorMessage = "Failed to add student.";
        res.redirect("/students");
    }
};

exports.updateStudent = async (req, res) => {
    const studentId = req.params.id;
    const { name, dob, courses } = req.body;

    try {
        await Student.findByIdAndUpdate(studentId, { name, dob });
        await Course.updateMany(
            { studentsEnrolled: studentId },
            { $pull: { studentsEnrolled: studentId } }
        );
        await Course.updateMany(
            { _id: { $in: courses } },
            { $addToSet: { studentsEnrolled: studentId } }
        );
        req.session.successMessage = "Student updated successfully!";
        res.redirect("/students");
    } catch (err) {
        console.error(`Server Error: ${err.message}`);
        req.session.errorMessage = "Failed to update student.";
        res.redirect("/students");
    }
};

exports.deleteStudent = async (req, res) => {
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
        console.error(`Server Error: ${err.message}`);
        req.session.errorMessage = "Failed to delete student.";
        res.redirect("/students");
    }
};

exports.viewStudent = async (req, res) => {
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
                                    in: { $toObjectId: "$$student" },
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
                                ],
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
        console.error(`Server Error: ${err.message}`);
        res.status(500).send("Server Error");
    }
};
