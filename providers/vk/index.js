var util = require('util');
var https = require('https');
var config = require('./config');

var log = require('libs/log')(module);
var urlBuilder = require('libs/url-builder');
var dataProvider = require('data-provider');

var Message = dataProvider.models.Message;
var Dialog = dataProvider.models.Dialog;
var User = dataProvider.models.User;

var providerName = config.get('name');
var vkApiLink = config.get('apiLink');
var vkApiVersion = config.get('apiVersion');

var getDialogsConfig = config.get('apiMethods:getDialogs');
var getMessagesConfig = config.get('apiMethods:getMessages');
var getUserInfoConfig = config.get('apiMethods:getUserInfo');

function getDialogs(params, callback) {

    var reqParams = {
        v: vkApiVersion,
        access_token: params.token,
        count: params.count,
        start_message_id: params.startMessageId
    };

    for(var key in reqParams)
        if(!reqParams[key]) throw new TypeError(`${key} field is required!`);


    var link = urlBuilder(vkApiLink, getDialogsConfig.path, reqParams);

    sendRequest(link, (err, res) => {
        if (err) return callback(err);

        try {
            var data = JSON.parse(res);

            if (res.error) {
                return callback(new Error(res.error.error_code + ' : ' + res.error.error_msg));
            }


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



