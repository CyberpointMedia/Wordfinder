<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WordFinder README</title>
    <style> 
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
        }
        h1 {
            font-size: 24px;
        }
        h2 {
            font-size: 20px;
        }
        code {
            background-color: #f4f4f4;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 2px 6px;
        }
        pre {
            background-color: #f4f4f4;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            overflow-x: auto;
        }
        .directory-tree {
            margin-left: 20px;
        }
        .directory-tree ul {
            list-style-type: none;
            padding-left: 20px;
        }
        .directory-tree ul li {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <h1>WordFinder</h1>
    <p>Welcome to WordFinder, a Node.js application designed to help users explore and interact with words. Below, you'll find instructions on how to set up the project and its dependencies.</p>
    
    <h2>Setup</h2>
    <p>Make sure you have Node.js version <code>20.3.0</code> installed on your machine.</p>
    
    <h2>Installation</h2>
    <pre><code>git clone &lt;repository-url&gt;
cd wordfinder
npm install</code></pre>
    
    <h2>Configuration</h2>
    <p>Create a <code>.env</code> file in the root directory of the project and add the following environment variables:</p>
    <pre><code>PORT=8080

MONGO_URL=mongodb://localhost:27017/wordfinder
Host=
YOUR_AWS_SECRET_ACCESS_KEY=
YOUR_AWS_ACCESS_KEY_ID
YOUR_BUCKET_NAME=
AWS_REGION=
EMAIL=
PASSWORD=</code></pre>
    
    <h2>Running the Application</h2>
    <pre><code>npm start</code></pre>
    <p>The application will be available at <code>http://localhost:8080</code> by default.</p>
    
    <h2>File Structure</h2>
    <div class="directory-tree">
        <pre>
wordfinder/
├── data.js
├── index.js
├── middleware/
│   ├── authmiddleware.js
│   ├── user-activity.js
│   └── wrapAsync.js
├── models/
│   ├── appearance.js
│   ├── categories.js
│   ├── editor.js
│   ├── footer.js
│   ├── library.js
│   ├── pages.js
│   ├── post.js
│   ├── section.js
│   ├── user-activity.js
│   ├── user.js
│   └── widget.js
├── node_modules/
├── public/
│   ├── images/
│   ├── js/
│   │   ├── app.js
│   │   ├── config.js
│   │   ├── custom.js
│   │   ├── jquery.min.js
│   │   └── passport-config.js
│   └── styles/
├── routes/
│   ├── admin.js
│   ├── appearance.js
│   ├── auth.js
│   ├── editor.js
│   ├── footer.js
│   ├── frontend.js
│   ├── library.js
│   ├── pages.js
│   ├── section.js
│   └── user-profile.js
├── src/
│   └── app.js
├── upload/
├── views/
│   ├── admin/
│   ├── appearance/
│   ├── auth/
│   ├── frontend/
│   ├── header/
│   ├── library/
│   ├── not-found/
│   ├── post/
│   ├── script/
│   ├── section/
│   ├── sidenav/
│   └── user/
├── .dockerignore
├── .env
├── .gitignore
├── Dockerfile
├── package-lock.json
├── package.json
├── postcss.config.js
└── tailwind.config.js
        </pre>
    </div>
    
    <h2>Additional Notes</h2>
    <ul>
        <li>Make sure MongoDB is running locally or update the <code>MONGO_URL</code> in the <code>.env</code> file with your MongoDB connection string.</li>
        <li>AWS S3 bucket details are required for certain functionalities of the application. Update the relevant AWS environment variables in the <code>.env</code> file accordingly.</li>
        <li>The application uses RapidAPI for certain features. Ensure you have the necessary API keys and update the <code>Key</code> and <code>Host</code> variables in the <code>.env</code> file.</li>
        <li>The default admin credentials are provided in the <code>.env</code> file. It's recommended to change these credentials in a production environment.</li>
    </ul>
    
    <p>That's it! You should now have WordFinder up and running on your local machine. If you have any questions or run into issues, feel free to reach out to the project maintainers. Happy word finding!</p>
</body>
</html>
