var i = 0;
function f(data) {
    var cur = process.memoryUsage().heapUsed;

    if (lastRes > cur)
        console.log('clean #', ++i);

    lastRes = cur;

    setImmediate(function () {
        data = data + '1';
        f(data);
    });
}

var lastRes = 0;

setInterval(function () {

}, 100);

f((new Array(1e7)).join('ASD'));

//console.log(!!1)