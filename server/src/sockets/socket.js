/**
 * @module sockets/socket
 * @description Core Socket.IO initialization.
 */

import { Server } from 'socket.io';
import { socketAuth } from './socket.middleware.js';
import { initSocketEvents } from './socket.events.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174'].filter(Boolean),
      credentials: true,
    },
    pingTimeout: 60000,
  });

  // Apply authentication middleware
  io.use(socketAuth);

  io.on('connection', (socket) => {
    // Socket connected
    
    // Initialize events for this socket
    initSocketEvents(io, socket);
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO is not initialized!');
  }
  return io;
};
