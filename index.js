var cluster = require('cluster');
var appConfig = require('app-config');
var log = require('libs/log')(module);
var os = require('os');
var util = require('util');

var workersCount = os.cpus().length;

cluster.setupMaster({
    exec: appConfig.get('cluster:workerFileName')
});

cluster.on('exit', function (worker, code, signal) {
    log.error(`Worker died: id:${worker.process.pid}, code:${code}, signal:${signal}`);
    cluster.fork();
});

for (var i = 0; i < workersCount; i++)
    cluster.fork();

