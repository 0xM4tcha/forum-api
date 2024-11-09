const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      userId: 'user-123',
      threadId: 'thread-123',
      content: 'comment dicoding'
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      threadId: 'thread-123',
      content: useCasePayload.content,
      owner: 'user-123'
    });

    /** creating dependency of use case */
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
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    /** creating use case instance  */
    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository
    });

    // Action
    const addedComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: useCasePayload.content,
        owner: 'user-123'
      })
    );
    
    expect(mockUserRepository.verifyUserId).toBeCalledWith(useCasePayload.userId);
    expect(mockThreadRepository.validateId).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        id: 'comment-123',
        threadId: 'thread-123',
        content: useCasePayload.content,
        userId: 'user-123'
      })
    );
  });
});
