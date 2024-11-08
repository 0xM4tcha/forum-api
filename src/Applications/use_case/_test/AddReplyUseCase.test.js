const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'reply-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      userId: 'user-123',
      content: 'comment dicoding'
    };

    const mockAddedReply = new AddedReply({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'user-123'
    });

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockUserRepository.verifyUserId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.validateId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.validateId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.addReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    /** creating use case instance  */
    const getCommentUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      commentRepository: mockCommentRepository
    });

    // Action
    const addedReply = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(
      new AddedReply({
        id: 'comment-123',
        content: useCasePayload.content,
        owner: 'user-123'
      })
    );

    expect(mockReplyRepository.addReply).toBeCalledWith(
      new AddReply({
        id: 'reply-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        content: useCasePayload.content,
        userId: 'user-123'
      })
    );
  });
});
