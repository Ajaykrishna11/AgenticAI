import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'smartshelf_jwt_secret_key_2026_super_secure';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. Please provide a valid authentication token.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-passwordHash');
    
    if (!req.user) {
      // Fallback for demo mode if user id isn't found in DB
      req.user = { _id: decoded.id, name: decoded.name || 'Demo User', email: decoded.email || 'demo@smartshelf.ai' };
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token verification failed. Unauthorized request.' });
  }
};
