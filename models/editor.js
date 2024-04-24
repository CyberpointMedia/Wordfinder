const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10; // Number of salt rounds for bcrypt

const editorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Hash the password before saving to the database
editorSchema.pre('save', async function (next) {
    const editor = this;

    if (editor.isModified('password') || editor.isNew) {
        try {
            // Generate a salt
            const salt = await bcrypt.genSalt(saltRounds);

            // Hash the password using the generated salt
            const hashedPassword = await bcrypt.hash(editor.password, salt);

            // Set the hashed password in the editor document
            editor.password = hashedPassword;
            next();
        } catch (error) {
            return next(error);
        }
    } else {
        return next();
    }
});

const Editor = mongoose.model('Editor', editorSchema);
module.exports = Editor;
