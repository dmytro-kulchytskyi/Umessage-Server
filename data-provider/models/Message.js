function Message(provider, id, date, userId, title, read_state, body) {
    this.id = id;
    this.date = date;
    this.user = userId;
    this.read_state = read_state;
    this.title = title;
    this.body = body;
    this.provider = provider;
}

module.exports = Message;
