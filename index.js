var log = require('libs/log')(module);
var cluster = require('cluster');

if (cluster.isMaster) {
    log.info(`Process started: ${ process.pid} [Master]`);

    var numCPUs = require('os').cpus().length;

    function createWorker() {
        return cluster.fork();
    }

    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        createWorker();
    }

    cluster.on('exit', function (worker, code, signal) {
            log.error(`Worker died: ${worker.process.pid} [Worker ${worker.id}] Code:${code}, Signal:${signal}`);
            createWorker();
        }
    );

} else if (cluster.isWorker) require('./server');