/**
 * @file src/index.js
 * @description Application entry point. Bootstraps Express, Socket.IO, and
 *              connects to MongoDB before starting the HTTP server.
 */

import 'dotenv/config';
import http from 'http';
import createApp from './app.js';
import connectDB from './config/db.js';
import logger from './config/logger.js';
import { initSocket } from './sockets/socket.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // 1. Connect to MongoDB
  await connectDB();

  // 2. Create Express application
  const app = createApp();

  // 3. Create HTTP server
  const server = http.createServer(app);

  // 4. Initialize Socket.IO
  initSocket(server);

  // 5. Start listening
  server.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    logger.info(`Health: http://localhost:${PORT}/api/health`);
  });

  // ─── Graceful shutdown ───────────────────────────────────────────────────────
  const shutdown = (signal) => {
    logger.info(`${signal} received. Shutting down gracefully…`);
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Catch unhandled promise rejections
  process.on('unhandledRejection', (reason) => {
    console.error('--- RAW UNHANDLED REJECTION ---', reason);
    logger.error('Unhandled Rejection:', reason);
    server.close(() => process.exit(1));
  });

  process.on('uncaughtException', (err) => {
    console.error('--- RAW UNCAUGHT EXCEPTION ---', err);
    process.exit(1);
  });
};

startServer().catch(err => {
  console.error("STARTUP ERROR:", err);
  process.exit(1);
});
