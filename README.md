
```markdown
# WordFinder

Welcome to WordFinder, a Node.js application designed to help users explore and interact with words. Below, you'll find instructions on how to set up the project and its dependencies.

## Setup

Make sure you have Node.js version `20.3.0` installed on your machine.

## Installation

```bash
git clone https://github.com/CyberpointMedia/Wordfinder.git
cd wordfinder 
npm install
```

## Configuration

Create a `.env` file in the root directory of the project and add the following environment variables:

```
PORT=8080
MONGO_URL=mongodb://localhost:27017/wordfinder
Host=
YOUR_AWS_SECRET_ACCESS_KEY=
YOUR_AWS_ACCESS_KEY_ID=
YOUR_BUCKET_NAME=
AWS_REGION=
EMAIL=
PASSWORD=
```

## Running the Application

```bash
npm start
```

The application will be available at `http://localhost:8080` by default.

## File Structure

```
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
│   └── js/ 
│       ├── app.js 
│       ├── config.js 
│       ├── custom.js 
│       ├── jquery.min.js 
│       └── passport-config.js 
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
```
Here's the list of npm packages used in your project:

### Dependencies:
- alert-node: ^5.0.3
- apexcharts: ^3.45.1
- aws-sdk: ^2.1567.0
- axios: ^1.6.7
- bcrypt: ^5.1.1
- connect-flash: ^0.1.1
- core-js: ^3.35.0
- cors: ^2.8.5
- dotenv: ^16.4.3
- ejs: ^3.1.9
- express: ^4.18.2
- express-session: ^1.18.0
- express-sitemap-xml: ^3.0.1
- flatpickr: ^4.6.13
- geoip-lite: ^1.4.10
- jimp: ^0.3.5
- jquery-ui-dist: ^1.13.2
- lucide: ^0.302.0
- method-override: ^3.0.0
- mkdirp: ^1.0.0
- mongoose: ^8.0.2
- morris.js: ^0.5.0
- multer: ^1.4.5-lts.1
- multer-s3: ^3.0.1
- node-html-parser: ^6.1.11
- nodemon: ^3.0.3
- passport: ^0.7.0
- passport-local: ^1.0.0
- passport-local-mongoose: ^8.0.0
- postcss-cli: ^11.0.0
- preline: ^2.0.3
- raphael: ^2.3.0
- s3-upload-stream: ^1.0.7
- sanitize-html: ^2.11.0
- share-buttons: ^1.9.0
- simplebar: ^6.2.5
- sitemap: ^7.1.1
- sitemap-generator: ^8.5.1
- word-definition: ^2.1.6
- xml2js: ^0.6.2

### DevDependencies:
- autoprefixer: ^10.4.16
- jest: ^29.7.0
- postcss: ^8.4.35
- supertest: ^6.3.4
- tailwindcss: ^3.4.1

These packages are listed in your `package.json` file under the `dependencies` and `devDependencies` sections.

## Additional Notes

- Make sure MongoDB is running locally or update the `MONGO_URL` in the `.env` file with your MongoDB connection string.
- AWS S3 bucket details are required for certain functionalities of the application. Update the relevant AWS environment variables in the `.env` file accordingly.
- The application uses RapidAPI for certain features. Ensure you have the necessary API keys and update the `Key` and `Host` variables in the `.env` file.
- The default admin credentials are provided in the `.env` file. It's recommended to change these credentials in a production environment.

That's it! You should now have WordFinder up and running on your local machine. If you have any questions or run into issues, feel free to reach out.
```

