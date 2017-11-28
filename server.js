var config = require('app-config');
var log = require('libs/log')(module);
var cluster = require('cluster');

var dataProvider = require('data-provider')
	.useProvider(require('providers/vk'));

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//var redis = require('socket.io-redis');

// io.adapter(redis({
//     host: config.get('redis:host'),
//     port: config.get('redis:port')
// }));

io.set('transports', ['websocket']);

//TODO remove
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/_test/socketsTest.html');
});

//TODO add methods to receive data from data provider

io.on('connection', function (socket) {

	log.debug(`client connected to worker # ${cluster.worker.id}`);

    //TODO remove
	socket.emit('conn', `connected to ${cluster.worker.id}`);

	socket.on('message', function (data) {
		log.debug('MSG: ' + data);
		io.emit('message', `${data} [From worker ${cluster.worker.id}]`);
	});

	//TODO add a subscription to updates-event
});

server.listen(config.get('appPort'), () => {
	log.info(`Process started: ${process.pid} [Worker ${cluster.worker.id}]`);
});
