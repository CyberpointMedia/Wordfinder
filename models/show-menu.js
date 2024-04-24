//models/show-menu.js
const mongoose = require('mongoose');

const ShowMenuSchema = new mongoose.Schema({
    menuName: {
        type: String,
        required: true
    },
    items: [{
            type: {
                type: String,
                enum: ['page', 'post', 'customLink'],
                required: true
            },
            id: {
                type: mongoose.Schema.Types.ObjectId,
                refPath: 'items.type'
            },
            updated_name: String,
            parent: String
        }]
    }, { timestamps: true });
    
module.exports = mongoose.model('ShowMenu', ShowMenuSchema);
