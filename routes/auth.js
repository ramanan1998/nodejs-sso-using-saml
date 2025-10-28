const express = require('express');
const passport = require('passport');
const router = express.Router();
const Saml2js = require('saml2js');


// Home page
router.get('/', (req, res) => {
  console.log('Rendering index.ejs', req.user);
  res.redirect("/login")
});

// Login page
router.get('/login', (req, res) => {
  res.render('login');
});
//passport.use(samlStrategy)
// Initiate SAML auth
router.get('/auth/saml',
  passport.authenticate('saml', { failureRedirect: '/login' })
);

// SAML callback
router.post('/auth/saml/callback',
  passport.authenticate('saml', { failureRedirect: '/login' }),
  (req, res) => {
    console.log('=== POST-SAML SESSION ===');
    console.log('User:', req.user);  // Passport.js user object
    console.log('Session:', req.session);
    res.redirect('/');
  }
);

// Logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { 
      return next(err); 
    }
    // Destroy session completely (optional)
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

module.exports = router;