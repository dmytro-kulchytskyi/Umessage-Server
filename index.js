var cluster = require('cluster');
var config = require('config');
var log = require('libs/log')(module);
var os = require('os');
var util = require('util');

var workersCount = os.cpus().length;

cluster.setupMaster({
    exec: config.get("cluster:workerFileName")
});

for (var i = 0; i < workersCount; i++)
    createWorker(cluster.fork());

function createWorker(worker) {
    worker.on('exit', function (code, signal) {
        log.error(util.format('Worker died:', worker.process.pid, code, signal));
        createWorker(cluster.fork());
    });

    return worker;
}

