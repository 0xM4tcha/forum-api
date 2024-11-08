class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.userId = payload.userId;
    this.threadId = payload.threadId;
    this.commentId = payload.commentId;
    this.content = payload.content;
  }

  _verifyPayload(payload) {
    const { userId, threadId, commentId, content } = payload;

    if (!userId || !threadId || !commentId || !content) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof userId !== 'string' ||
      typeof threadId !== 'string' ||
      typeof commentId !== 'string' ||
      typeof content !== 'string'
    ) {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
