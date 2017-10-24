var util = require('util');
var https = require('https');
var vkApiLinkPattern = "https://api.vk.com/method/";

function Message(id, date, user_id, read_state, title, body) {
    this.id = id;
    this.date = date;
    this.user_id = user_id;
    this.read_state = read_state;
    this.title = title;
    this.body = body;
}

exports.Message = Message;

function getDialogs(token, requestParams, callback) {
    var link = vkApiLinkPattern + "messages.getDialogs&v=5.68&access_token=" + token;

    if (requestParams.offset)
        link += "&offset=" + offset;

    if (requestParams.count)
        link += "&count=" + count;

    if (requestParams.start_message_id)
        link += "&start_message_id=" + start_message_id;

    if (requestParams.preview_length)
        link += "&preview_length=" + preview_length;

    sendRequest(link, function (err, res) {
        if (err) {
            callback(err);
            return callback(err);
        }

        //TODO parsing res to data

        callback(undefined, res);
    });
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
