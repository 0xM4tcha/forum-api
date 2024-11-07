class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.commentId = payload.commentId;
    this.userId = payload.userId;
    this.threadId = payload.threadId;
  }

  _verifyPayload(payload) {
    const { commentId, userId, threadId } = payload;

    if (!commentId || !userId || !threadId) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof commentId !== 'string' ||
      typeof userId !== 'string' ||
      typeof threadId !== 'string'
    ) {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThread;
