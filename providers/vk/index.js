var util = require('util');
var https = require('https');
var config = require('app-config');

var log = require('libs/log')(module);
var urlBuilder = require('libs/url-builder');

var models = require('data-provider/models');
var errors = require('data-provider/errors');

var providerName = config.get('data-provider:providers:name');

var vkApiLink = config.get('data-provider:providers:apiLink');
var vkApiVersion = config.get('data-provider:providers:apiVersion');

var requestConfigs = config.get('data-provider:providers:apiMethods');

function getDialogs(params, callback) {

    var reqParams = {
        v: vkApiVersion,
        access_token: params.token,
        count: params.count,
        start_message_id: params.startMessageId
    };


    var link = urlBuilder(vkApiLink, requestConfigs.getDialogs.path, reqParams);

    sendRequest(link, (err, res) => {
        if (err) return callback(err);

        try {
            var data = JSON.parse(res);

            if (res.error)
                return callback(new Error(res.error.error_code + ' : ' + res.error.error_msg));


            return callback(undefined, res);
        }
        catch (err) {
            log.error(err);
            callback(new Error("bad response"));
        }
    });
}

function getMessages(token, requestParams, callback) {

    if (!dialog.providers.contains(providerName))
        return callback(new TypeError("invalid provider"));


}

function getUserInfo(userId, callback) {
    //TODO
}

function sendRequest(link, callback) {
    var request = https.get(link, function (res) {
        var body = "";
        res.on('data', function (d) {
            body += d;
        });

        res.on('end', function () {
            callback(undefined, body);
        });
    });

    request.on('error', function (error) {
        callback(error);
    });
}

module.exports = {
    providerName,
    getDialogs,
    getMessages,
    getUserInfo

};


