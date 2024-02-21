const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['subscriber', 'contributor', 'author', 'editor', 'administrator'],
        default: 'subscriber'
    },
    sendNotification: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
