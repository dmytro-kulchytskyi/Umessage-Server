function Message(provider, id, date, user, title, read_state, body) {
    this.id = id;
    this.date = date;
    this.user = user;
    this.read_state = read_state;
    this.title = title;
    this.body = body;
    this.provider = provider;
}

module.exports = Message;
