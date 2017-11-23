function User(id, username, provider, sex, photo, firstname = '', lastname = '', ) {
    this.id = id;
    this.username = username || (firstname + lastname);
    this.provider = provider;
    this.sex = sex;
    this.photo = photo;
}

module.exports = User;