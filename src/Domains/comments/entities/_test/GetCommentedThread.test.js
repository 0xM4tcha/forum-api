const GetCommentedThread = require('../GetCommentedThread');

describe('a GetCommentedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() =>
      new GetCommentedThread(payload).toThrowError(
        'GET_COMMENTED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
      )
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = { threadId: 123 };

    // Action and Assert
    expect(() =>
      new GetCommentedThread(payload).toThrowError(
        'GET_COMMENTED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
      )
    );
  });

  it('should create getCommentedThread object correctly', () => {
    // Arrange
    const payload = {
      threadId: 'thread-123'
    };

    // Action
    const commentedThread = new GetCommentedThread(payload);

    // Assert
    expect(commentedThread.threadId).toEqual(payload.threadId);
  });
});
