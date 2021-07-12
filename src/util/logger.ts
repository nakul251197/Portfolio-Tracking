import winston from "winston";

const { combine, timestamp, printf } = winston.format;

const myFormat = printf(({ level, message, timestamp }) => {
    level = level.toUpperCase();
    timestamp = (new Date(timestamp)).toLocaleString();
    return `${timestamp} ${level}: ${message}`;
  });

var logger = winston.createLogger({
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new winston.transports.File({
            filename: './logs/error.log',
            level: 'error', 
        }),
        new winston.transports.File({ filename: './logs/all.log' }),
        new winston.transports.Console()
    ]
});

export { logger };