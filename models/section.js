// models/section.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sectionSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    subHeading: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Assuming you store the image URL as a string
        required: true,
        default: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    },
    imagePosition: {
        type: String, // Assuming the position is stored as a string
        enum: ['center', 'right', 'left'], // You can customize the values based on your requirements
        required: true,
    },
});

const Section = mongoose.model("Section", sectionSchema);
module.exports = Section;
