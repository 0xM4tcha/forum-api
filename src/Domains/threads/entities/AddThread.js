class AddThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.userId = payload.userId;
    this.title = payload.title;
    this.body = payload.body;
  }

  _verifyPayload(payload) {
    const { title, body, userId } = payload;

    if (!title || !body || !userId) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      typeof userId !== 'string'
    ) {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddThread;
