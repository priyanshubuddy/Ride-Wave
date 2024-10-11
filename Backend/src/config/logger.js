const winston = require('winston');
const colors = require('colors');
const moment = require('moment');
// Create a custom logger using winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message }) => {
            return `${level}: ${message}`;
        })
    ),
    transports: [new winston.transports.Console()],
});

// Function to get color for status code
const getStatusColor = (status) => {
    switch (status) {
        case 200:
        case 201:
        case 202:
        case 204:
            return colors.green; // Green for successful requests
        case 301:
        case 302:
        case 304:
            return colors.cyan; // Cyan for redirection
        case 400:
        case 401:
        case 403:
        case 404:
        case 405:
        case 408:
        case 409:
        case 410:
        case 422:
            return colors.yellow; // Yellow for client errors
        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
            return colors.red; // Red for server errors
        case 100:
        case 101:
            return colors.blue; // Blue for informational responses
        default:
            return colors.gray; // Gray for unknown or unhandled status codes
    }
};

// Function to log HTTP requests
const logRequest = (req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const status = res.statusCode;
        const method = req.method;
        const url = req.originalUrl;
        const responseTime = Date.now() - startTime;

        const statusColor = getStatusColor(status);
        const responseTimeColor = getStatusColor(status); // Use same logic for response time

        const currentTime = moment().format('MM/DD/YYYY hh:mm:ss A');

        const logMessage = [
            statusColor(`<<<======== ${currentTime} =========>`),
            `${statusColor(status)} ${method} ${url}`,
            `${responseTimeColor(responseTime + 'ms')}`,
            statusColor('=========>'),
        ].join(' ');

        logger.info(logMessage);
    });

    next();
};


const wrapper = (original, isConsole) => {
    return (...args) => {
        original(args.join(" "));
        if (isConsole) console.log(args);
    };
};


module.exports = {
    logger, logRequest
};