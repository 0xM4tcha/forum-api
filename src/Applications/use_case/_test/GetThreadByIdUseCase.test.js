const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

const GetThreadById = require('../../../Domains/threads/entities/GetThreadById');
const GetCommentedThread = require('../../../Domains/comments/entities/GetCommentedThread');
const GetRepliedComment = require('../../../Domains/replies/entities/GetRepliedComment');

const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');

describe('GetThreadByIdUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the getThreadById action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123'
    };

    const mockGetThreadById = new GetThreadById({
      threadId: 'thread-123'
    });
    const mockGetCommentedThread = new GetCommentedThread({
      threadId: 'thread-123'
    });
    const mockRepliedComment = new GetRepliedComment({
      commentId: 'comment-123'
    })

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockGetThreadById));
    mockCommentRepository.getCommentedThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockGetCommentedThread));
    mockReplyRepository.getRepliedComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockRepliedComment));

    /** creating use case instance  */
    const getThreadUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository
    });

    // Action
    await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentedThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliedComment).toBeCalledWith(useCasePayload.commentId);
  });
});
