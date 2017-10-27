var EventEmitter = require('events').EventEmitter;
var async = require('async');
var log = require('libs/log')(module);


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

function  getUserInfo(userId, provider, callback) {
    //TODO
}

function getAvailableProviders() {
    return providers.map(it => it.providerName);
}

function useProvider(provider) {
    providers.push(provider);
}

module.exports = {
    useProvider,
    getAvailableProviders,
    getData,
};