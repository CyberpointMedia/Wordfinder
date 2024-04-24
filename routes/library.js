const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const multerS3 = require('multer-s3');
const Image = require('../models/library');
// Set up AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.YOUR_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.YOUR_AWS_SECRET_ACCESS_KEY
  }
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.YOUR_BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});

router.get('/images', async (req, res) => {
  try {
    const images = await Image.find();

    const command = new ListObjectsV2Command({
      Bucket: process.env.YOUR_BUCKET_NAME,
    });

    const output = await s3.send(command);

    const imageUrls = output.Contents.map(file => `https://${process.env.YOUR_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`);

    res.render("library/images", {images, imageUrls ,user: req.user});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/upload', upload.array('files'), async (req, res) => {
  try {
    console.log("uplaod respone req.body ",req.body);
    const imageUrls = req.files.map(file => file.location);

    // Create a new Image document for each file
    for (let file of req.files) {
      const image = new Image({
        src: file.location,
        uploadedBy: req.user.username, // Assuming the user is stored in req.user
        filename: file.originalname,
        filetype: file.mimetype,
        filesize: file.size,
        dimensions: `${file.width} by ${file.height} pixels`, // Assuming the dimensions are stored in file.width and file.height
        fileUrl: file.location
      });
      console.log("image info",image);
      await image.save();
    }
    console.log(imageUrls);
    res.json({ imageUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;