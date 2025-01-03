const mongoose = require("mongoose");

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
        enrollmentNumber: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Student", studentSchema);
