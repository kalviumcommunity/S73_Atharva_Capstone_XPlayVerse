import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

function generateUsernameFromEmailOrName(email, name) {
  const base = (name ? name.split(' ')[0] : (email ? email.split('@')[0] : 'user'))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const suffix = Math.floor(Math.random() * 9000) + 1000;
  return `${base}${suffix}`;
}

export default function initGooglePassport(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          let user = null;

          user = await User.findOne({ googleId: profile.id });

          if (!user && email) {
            user = await User.findOne({ email });
          }

          if (!user) {
            const newUser = new User({
              name: profile.displayName || (email ? email.split('@')[0] : 'Unknown'),
              email,
              googleId: profile.id,
              profilePicture: profile.photos?.[0]?.value || '',
              provider: 'google',
              username: generateUsernameFromEmailOrName(email, profile.displayName),
              lastLogin: new Date()
            });
            user = await newUser.save();
          } else if (!user.googleId) {
            user.lastLogin = new Date();
            user.googleId = profile.id;
            user.provider = 'google';
            if (!user.profilePicture) user.profilePicture = profile.photos?.[0]?.value || '';
            if (!user.username) user.username = generateUsernameFromEmailOrName(user.email, user.name);
            await user.save();
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser?.((user, done) => done(null, user._id));
  passport.deserializeUser?.(async (id, done) => {
    try {
      const u = await User.findById(id);
      done(null, u);
    } catch (e) {
      done(e, null);
    }
  });
}
