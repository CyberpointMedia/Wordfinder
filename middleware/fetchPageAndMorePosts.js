//middleware//fetchPageAndMorePosts.js
const Post = require('../models/post');
const Page = require('../models/pages');
const Appearance = require('../models/appearance');
const ShowMenu = require('../models/show-menu');
const mongoose = require('mongoose');

const fetchPageAndMorePosts = async (req, res, next) => {
    try {
        const morePosts = await Post.find({ status: 'Published' }).limit(3);
        const page = await Page.findOne({ status: 'Published' });
        const appearance = await Appearance.find();
        let menus;
        try {
            menus = await ShowMenu.find().populate({
                path: 'items.id',
                match: { type: { $in: ['page', 'post'] } }
            });
        } catch (error) {
            if (error instanceof mongoose.Error.MissingSchemaError) {
                menus = await ShowMenu.find();
            } else {
                throw error;
            }
        }
        res.locals.morePosts = morePosts;
        res.locals.page = page;
        res.locals.menus = menus;
        res.locals.customLinks = appearance.length > 0 ? appearance[0].customLinks : []; // check if appearance is not empty
        next();
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = fetchPageAndMorePosts;