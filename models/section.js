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
    content:{
        type: String,
        required: true,
    },
    image: {
        type: String, // Assuming you store the image URL as a string
    },
    imagePosition: {
        type: String, // Assuming the position is stored as a string
        enum: ['center', 'right', 'left'], // You can customize the values based on your requirements
        required: true,
    },
    status: {
        type: String,
        enum: ['Published', 'Trash', 'Draft'],
        default: 'Draft', // Set the default status as Draft
    },
});

const Section = mongoose.model("Section", sectionSchema);
module.exports = Section;
