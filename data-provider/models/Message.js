function Message(provider, id, date, userId, title, readState, body) {
    this.id = id;
    this.date = date;
    this.user = userId;
    this.readState = readState;
    this.title = title;
    this.body = body;
    this.provider = provider;
}

module.exports = Message;
