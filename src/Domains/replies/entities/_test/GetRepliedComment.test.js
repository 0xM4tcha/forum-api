const GetRepliedComment = require('../GetRepliedComment');

describe('a GetRepliedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() =>
      new GetRepliedComment(payload).toThrowError(
        'GET_REPLIED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
      )
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = { commentId: 123 };

    // Action and Assert
    expect(() =>
      new GetRepliedComment(payload).toThrowError(
        'GET_REPLIED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
      )
    );
  });

  it('should create GetRepliedComment object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123'
    };

    // Action
    const repliedComment = new GetRepliedComment(payload);

    // Assert
    expect(repliedComment.threadId).toEqual(payload.threadId);
  });
});
