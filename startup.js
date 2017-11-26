var log = require('libs/log')(module);
var cluster = require('cluster');

if (cluster.isMaster) {
    log.info(`Process started: ${process.pid} [Master]`);

    var numCPUs = require('os').cpus().length;

    function createWorker() {
        return cluster.fork();
    }

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        createWorker();
    }

    cluster.on('exit', (worker, code, signal) => {
        log.info(`worker ${worker.id}[process id: ${worker.process.pid}] died( Code: ${code}, Signal: ${signal})`);
        createWorker();
    });

} else if(cluster.isWorker)require('./app');