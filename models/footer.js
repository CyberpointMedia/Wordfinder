const mongoose = require('mongoose');

const widgetSchema = new mongoose.Schema({
    name: {
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
    }
});
const footerSchema = new mongoose.Schema({
    footerCol1: [widgetSchema],
    footerCol2: [widgetSchema],
    footerCol3: [widgetSchema],
    footerCol4: [widgetSchema]
});

module.exports = mongoose.model('Footer', footerSchema);