var winston = require('winston');

var createLogger = winston.createLogger;
var transports = winston.transports;
var format = winston.format;

var json = format.json;
var combine = format.combine;
var timestamp = format.timestamp;
var label = format.label;
var printf = format.printf;

var env = process.env.NODE_ENV;

var myFormat = printf((info) => {
	var time = info.timestamp.toString().replace('T', ' ').replace(/\.(\d)+Z/g, '');
	return `${time} [${info.label}]${info.level}: ${info.message}`;
});

module.exports = function (module) {
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
			new transports.File({filename: 'logs/debug.log', level: 'debug'})
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
