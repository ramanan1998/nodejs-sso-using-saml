const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const samlConfig = require('./saml');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new SamlStrategy(
  {
    path: '/auth/saml/callback',
    entryPoint: samlConfig.entryPoint,
    issuer: samlConfig.issuer,
    cert: samlConfig.cert,
    signatureAlgorithm: 'sha256',
    identifierFormat: null, // Important for some IdPs
    authnRequestBinding: 'HTTP-POST', // or 'HTTP-Redirect'
    attributeMap: {
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'name',
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': 'email'
    }
  },
  (profile, done) => {
    return done(null, {
      id: profile.nameID,
      name: profile.name || profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      email: profile.email || profile.nameID,
      _raw: profile // Keep raw data for debugging
    });
  }
));

module.exports = passport;