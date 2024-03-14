// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
        required: false    },
    role: {
        type: String,
        enum: ['subscriber', 'author', 'editor', 'administrator'],
        default: 'subscriber'
    },
    image: {
        type: String,
        default: ''
    },
    sendNotification: {
        type: Boolean,
        default: false
    }
});
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
const User = mongoose.model('User', userSchema);
module.exports = User;