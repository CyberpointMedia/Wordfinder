const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const express = require('express');
const router = express.Router();

// Set up AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.YOUR_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.YOUR_AWS_SECRET_ACCESS_KEY
  }
});

router.get('/images', async (req, res) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.YOUR_BUCKET_NAME,
    });

    const output = await s3.send(command);

    const imageUrls = output.Contents.map(file => `https://${process.env.YOUR_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${file.Key}`);

    res.render("library/images", { imageUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;