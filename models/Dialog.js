function Dialog(provider, id, date, user, messages, read_state, preview, dialogType, conversationMembers) {
    this.id = id;
    this.date = date;
    this.user = conversationMembers ? undefined : user;
    this.read_state = read_state;
    this.preview = preview;
    this.providers = [provider];
    this.messages = messages;
    this.dialogType = dialogType || Dialog.dialogType.dialog;
    this.conversationMembers = conversationMembers;
}

Dialog.prototype.addProvider = function (provider) {
    if (!provider) throw new Error("null argument");

    this.providers.add(provider);
};

Dialog.prototype.addMessages = function (messages) {
    this.messages.push.call(this.messages, messages);
    //TODO add sorting method
};

Dialog.dialogType = {
    dialog: "dialog",
    conversation: "conversation"
};

module.exports = Dialog;
