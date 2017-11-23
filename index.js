var config = require('app-config');
var log = require('libs/log')(module);
var cluster = require('cluster');

var sticky = require('sticky-session');

var redis = require('socket.io-redis');

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.adapter(redis({
    host: config.get('redis:host'),
    port: config.get('redis:port')
}));

if (sticky.listen(server, config.get('appPort'))) {

    var dataProvider = require('data-provider');
    dataProvider.useProvider(require('providers/vk'));

    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/_test/socketsTest.html');
    });

    io.on('connection', function (client) {
        log.debug('client connected to worker #' + cluster.worker.id);
        client.emit('conn', 'connected to ' + cluster.worker.id);

        client.on('message', function (data) {
            log.debug('MSG: ' + data);
            io.emit('message', `${data} [From: worker#${cluster.worker.id}]`);
        });
    });
}