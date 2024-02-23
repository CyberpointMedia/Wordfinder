//models//pages.js
const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    page_name: {
        type: String,
    },
    content: {
        type: String,
        default: " ",
    },
    sections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
    }],
    seoTitle: {
        type: String,
    },
    seoslug: {
        type: String,
    },
    metaDescription: {
        type: String,
    },
    breadcrumbsTitle: {
        type: String,
    },
    canonicalURL: {
        type: String,
    },
    searchEngines: {
        type: Number,
        default: "2",
    },
    hsRadioGroup: {
        type: String, // Assuming this should be a string based on the values in the form
    },
    metaRobots: {
        type: Number,
        default:"0", 
    },
    status: {
        type: String,
        enum: ['Published', 'Trash', 'Draft'],
        default: 'Draft',
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Page = mongoose.model('Page', pageSchema);
module.exports = Page;
