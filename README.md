It seems that the formatting of your README file is not rendering correctly on GitHub. GitHub does not support all HTML and CSS styling in README files, so it's possible that some of your styling is not being applied.

To ensure your README looks good on GitHub, you should primarily use Markdown syntax for formatting. Markdown is supported by GitHub and provides a simple way to format text, add headers, lists, code blocks, and links.

Here's how you can convert your HTML content into Markdown:

```markdown
# WordFinder

Welcome to WordFinder, a Node.js application designed to help users explore and interact with words. Below, you'll find instructions on how to set up the project and its dependencies.

## Setup

Make sure you have Node.js version `20.3.0` installed on your machine.

## Installation

```bash
git clone <repository-url>
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

## Additional Notes

- Make sure MongoDB is running locally or update the `MONGO_URL` in the `.env` file with your MongoDB connection string.
- AWS S3 bucket details are required for certain functionalities of the application. Update the relevant AWS environment variables in the `.env` file accordingly.
- The application uses RapidAPI for certain features. Ensure you have the necessary API keys and update the `Key` and `Host` variables in the `.env` file.
- The default admin credentials are provided in the `.env` file. It's recommended to change these credentials in a production environment.

That's it! You should now have WordFinder up and running on your local machine. If you have any questions or run into issues, feel free to reach out.
```

Replace your existing README content with the Markdown version provided above, and it should render correctly on GitHub.
