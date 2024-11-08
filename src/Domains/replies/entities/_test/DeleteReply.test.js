const DeleteReply = require('../DeleteReply');

describe('a DeleteReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError(
      'DELETE_REPLY.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      threadId: 1,
      commentId: 1,
      replyId: 123
    };
    // Action and Assert
    expect(() => new DeleteReply(payload)).toThrowError(
      'DELETE_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create deleteReply object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };
    // Action
    const { threadId, commentId, replyId } = new DeleteReply(payload);
    // Assert
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(replyId).toEqual(payload.replyId);
  });
});