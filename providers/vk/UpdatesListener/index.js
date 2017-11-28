var https = require('https');
var util = require('util');
var config = require('app-config');
var log = require('libs/log')(module);
var urlBuilder = require('libs/url-builder');

var errors = require('data-provider/errors');

var apiRequest = require('../libs/vkApiRequest');

var vkApiLink = config.get('data-provider:providers:vk:apiLink');
var vkApiVersion = config.get('data-provider:providers:vk:apiVersion');

var getLPServerRequestConfig = config.get('data-provider:providers:vk:apiMethods:getLPServer');
var lpServerConfig = config.get('data-provider:providers:vk:lpServerConfiguration');

var lpServerUrlPattern = 'https://%s?act=a_check&wait=%s&mode=%s&version=%s&key=%s';

// var getLPServerUrl = urlBuilder(vkApiLink, getLPServerRequestConfig, {
//     lp_version: lpServerConfig.lpVersion,
//     need_pts: 1
// });

function UpdatesListener(token, handler) {
    if (handler)
        this._handler = handler;

    this._token = token;
}

UpdatesListener.prototype.setHandler = function (handler) {
    this._handler = handler;
};

UpdatesListener.prototype.dispose = function () {
    this._listening = false;
};

UpdatesListener.prototype.isListening = function () {
    return this._listening;
};

function getLongPollServer(token, callback) {
    var getLPServerUrl = urlBuilder(vkApiLink, getLPServerRequestConfig['path'], {
        'v': vkApiVersion,
        'lp_version': lpServerConfig['lpVersion'],
        'need_pts': getLPServerRequestConfig['needPts'],
        'access_token': token
    });

    //TODO remove
    console.log('getLPServerUrl: ' + getLPServerUrl);

    apiRequest(getLPServerUrl, (err, res) => {
        if (err)
            return callback(err);

        callback(undefined, res);
    });
}

UpdatesListener.prototype.listen = function (callback) {
    if (!this._handler)
        return callback(new errors.ArgumentError("No handler specified"));

    getLongPollServer(this._token, (err, res) => {
        if (err)
            return callback(err);

        var url = util.format(lpServerUrlPattern,
            res['server'],
            lpServerConfig['wait'],
            lpServerConfig['mode'],
            lpServerConfig['lpVersion'],
            res['key']);

        //TODO replace
        console.log('lp server url:', url);

        setImmediate(listen, url, res['ts'], res['pts'], this);
        this._listening = true;

        callback();
    });
};


function listen(urlPattern, ts, pts, self) {
    var callback = function (err, res) {
        if (err)
            self._listening = false;

        self._handler(err, res);
    };

    makeReq();

    function makeReq() {
        var url = urlPattern + '&ts=' + ts;
        https.get(url, (res) => {
            var body = '';

            res.on('data', function (d) {
                body += d;
            });

            res.on('end', function () {
                if (!self._listening) return;

                var data;
                try {
                    data = JSON.parse(body);
                } catch (e) {
                    return callback(new errors.ProviderResponseError('Bad response: ' + e.message));
                }

                /*TODO handle
                 {"failed":1,"ts":$new_ts}
                 {"failed":2}
                 {"failed":3}
                 {"failed":4,"min_version":0,"max_version":1} */

                if (!data['ts']) {
                    //TODO remove
                    console.log('response:\n', data);

                    return callback(new errors.ProviderResponseError("Response doesn't contains 'ts' field"));
                }

                ts = data['ts'];
                pts = data['pts'];
                //TODO handle pts

                if (!data['updates'] || !(data['updates'] instanceof Array))
                    return callback(new errors.ProviderResponseError("Response doesn't contains 'updates' array"));

                setImmediate(makeReq);

                var updates = data['updates'];
                if (updates.length)
                    callback(undefined, updates);
                //TODO remove
                else console.log('empty response');
            });

        }).on('error', function (e) {
            if (!self._listening) return;

            callback(new errors.ProviderResponseError(e.message));
        });
    }
}

module.exports = UpdatesListener;
