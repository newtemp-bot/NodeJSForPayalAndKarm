const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dob:{
        type:Date,
        required:true
    }
},{timestamps:true,versionKey: false});

const Students = new mongoose.model("students", studentSchema);

mongoose.connect('mongodb://localhost:27017/bascom')
.then(async () => {
    console.log('Connected to MongoDB');
    
    const result = await Students.aggregate([
        {
            $lookup: {
                from: "courses",
                let: {
                    studentId: "$_id"
                },
                pipeline: [
                    {
                        $addFields: {
                            studentsEnrolledObjectIds: {
                                $map: {
                                    input: "$studentsEnrolled",
                                    as: "student",
                                    in: {
                                        $toObjectId: "$$student"
                                    } // Convert string to ObjectId
                                }
                            }
                        }
                    },
                    {
                        $match: {
                            $expr: {
                                $in: [
                                    "$$studentId",
                                    "$studentsEnrolledObjectIds"
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            courseName: 1,
                            startDate: 1,
                            duration: 1
                        }
                    }
                ],
                as: "enrolledCourses"
            }
        }
    ]);

    const buffer = Buffer.from(JSON.stringify(result, null, 2));
    console.log(buffer.toString());
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});