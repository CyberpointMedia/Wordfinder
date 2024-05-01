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
    const images = await Image.find().sort({ createdAt: -1 });

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
// Get image details
router.get('/image/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.json(image);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log("image uplaoded",req.file);
    const file = req.file;
    const imageUrl = file.location;

    const image = new Image({
      src: imageUrl,
      uploadedBy: req.user.username,
      filename: file.originalname,
      filetype: file.mimetype,
      filesize: file.size,
      dimensions: `${file.width} by ${file.height} pixels`,
      fileUrl: imageUrl
    });

    await image.save();

    res.json({ link: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/upload-multiple', upload.array('files', 10), async (req, res) => {
  try {
    console.log("image uplaoded",req.files);
    const files = req.files;
    const imageUrls = [];

    for (let file of files) {
      const imageUrl = file.location;

      const image = new Image({
        src: imageUrl,
        uploadedBy: req.user.username,
        filename: file.originalname,
        filetype: file.mimetype,
        filesize: file.size,
        dimensions: `${file.width} by ${file.height} pixels`,
        fileUrl: imageUrl
      });

      await image.save();
      imageUrls.push(imageUrl);
    }
    console.log(imageUrls);
    res.json({ links: imageUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.delete('/image/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    await image.remove();
    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;