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

var lpServerUrlPattern = 'https://%s?act=a_check&wait=%s&mode=%s&version=%s';

function UpdatesListener(token, handler) {
    if (handler)
        this._handler = handler;

    this._token = token;
    this._destroyed = false;
}

UpdatesListener.prototype.setHandler = function (handler) {
    this._handler = handler;
};

UpdatesListener.prototype.dispose = function () {
    this._listening = false;
    this._destroyed = true;
};

UpdatesListener.prototype.isListening = function () {
    return this._listening;
};

UpdatesListener.prototype.listen = function (callback) {
    if (!this._handler)
        return callback(new errors.ArgumentError("No handler specified"));

    this._listening = true;

    getLongPollServerParams(this._token, (err, res) => {
        if (err)
            return callback(err);

        if (res.pts)
            this._lastPts = res.pts;

        //TODO remove
        console.log('lp server lpServerUrl:', res.lpServerUrl);

        listen(this, res.lpServerUrl, res.key, res.ts);
        callback();
    });
};

function getLongPollServerParams(token, callback) {
    var getLPServerRequestUrl = urlBuilder(vkApiLink, getLPServerRequestConfig['path'], {
        'v': vkApiVersion,
        'lp_version': lpServerConfig['lpVersion'],
        'need_pts': getLPServerRequestConfig['needPts'],
        'access_token': token
    });

    //TODO remove
    console.log('getLPServerUrl: ' + getLPServerRequestUrl);

    apiRequest(getLPServerRequestUrl, (err, res) => {
        if (err)
            return callback(err);

        var lpServerUrl = util.format(lpServerUrlPattern,
            res['server'],
            lpServerConfig['wait'],
            lpServerConfig['mode'],
            lpServerConfig['lpVersion']);

        var data = {
            ts: res['ts'],
            key: res['key'],
            lpServerUrl: lpServerUrl
        };

        if (res['pts'])
            data.pts = res['pts'];

        callback(undefined, data);
    });
}

UpdatesListener.prototype._parseUpdates = function (updates) {
    //TODO
    return updates;
}

function listen(listener, url, currentKey, currentTs) {
    if (listener._destroyed) return;

    listener._listening = true;

    setImmediate(makeReq);

    function makeReq() {
        if (!listener._listening) return;

        https.get(url + util.format('&key=%s&ts=%s', currentKey, currentTs), (res) => {
            var body = '';

            res.on('data', function (d) {
                body += d;
            });

            res.on('end', function () {
                var data;
                try {
                    data = JSON.parse(body);
                } catch (e) {
                    return callback(new errors.ProviderResponseError('Bad response: ' + e.message));
                }

                if (data['failed']) {
                    var failed = data['failed'];

                    //TODO remove
                    console.log('failed:', data);

                    switch (failed) {
                        case 1 :
                            if (!data['ts'])
                                return callback(new errors.ProviderResponseError("Response doesn't contains 'ts' field"));

                            currentTs = data['ts'];
                            return setImmediate(makeReq);

                        case 2:
                            return getLongPollServerParams(listener._token, (err, res) => {
                                if (err) return callback(err);
                                //TODO remove
                                console.log('lp server lpServerUrl:', url);

                                listen(listener, url, res.key, currentTs);
                            });

                        case  3:
                            return getLongPollServerParams(listener._token, (err, res) => {
                                if (err) return callback(err);
                                //TODO remove
                                console.log('lp server lpServerUrl:', url);
                                listen(listener, url, res.key, res.ts);
                            });

                        default:
                            return callback(new errors.ProviderResponseError('Invalid lp version'));
                    }
                }

                if (!data['ts'])
                    return callback(new errors.ProviderResponseError("Response doesn't contains 'ts' field"));

                currentTs = data['ts'];

                //TODO handle pts
                if (data['pts'])
                    listener._lastPts = data['pts'];

                if (!data['updates'] || !(data['updates'] instanceof Array))
                    return callback(new errors.ProviderResponseError("Response doesn't contains 'updates' array"));

                setImmediate(makeReq);

                var updates = data['updates'];
                if (updates.length)
                    callback(undefined, listener._parseUpdates(updates));

                //TODO remove
                else console.log('empty response');
            });

        }).on('error', function (e) {
            callback(new errors.ProviderRequestError(e.message));
        });

        function callback(err, res) {
            if (listener._listening && !listener._destroyed) {
                if (err)
                    listener._listening = false;

                //TODO try listen again after req error

                listener._handler(err, res);
            }
        }
    }
}


module.exports = UpdatesListener;
