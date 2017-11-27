module.exports = function (host, location, args) {
    var link = (host + '/' + location).trim().replace(/\/+/g, '/').replace(':/', '://');

    if (args) {
        var ret = [];
        for (var key in args) if (args.hasOwnProperty(key))
            ret.push([key, args[key]].map(encodeURIComponent).join('='));

        if (ret.length)
            link += '?' + ret.join('&');
    }
    return link;
};
