function Dialog(provider, id, date, user, preview, read_state,
                    dialogType = Dialog.dialogType.dialog,
                    conversationMembers = [],
                    messages = []) {
    this.providers = provider;
    this.id = id;
    this.date = date;
    this.read_state = read_state;
    this.preview = preview;
    this.user = user;
    this.messages = messages;
    this.dialogType = dialogType;
    this.conversationMembers = conversationMembers;
    this.messagesLoaded = (messages.length > 0);
}

Dialog.prototype.addMessages = function (messages) {
    if(messages && messages.length > 0) {
        Array.prototype.push.apply(this.messages, messages);
        //TODO add sorting method
    }

    if(this.messages.length > 0)
        this.messagesLoaded = true;
};

Dialog.dialogType = {
    dialog: "dialog",
    conversation: "conversation"
};

module.exports = Dialog;
