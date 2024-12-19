/**
 * 
 * Second Way to connect NodeJS is mongodb.
 * npm i mongoose
 * 
 */

const mongoose = require('mongoose');
const data = require('./Mock_Data.json');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dob:{
        type:Date,
        required:true
    }
},{timestamps:true});

const Students = new mongoose.model("students", studentSchema);

mongoose.connect('mongodb://localhost:27017/bascom')
.then(async () => {
    console.log('Connected to MongoDB');
    
    // Inserting data
    //await Students.insertMany(data);
    for (const record of data) {
        await Students.updateMany(
            { name: record.name }, // Filter by `name` or any unique identifier
            { $set: record },      // Update operation
            { upsert: true }       // Insert document if no match is found
        );
    }
    console.log('Data saved successfully');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});