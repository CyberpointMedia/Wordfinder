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
        required: false,
    },
    content:{
        type: String,
        required: false,
    },
    image: {
        type: String, 
        ref: 'Image',
    },
    imagePosition: {
        type: String,
        enum: ['center', 'right', 'left'],
        required: false,
    },
    status: {
        type: String,
        enum: ['Published', 'Trash', 'Draft'],
        default: 'Draft',
    },
    
}, { timestamps: true });

const Section = mongoose.model("Section", sectionSchema);
module.exports = Section;
