module.exports = function (host, location, args) {
    var link = (host + '/' +location).trim().replace(/\/+/g, '/').replace(':/', '://' );

    if (args) {
        var ret = [];
        for (var key in args)
            ret.push([key, args[key]].map(encodeURIComponent).join('='));

        link += '?' + ret.join('&');
    }
    return link;
};
