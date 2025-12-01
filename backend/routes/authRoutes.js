import express from 'express';
import passport from 'passport';
import authMiddleware from '../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=oauth_failed`
  }),
  (req, res) => {
    try {
      const user = req.user;

      if (!user) {
        console.error("Google OAuth Error: req.user is undefined");
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=no_user`);
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      // redirect to frontend auth success route and attach JWT so client can use it
      const frontendBase = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = `${frontendBase}/auth/success?token=${encodeURIComponent(token)}`;
      return res.redirect(redirectUrl);
      
    } catch (err) {
      console.error('Google OAuth Callback Error:', err);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=server`);
    }
  }
);

// GET /api/me - return authenticated user based on token cookie / Authorization header
router.get('/me', authMiddleware, (req, res) => {
  try {
    // authMiddleware populates req.user
    return res.json({ user: req.user });
  } catch (err) {
    console.error('GET /api/me error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
