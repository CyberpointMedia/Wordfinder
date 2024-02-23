// routes/post.js

const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const Post = require('../models/post'); // Import the Post model
const wrapAsync = require('../middleware/wrapAsync');

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).render('not-found/page-not-found.ejs');
});

// Logic to handle post creation
router.post('/create',wrapAsync(async (req, res) => {
    console.log("user----", req);
    // Extract data from the request body
    const { title, description, thumbnailUrl, features } = req.body;

    try {
        // Create a new post in the database
        const newPost = new Post({
            title,
            description,
            thumbnailUrl,
            features,
        });

        // Get the currently logged-in user
        const currentUser = req.user; // Assuming you are using a middleware to set the user in the request
        if (currentUser) {
            // Update the post count for the user
            await User.findByIdAndUpdate(currentUser._id, { $inc: { postCount: 1 } });

            // Save the post
            await newPost.save();

            // Redirect to the all posts page after successful creation
            res.redirect('/post/all');
        } else {
            // Handle the case when no user is logged in
            res.status(401).send('Unauthorized');
        }
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).send('Internal Server Error');
    }
}));
// Show all posts
router.get('/all', wrapAsync(async (req, res) => {
    try {
        // Fetch all posts from MongoDB
        const posts = await Post.find();
        res.render('post/all-posts', { posts , userRole: req.session.userRole});
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('Internal Server Error');
    }
}));

// Create a new post
router.get('/new', (req, res) => {
    console.log('Reached /post/new route');
    res.render('post/new-post');
});
// Display the edit form for a specific post
router.get('/:id/edit', wrapAsync(async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.render('post/edit-post', { post });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send('Internal Server Error');
    }
}));
router.put('/:id', wrapAsync(async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    thumbnailUrl:req.body.thumbnailUrl,
                    features:req.body.features,
                    // ... (update other fields as needed)
                }
            },
            { new: true } // Return the updated document
        );

        res.redirect('/post/all');
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).send('Internal Server Error');
    }
}));
  

module.exports = router;
