var EventEmitter = require('events').EventEmitter;
var async = require('async');
var log = require('libs/log')(module);

var models = require('./models');
var errors = require('./errors');

var providers = [];

function getData(data, callback) {
    //TODO
}

function getDialogs(data, callback) {
    //TODO
}

function getMessages(data, callback) {
    //TODO
}

function getUserInfo(userId, provider, callback) {
    //TODO
}

function getAvailableProviders() {
    return providers.map(function (it) {
        return it.providerName;
    });
}

function useProvider(provider) {
    providers.push(provider);
    return module.exports;
}

module.exports = {
    useProvider: useProvider,
    getAvailableProviders: getAvailableProviders,
    getData: getData
};