var util = require('util');
var https = require('https');
var config = require('config');

var Message = require('models/Message');
var Dialog = require('models/Dialog');

var providerName = "vk";

var vkApiLinkPattern = config.get("dataProviders:vkProvider:vkApiLink");

function getDialogs(token, requestParams, callback) {
    if (!token) return callback(new Error("token"));

    var link = vkApiLinkPattern + "messages.getDialogs&v=5.68&access_token=" + token;

    if (requestParams.offset) link += "&offset=" + offset;
    if (requestParams.count) link += "&count=" + count;
    if (requestParams.start_message_id) link += "&start_message_id=" + start_message_id;
    if (requestParams.preview_length) link += "&preview_length=" + preview_length;

    sendRequest(link, (err, res) => {
        if (err) return callback(err);

        //TODO parsing res to data

        callback(undefined, res);
    });
}

function getMessages(token, dialog, requestParams, callback) {
    if (!(dialog instanceof Dialog))
        return callback(new TypeError("invalid type of dialog"));

    if (!dialog.providers.contains(providerName))
        return callback(new TypeError("invalid provider"));

    //TODO
}

function getUserInfo(userId, callback) {
    //TODO
}

function sendRequest(link, callback) {
    var request = https.get(link, function (res) {
        this.removeAllListeners();
        var body = "";
        res.on('data', function (d) {
            body += d;
        });

        res.on('end', function () {
            callback(body);
        });
    });

    request.on('error', function (e) {
        this.removeAllListeners();
        callback(null, e);
    });
}

module.exports = {
    providerName,
    getDialogs,

};



