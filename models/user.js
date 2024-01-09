// models / user.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    postCount: {
        type: Number,
        default: 1,
    },
    postLimit: {
        type: Number,
        default: 10, // Set a default value or adjust as needed
    },
    // Add fields for user profile
    username: {
        type: String,
    },
    bio: {
        type: String,
    },
    portfolioLink: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

});

// Hash the password before saving to the database
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
