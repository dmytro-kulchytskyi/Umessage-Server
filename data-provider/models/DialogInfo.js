function DialogInfo(provider, id, date, userId, preview, readState, dialogType, conversationMembers, messages) {
    this.providers = provider;
    this.id = id;
    this.date = date;
    this.readState = readState;
    this.preview = preview;
    this.userId = userId;
    this.dialogType = dialogType || DialogInfo.dialogType.dialog;
    this.conversationMembers = conversationMembers || [];
    this.messagesLoaded = (messages.length > 0);
}


DialogInfo.dialogType = {
    dialog: "dialog",
    conversation: "conversation"
};

module.exports = DialogInfo;
