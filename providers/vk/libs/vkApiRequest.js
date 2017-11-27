var https = require('https');
var errors = require('data-provider/errors');

module.exports = function (link, callback) {
    https.get(link, function (res) {
        var body = '';

        res.on('data', function (d) {
            body += d;
        });

        res.on('end', function () {
            var data;
            try {
                data = JSON.parse(body);
            }
            catch (e) {
                return callback(new errors.ProviderResponseError(e.message));
            }

            if (data.error)
                return callback(new errors.ProviderResponseError(data.error['error_msg'] || 'Bad response'));

            callback(undefined, data.response);
        });
    }).on('error', function (err) {
        callback(new errors.ProviderRequestError(err.message));
    });
};
