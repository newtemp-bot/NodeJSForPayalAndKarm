const mongoose = require("mongoose");

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
            ref: "Student",
        },
    ],
});

module.exports = mongoose.model("Course", courseSchema);
