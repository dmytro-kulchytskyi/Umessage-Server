var cluster = require('cluster');
var log = require('libs/log')(module);
var config = require('config');
var util = require('util');

var server = require('http').createServer();
var dataProvider = require('data-provider');

log.info(util.format("Process started:", process.pid));

server.listen(config.get('port'), () => {
    var socket = require('socket.io').listen(server);

    socket.on('connection', function (client) {
        client.on('request', function (data) {
            dataProvider.getData(data, function (err, results) {
                if (err) {
                    log.error(err);
                    return client.disconnect();
                }

                client.emit('data-ready', results);
            });
        });

    });
});