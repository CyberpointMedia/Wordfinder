// routes/post.js

const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const Post = require('../models/post'); 
const wrapAsync = require('../middleware/wrapAsync');
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require('multer');
const multerS3 = require('multer-s3');

// Set up AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.YOUR_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.YOUR_AWS_SECRET_ACCESS_KEY
  }
});

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).render('not-found/page-not-found.ejs');
});

// Set up multer
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.YOUR_BUCKET_NAME,
    //acl: 'public-read', // files in the bucket are public
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});
  
router.get('/create', (req, res) => {
    res.render('post/new-post');
});

// Logic to handle post creation
router.post('/create', upload.single('picture__input'), (req, res) => {
    if (!req.file) {
        return res.status(400).json('No file uploaded');
    }

    console.log(req.file);
    const newPost = new Post({
      title: req.body.title,
      description: req.body.description,
      features: req.body.features,
      picture: req.file.location, // URL of the uploaded file on S3
      status: req.body.status
    });
  
    newPost.save()
      .then(() => res.redirect('/post/all'))
      .catch(err => res.status(400).json('Error: ' + err));
});
// Show all posts
router.get('/all', async (req, res) => {
    try {
      const posts = await Post.find();
      res.render('post/all-posts', { posts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.get('/published', async (req, res) => {
    try {
      const posts = await Post.find({ status: 'Published' });
      res.render('post/all-posts', { posts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.get('/trash', async (req, res) => {
    try {
      const posts = await Post.find({ status: 'Trash' });
      res.render('post/all-posts', { posts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.get('/draft', async (req, res) => {
    try {
      const posts = await Post.find({ status: 'Draft' });
      res.render('post/all-posts', { posts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  router.get("/edit/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findById(id);
      res.render("post/edit-post", { post });
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  router.post('/edit/:id', upload.single('picture__input'), wrapAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).send('Post not found');
    }
  
    post.title = req.body.title;
    post.description = req.body.description;
    post.features = req.body.features;
    post.status = req.body.status;
  
    if (req.file) {
      post.picture = req.file.location; 
    }
  
    await post.save();
    res.redirect('/post/all');
  }));
  router.get('/categories', wrapAsync(async (req, res) => {
    try {
        res.render('post/categories');
    } catch (error) {
        console.error('Error fetching pages:', error);
        res.status(500).send('Internal Server Error');
    }
  }));
  
  router.get('/tags', wrapAsync(async (req, res) => {
    try {
        res.render('post/tags');
    } catch (error) {
        console.error('Error fetching pages:', error);
        res.status(500).send('Internal Server Error');
    }
  }));
  
module.exports = router;
