var https = require('https');
var util = require('util');
var config = require('app-config');
var log = require('libs/log')(module);
var urlBuilder = require('libs/url-builder');

var errors = require('data-provider/errors');

var apiRequest = require('../libs/vkApiRequest');

var vkApiLink = config.get('data-provider:providers:vk:apiLink');
var vkApiVersion = config.get('data-provider:providers:vk:apiVersion');

var getLPServerRequestPath = config.get('data-provider:providers:vk:apiMethods:getLPServer:path');
var lpServerConfig = config.get('data-provider:providers:vk:lpServerConfiguration');

var lpServerUrlPattern = 'https://%s?act=a_check&wait=%s&mode=%s&version=%s&key=%s';

var getLPServerUrl = urlBuilder(vkApiLink, getLPServerRequestPath, {
    lp_version: lpServerConfig.lpVersion,
    need_pts: 1
});

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

UpdatesListener.prototype.listen = function (callback) {
    if (!this._handler)
        return callback(new errors.ArgumentError("No handler specified"));

    var getLPServerUrl = urlBuilder(vkApiLink, getLPServerRequestPath, {
        v: vkApiVersion,
        lp_version: lpServerConfig.lpVersion,
        need_pts: 1,
        access_token: this._token
    });

    var self = this;
    
    apiRequest(getLPServerUrl, function (err, res) {
        if (err)
            return callback(err);

        var url = util.format(lpServerUrlPattern,
            res.server,
            lpServerConfig.wait,
            lpServerConfig.mode,
            lpServerConfig.lpVersion,
            res.key
        );

        setImmediate(listen, url, res.ts, res.pts , self);

        callback();
    });
};

function listen(urlPattern, ts, pts, self) {

    function makeReq() {
        var url = urlPattern + '&ts=' + ts;
        https.get(url, function (res) {
            //TODO
        }).on('error', function (e) {
            //TODO
        });
    }
}

module.exports = UpdatesListener;
