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
    }
});
const Widget = mongoose.model('Widget', WidgetSchema);

module.exports = Widget;
