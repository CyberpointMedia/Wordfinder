//routes user.js
const express = require('express');
const User = require('../models/user');
const section = require('../models/section');
const passport = require('passport');
const router = express.Router();
const wrapAsync = require('../middleware/wrapAsync');
const { ensureAdmin, ensureEditor, ensureAuthor } = require('../middleware/authMiddleware');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const fs = require('fs'); 
const stream = require('stream'); // Import the stream module

aws.config.update({
    secretAccessKey: process.env.YOUR_AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.YOUR_AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION
});
const s3Stream = require('s3-upload-stream')(new aws.S3());
const s3 = new aws.S3();
// Remove the duplicate declaration of 's3Stream'

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
});

router.get('/user-profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('user/user-profile', { user: req.user });
    } else {
        res.redirect('/auth/login');
    }
});
router.post('/user-profile', upload.single('image'), async (req, res) => {
    const { email, website } = req.body;
    const user = await User.findById(req.user._id);
    user.email = email;
    if (website) {
        user.website = website;
    }
        console.log("req.file", req.body);
    if (req.file) {
        const upload = s3Stream.upload({
            Bucket: process.env.YOUR_BUCKET_NAME,
            Key: req.file.originalname,
            // ACL: 'public-read',
        });

        upload.on('uploaded', function (details) {
            user.image = details.Location;
            user.save();
            res.redirect('/user/user-profile');
        });

        stream.Readable.from(req.file.buffer).pipe(upload);
        } else {
        await user.save();
        console.log("user", user);
        res.redirect('/user/user-profile');
    }
});

module.exports = router;