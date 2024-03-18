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
    show_search: {
        type: Boolean,
        default: false,
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
        type: String,
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
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    });

const Page = mongoose.model('Page', pageSchema);
module.exports = Page;
