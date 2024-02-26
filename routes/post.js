// routes/post.js

const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const Post = require('../models/post'); 
const multer = require('multer');
const wrapAsync = require('../middleware/wrapAsync');

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).render('not-found/page-not-found.ejs');
});

// Set up multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });
  
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
      picture: req.file.path,
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
      post.picture = req.file.path;
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
