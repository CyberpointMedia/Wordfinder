const express = require('express');
const mongoose = require("mongoose");
const path =require("path");
const cors=require('cors');
const methodOverride = require('method-override');

const Section = require("./models/section");
const User = require('./models/user');

const bodyParser = require('body-parser');
const { parse } = require('node-html-parser');
const session = require('express-session');


const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const sectionRoutes = require('./routes/section');
const adminRoutes = require('./routes/admin');
const editorRoutes = require('./routes/editor'); // Import the editor routes
const pagesRoutes = require('./routes/pages');


const app = express();
const port = 8080;


// Express session middleware
app.use(session({
    secret: 'your-long-random-secret-key',
    resave: false,
    saveUninitialized: true,
}));

app.use(cors({
    origin:'*',
}))

app.locals.parser = parse;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up EJS as the view engine
app.set("views",path.join(__dirname,"views"));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use('/admin/node_modules', express.static(path.join(__dirname, 'node_modules')));
// Use method-override middleware
app.use(methodOverride("_method"));

//mongodb 
const MONGO_URL ="mongodb://127.0.0.1:27017/word_finder";
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}


// Use the user and auth routes
app.use('/user', userRoutes);
// Use the authentication routes
app.use('/auth', authRoutes);
//post route 
app.use('/post', postRoutes);
// Use the section routes
app.use('/admin/section', sectionRoutes);
// Use the admin routes
app.use('/admin', adminRoutes);
// Use the editor routes
app.use('/editor', editorRoutes);
//pages
app.use('/admin/pages', pagesRoutes);


// Dashboard route
app.get('/user/dashboard', (req, res) => {
    const user = req.session.user;

    if (user) {
        // User is authenticated
        res.render('user/dashboard', { user });
    } else {
        // User not found in the session
        res.send('User not found');
    }
});

//user routes
app.get('/register', (req, res) => {
   res.render('register');
 });

 app.get('/login', (req, res) => {
     res.render('user/login');
 });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
