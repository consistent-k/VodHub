import path from 'node:path';

import winston from 'winston';

import { config } from '@/config';

const logger = winston.createLogger({
    level: config.looger.level,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.printf((info) =>
            JSON.stringify({
                timestamp: info.timestamp,
                level: info.level,
                message: info.message
            })
        )
    ),
    transports: config.looger.createFile
        ? [
              new winston.transports.File({
                  filename: path.resolve('logs/error.log'),
                  level: 'error'
              }),
              new winston.transports.File({ filename: path.resolve('logs/combined.log') })
          ]
        : []
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.printf((info) => {
                const infoLevel = winston.format.colorize().colorize(info.level, config.looger.showTimestamp ? `[${info.timestamp}] ${info.level}` : info.level);
                return `${infoLevel}: ${info.message}`;
            }),
            silent: false
        })
    );
}

export default logger;
