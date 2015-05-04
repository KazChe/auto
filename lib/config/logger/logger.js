var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'debug',
            filename: './ap.log',
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MBee
            maxFiles: 5,
            colorize: true
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: true
        })
    ],
    exitOnError: false
});
//var _loggers = winston.loggers.add('service-logger', {
//    console: {
//        level: 'debug',
//        colorize: true,
//        label: 'service calls'
//    },
//    file: {
//        filename: 'services.log'
//    }
//});

module.exports = logger;
module.exports.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};
