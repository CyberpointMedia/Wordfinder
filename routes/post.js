// routes/post.js

const express = require('express');
const router = express.Router();
const Post = require('../models/post'); 
const wrapAsync = require('../middleware/wrapAsync');
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require('multer');
const multerS3 = require('multer-s3');
const Category = require('../models/categories'); 

// Set up method-override
const methodOverride = require('method-override');
router.use(methodOverride('_method'));
router.use(express.urlencoded({ extended: true }));

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
  
router.get('/create', async (req, res) => {
  try {
      const categories = await Category.find();
      res.render('post/new-post', { user: req.user, categories });
  } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).send('Internal Server Error');
  }
});
// Logic to handle post creation
router.post('/create', upload.fields([{ name: 'picture__input', maxCount: 1 }, { name: 'feature_img', maxCount: 1 }]), (req, res) => {
  if (!req.files) {
      return res.status(400).json('No files uploaded');
  }

  console.log(req.files);
  const newPost = new Post({
    title: req.body.title,
    description: req.body.description,
    picture: req.files['picture__input'][0].location, // URL of the uploaded thumbnail file on S3
    feature_img: req.files['feature_img'][0].location, // URL of the uploaded feature file on S3
    status: req.body.status,
    category: req.body.category // Save the category ID
  });

  newPost.save()
    .then(() => res.redirect('/post/all'))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Show all posts
router.get('/all', async (req, res) => {
  try {
      const allCount = await Post.countDocuments();
      const publishedCount = await Post.countDocuments({ status: 'Published' });
      const trashCount = await Post.countDocuments({ status: 'Trash' });
      const draftCount = await Post.countDocuments({ status: 'Draft' });
      const posts = await Post.find({ status: { $in: ['Published', 'Draft'] } }).populate('category');
      res.render('post/all-posts', { allCount, publishedCount, trashCount, draftCount ,posts , user: req.user});
  } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).send('Internal Server Error');
  }
});
  
  router.get('/published', async (req, res) => {
    try {
        const posts = await Post.find({ status: 'Published' });
        const allCount = await Post.countDocuments();
        const publishedCount = await Post.countDocuments({ status: 'Published' });
        const trashCount = await Post.countDocuments({ status: 'Trash' });
        const draftCount = await Post.countDocuments({ status: 'Draft' });
        res.render('post/all-posts', { posts, user: req.user, allCount, publishedCount, trashCount, draftCount });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/trash', async (req, res) => {
    try {
        const posts = await Post.find({ status: 'Trash' });
        const allCount = await Post.countDocuments();
        const publishedCount = await Post.countDocuments({ status: 'Published' });
        const trashCount = await Post.countDocuments({ status: 'Trash' });
        const draftCount = await Post.countDocuments({ status: 'Draft' });
        res.render('post/all-posts', { posts, user: req.user, allCount, publishedCount, trashCount, draftCount });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.delete('/delete/:id', async (req, res) => {
  try {
      console.log('Delete post:', req.params.id);
      await Post.findByIdAndDelete(req.params.id);
      res.redirect('post/trash');
  } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).send('Internal Server Error');
  }
});

router.get('/draft', async (req, res) => {
    try {
        const posts = await Post.find({ status: 'Draft' });
        const allCount = await Post.countDocuments();
        const publishedCount = await Post.countDocuments({ status: 'Published' });
        const trashCount = await Post.countDocuments({ status: 'Trash' });
        const draftCount = await Post.countDocuments({ status: 'Draft' });
        res.render('post/all-posts', { posts, user: req.user, allCount, publishedCount, trashCount, draftCount });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Internal Server Error');
    }
});
  
  router.get("/edit/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findById(id);
      const categories = await Category.find();
      res.render("post/edit-post", { post , user: req.user,categories});
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.post('/edit/:id', upload.fields([{ name: 'picture__input', maxCount: 1 }, { name: 'feature_img', maxCount: 1 }]), wrapAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).send('Post not found');
    }
  
    post.title = req.body.title;
    post.description = req.body.description;
    post.status = req.body.status;
    post.category = req.body.category;
    if (req.files) {
      if (req.files['picture__input']) {
        post.picture = req.files['picture__input'][0].location;
      }
      if (req.files['feature_img']) {
        post.feature_img = req.files['feature_img'][0].location;
      }
    }
  
    await post.save();
    res.redirect('/post/all');
}));
//change the status of the post
router.put('/updateStatus/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        post.status = req.body.status;
        await post.save();
        res.json({ message: 'Post status updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

  ///categories routes 
  router.get('/categories', wrapAsync(async (req, res) => {
    try {
        // Fetch categories
        const categories = await Category.find();
        // Render categories view
        console.log('Get categories:', categories);
        res.render('post/categories', { categories ,user: req.user});
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Internal Server Error');
    }
}));
// Handle category creation
router.post('/categories', wrapAsync(async (req, res) => {
    let { catName, slugName, ParentCatName, DescriptionName } = req.body;
    console.log('DescriptionName:', DescriptionName); // Add this line
    // Check if the category's name is already registered
    const existingCategory = await Category.findOne({ name: catName });

    if (existingCategory) {
        return res.status(400).send('Category with this name already exists');
    }

    // If ParentCatName is an empty string, set it to null
    if (ParentCatName === '') {
        ParentCatName = null;
    }

    // Create a new category and save it to the database
    const newCategory = new Category({ 
        name: catName, 
        slug: slugName, 
        parentCategory: ParentCatName, 
        description: DescriptionName 
    });
    await newCategory.save();
    console.log('New category:', newCategory);

    res.redirect('/post/categories'); // Redirect to the categories page
}));

router.delete('/categories/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Category.findByIdAndDelete(id);
  res.redirect('/post/categories');
}));
  
  router.get('/tags', wrapAsync(async (req, res) => {
    try {
        res.render('post/tags',{user: req.user});
    } catch (error) {
        console.error('Error fetching pages:', error);
        res.status(500).send('Internal Server Error');
    }
  }));
  
module.exports = router;
