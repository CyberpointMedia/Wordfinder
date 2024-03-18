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
        type: String, 
        ref: 'Image',
    },
    imagePosition: {
        type: String,
        enum: ['center', 'right', 'left'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Published', 'Trash', 'Draft'],
        default: 'Draft',
    },
    
});

const Section = mongoose.model("Section", sectionSchema);
module.exports = Section;
