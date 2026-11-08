/**
 * @module config/logger
 * @description Winston logger configuration.
 *
 * Provides a shared logger instance with:
 *  - Console transport (colourised) for development
 *  - Daily-rotate-file transport for production (logs/ directory)
 *  - Structured JSON output with timestamps
 */

import winston from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log line format for console
// Custom log line format for console
const consoleFormat = printf(({ level, message, timestamp: ts, stack }) =>
  `${ts} [${level}]: ${stack || message}`
);

// Rotate file transport (production)
const fileRotateTransport = new winston.transports.DailyRotateFile({
  dirname: process.env.LOG_DIR || 'logs',
  filename: '%DATE%-app.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  format: combine(timestamp(), errors({ stack: true }), winston.format.json()),
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true })),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), consoleFormat),
    }),
    ...(process.env.NODE_ENV === 'production' ? [fileRotateTransport] : []),
  ],
});

export default logger;
