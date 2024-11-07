const GetThreadById = require('../../../Domains/threads/entities/GetThreadById');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');

describe('GetThreadByIdUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123'
    };

    const mockGetThreadById = new GetThreadById({
      threadId: 'thread-123'
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockGetThreadById));

    /** creating use case instance  */
    const getThreadUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository
    });

    // Action
    await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
  });
});
