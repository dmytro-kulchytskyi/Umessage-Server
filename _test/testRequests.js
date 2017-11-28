var Listener = require('../providers/vk/UpdatesListener');

var listener = new Listener('818193f3875a01a5fb6d7c1318f225afdb1562d8917f57c5d385264faef3066fe9e30442e8c29409537fc',
    function (err, res) {
        if (err) throw err;
        else console.log(res);
    });

listener.listen(function (err) {
    if (err)
        console.log("LISTEN ERROR: " + err.message);
    else console.log('start listening');
});

