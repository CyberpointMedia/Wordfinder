const mongoose = require('mongoose');

const WidgetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    texteditor:{
        type: String,
        required: false
    },
    Customhtml: {
        type: String,
        required: false
    },
    contactdetails: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    column: { 
        type: String,
        required: false
    },
    gtmUrl: {
        type: String,
        required: false
    },
    gtmHead: {
        type: String,
        required: false
    },
    gtmBody: {
        type: String,
        required: false
    }
}, { timestamps: true });
const Widget = mongoose.model('Widget', WidgetSchema);

module.exports = Widget;
