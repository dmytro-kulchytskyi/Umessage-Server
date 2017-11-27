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

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/_test/socketsTest.html');
});

io.on('connection', function (client) {
	log.debug(`client connected to worker # ${cluster.worker.id}`);
	client.emit('conn', `connected to ${cluster.worker.id}`);

	client.on('message', function (data) {
		log.debug('MSG: ' + data);
		io.emit('message', `${data} [From worker ${cluster.worker.id}]`);
	});
});

server.listen(config.get('appPort'), () => {
	log.info(`Process started: ${process.pid} [Worker ${cluster.worker.id}]`);
});
