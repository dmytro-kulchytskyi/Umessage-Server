var util = require('util');
var https = require('https');
var config = require('app-config');

var log = require('libs/log')(module);
var urlBuilder = require('libs/url-builder');
var apiRequest = require('libs/vkApiRequest');

var models = require('data-provider/models');
var errors = require('data-provider/errors');

var providerName = config.get('data-provider:providers:vk:name');

var vkApiLink = config.get('data-provider:providers:vk:apiLink');
var vkApiVersion = config.get('data-provider:providers:vk:apiVersion');

var requestConfigs = config.get('data-provider:providers:vk:apiMethods');

function getDialogs(params, callback) {

    var reqParams = {
        v: vkApiVersion,
        access_token: params.token,
        count: params.count,
        start_message_id: params.startMessageId
    };


    var link = urlBuilder(vkApiLink, requestConfigs.getDialogs.path, reqParams);

    apiRequest(link, (err, res) => {
        if (err) return callback(err);

       //TODO
    });
}

function getMessages(token, requestParams, callback) {

    if (!dialog.providers.contains(providerName))
        return callback(new TypeError("invalid provider"));


}

function getUserInfo(userId, callback) {
    //TODO
}





