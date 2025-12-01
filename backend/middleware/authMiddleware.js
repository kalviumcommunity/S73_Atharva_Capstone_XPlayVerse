import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers?.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query?.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Session expired, login again' });
      }
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (!decoded?.id) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.tokenPayload = decoded;

    return next();
  } catch (err) {
    console.error('authMiddleware error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default authMiddleware;
