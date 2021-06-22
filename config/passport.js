const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const operations = require("../repositories/users");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretKey;

passport.use(
  new JwtStrategy(opts, async function (payload, done) {
    try {
      const id = payload.id;
      const user = await operations.findById(id);
      if (!user) {
        return done(new Error("User not found"));
      }
      if (!user.token) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      done(err, false);
    }
  })
);
