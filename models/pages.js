// models/pages.js
const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
    page_name: {
        type: String,
        required: true,
    },
    sections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
    }],
    content: {
        type: String,
        default: "abcd",
    },
});

const Page = mongoose.model('Page', pageSchema);

module.exports = Page;
