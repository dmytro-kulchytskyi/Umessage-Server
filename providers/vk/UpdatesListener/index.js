var https = require('https');
var config = require('app-config');
var log = require('libs/log')(module);
var apiRequest = require('../libs/vkApiRequest');
var urlBuilder = require('libs/url-builder');

var errors = require('data-provider/errors');

var vkApiLink = config.get('data-provider:providers:vk:apiLink');
var vkApiVersion = config.get('data-provider:providers:vk:apiVersion');

var getLPserverRequestConfig = config.get('data-provider:providers:vk:apiMethods:getLPServer');


var getLPServerUrl = urlBuilder(vkApiLink, getLPserverRequestConfig.path, {
    lp_version: getLPserverRequestConfig.lpVersion,
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

    var getLPServerUrl = urlBuilder(vkApiLink, getLPserverRequestConfig.path, {
        v: vkApiVersion,
        lp_version: getLPserverRequestConfig.lpVersion,
        need_pts: 1,
        access_token: this._token
    });

    apiRequest(getLPServerUrl, function (err, res) {
        if(err)
            return callback(err);

            

    })
};

function lisnet(lpServerUrl, handler) {

}


module.exports = UpdatesListener;
