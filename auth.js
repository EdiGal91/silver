const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const { clientID, clientSecret } = process.env;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID,
      clientSecret,
      callbackURL: "http://localhost:3002/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, { ...profile, accessToken });
    }
  )
);
