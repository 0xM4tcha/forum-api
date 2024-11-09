const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const DeleteReply = require('../../../Domains/replies/entities/DeleteReply');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
      replyId: 'reply-123'
    };

    const mockDeleteReply = new DeleteReply({
      commentId: 'comment-123',
      threadId: 'thread-123',
      userId: 'user-123',
      replyId: 'reply-123'
    });

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();

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
    mockReplyRepository.validateId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.validateOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockDeleteReply));

    /** creating use case instance  */
    const getReplyUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository,
      replyRepository: mockReplyRepository
    });

    // Action
    const deletedReply = await getReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockUserRepository.verifyUserId).toBeCalledWith(useCasePayload.userId);
    expect(mockThreadRepository.validateId).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.validateId).toBeCalledWith(useCasePayload.commentId);
    expect(mockReplyRepository.validateId).toBeCalledWith(useCasePayload.replyId);
    expect(mockReplyRepository.validateOwner).toBeCalledWith(useCasePayload);
    
    expect(deletedReply).toStrictEqual({ status: 'success' });
  });
});
