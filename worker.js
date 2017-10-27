var log = require('libs/log')(module);
var config = require('config');
var util = require('util');

var server = require('http').createServer();
var socket = require('socket.io')(server);

var dataProvider = require('data-provider');
dataProvider.useProvider(require('providers/vk'));

log.info(util.format("Process started:", process.pid));

socket.on('connection', function (client) {
    client.once('auth', function (authentication) {
        this.on('request', function (data) {
            dataProvider.getData(data, function (err, result) {
                if (err) {
                    log.error(err);
                    return client.disconnect();
                }

                client.emit('data-ready', result);
            });
        });

    });
});

server.listen(config.get('appPort'));
