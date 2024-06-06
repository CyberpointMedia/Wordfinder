 const request = require('supertest');
 const express = require('express');
 const app = express();

 describe('GET /user-profile', () => {
   it('should return 200 and render the user profile page when authenticated', async () => {
     // Mock isAuthenticated to always return true
     app.use((req, res, next) => {
       req.isAuthenticated = () => true;
       req.user = { username: 'test' };
       next();
     });

     const res = await request(app).get('/user-profile');
     expect(res.statusCode).toEqual(200);
   });

   it('should return 302 and redirect to the login page when not authenticated', async () => {
     // Mock isAuthenticated to always return false
     app.use((req, res, next) => {
       req.isAuthenticated = () => false;
       next();
     });

        const res = await request(app).get('/user-profile');
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toEqual('/auth/login');
        });
      });
    router.post('/user-profile', upload.single('image'), async (req, res) => {
     const { email, website } = req.body;
     const user = await User.findById(req.user._id);
     user.email = email;
      if (website) {
          user.website = website;
         }

           console.log("req.file", req.body);
       if (req.file) {
           const upload = s3Stream.upload({
               Bucket: process.env.YOUR_BUCKET_NAME,
               Key: req.file.originalname,
               // ACL: 'public-read',
           });

         upload.on('uploaded', function (details) {
             user.image = details.Location;
             user.save();
             res.redirect('/user/user-profile');
         });

         stream.Readable.from(req.file.buffer).pipe(upload);
         } else {
         await user.save();
         console.log("user", user);
         res.redirect('/user/user-profile?message=Profile%20updated%20successfully');
        }
     });

    describe('Error handling middleware', () => {
     it('should return 404 and render the not found page', async () => {
       // Add a route that throws an error to trigger the error handling middleware
       app.get('/error', (req, res, next) => {
         next(new Error('Test error'));
      });
  
      const res = await request(app).get('/error');
      expect(res.statusCode).toEqual(404);
    });
  });