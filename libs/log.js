const {createLogger, transports, format: {json, combine, timestamp, label, printf}} = require('winston');

var env = process.env.NODE_ENV;

var myFormat = printf(info => {
    var dateTime = info.timestamp.split('T');
    dateTime[1] = dateTime[1].split('.')[0];

    var time = dateTime.join(' ');
    return `${time} [${info.label}] ${info.level}: ${info.message}`;
});

module.exports = module => {
    var path = module.filename.split('\\').slice(-2).join('/');

    var logger = createLogger({
        format: combine(
            json(),
            timestamp(),
            label({label: path})
        ),
        transports: [
            new transports.File({filename: 'logs/error.log', level: 'error'}),
            new transports.File({filename: 'logs/info.log', level: 'info'}),
            new transports.File({filename: 'logs/debug.log', level: 'debug'}),
        ]
    });

    if (env !== 'production') {
        logger.add(
            new transports.Console({
                format: combine(
                    label({label: path}),
                    timestamp(),
                    myFormat
                ),
                level: 'debug'
            }));
    }

    return logger;
};
