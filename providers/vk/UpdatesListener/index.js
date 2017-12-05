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
    return (this._listening && !this._destroyed);
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

function listen(listener, url, currentKey, currentTs) {
    if (listener._destroyed) return;

    listener._listening = true;

    setImmediate(makeRequest);

    function makeRequest() {
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
                    return onResult(new errors.ProviderResponseError('Bad response: ' + e.message));
                }

                handlerErrors(data, processResponse);
            });

        }).on('error', function (e) {
            onResult(new errors.ProviderRequestError(e.message));
        });
    }

    function handlerErrors(response, callback) {
        if (response['failed']) {
            var failed = response['failed'];

            //TODO remove
            console.log('failed:', response);

            switch (failed) {
                case 1 :
                    if (!response['ts'])
                        callback(new errors.ProviderResponseError("Response doesn't contains 'ts' field"));
                    else {
                        currentTs = response['ts'];
                        setImmediate(makeRequest);
                    }
                    break;
                case 2:
                    getLongPollServerParams(listener._token, (err, res) => {
                        if (err) return callback(err);

                        //TODO remove
                        console.log('lp server lpServerUrl:', url);
                        listen(listener, url, res.key, currentTs);
                    });
                    break;
                case  3:
                    getLongPollServerParams(listener._token, (err, res) => {
                        if (err) return callback(err);

                        //TODO remove
                        console.log('lp server lpServerUrl:', url);
                        listen(listener, url, res.key, res.ts);
                    });
                    break;

                default:
                    callback(new errors.ProviderResponseError('Invalid lp version'));
                    break;
            }
        }

        else if (!response['ts'])
            callback(new errors.ProviderResponseError("Response doesn't contains 'ts' field"));

        else if (!response['updates'] || !(response['updates'] instanceof Array))
            callback(new errors.ProviderResponseError("Response doesn't contains 'updates' array"));

        else
            callback(undefined, response);
    }


    function processResponse(err, res) {
        if (err)
            return onResult(err);

        currentTs = res['ts'];

        //TODO handle pts
        if (res['pts'])
            listener._lastPts = res['pts'];


        setImmediate(makeRequest);

        var updates = res['updates'];
        if (updates.length)
            onResult(undefined, parseUpdates(updates));

        //TODO remove
        else console.log('empty response');
    }

    function onResult(err, res) {
        if (listener.isListening()) {
            if (err)
                listener._listening = false;

            //TODO try listen again after req error

            listener._handler(err, res);
        }
    }

    function parseUpdates(updates) {
        //TODO
        return updates;
    }
}


module.exports = UpdatesListener;
