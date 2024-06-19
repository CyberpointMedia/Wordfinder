// models/appearance.js

const mongoose = require('mongoose');
const AppearanceSchema = new mongoose.Schema({
    menuName: {
        type: String,
        required: true
    },
    pages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page'
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    customLinks: [{
        url: String,
        text: String
    }],
    headerMenu: { 
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Appearance', AppearanceSchema);