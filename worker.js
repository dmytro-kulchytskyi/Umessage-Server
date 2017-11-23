var log = require('libs/log')(module);
var appConfig = require('app-config');
var util = require('util');

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var dataProvider = require('data-provider');
dataProvider.useProvider(require('providers/vk'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/_test/socketsTest.html');
});

io.on('connection', function(client) {
 log.debug('client connected');

    client.on('message', function (data) {
       log.debug('MSG: ' + data);
       io.emit('message', data);
    });

});

server.listen(appConfig.get('appPort'), function(){
    log.info(util.format("Process started:", process.pid));
});
