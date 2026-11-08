/**
 * @module sockets/socket.middleware
 * @description Middleware to authenticate Socket.IO connections.
 */

import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const socketAuth = async (socket, next) => {
  try {
    // Client can pass token in auth.token or headers
    let token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
    
    if (token && token.startsWith('Bearer ')) {
      token = token.split(' ')[1];
    }

    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id username name');
    
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    // Attach user to socket
    socket.user = user;
    next();
  } catch (error) {
    console.error('Socket Authentication Error:', error.message);
    next(new Error('Authentication error: Invalid token'));
  }
};
