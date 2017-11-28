function UserInfo(id, username, provider, sex, photo, firstname, lastname) {
    this.id = id;
    this.username = username;
    this.firstname = firstname;
    this.lastname = lastname;
    this.provider = provider;
    this.sex = sex;
    this.photo = photo;
}

module.exports = UserInfo;