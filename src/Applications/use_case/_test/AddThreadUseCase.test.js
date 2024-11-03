const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      title: 'dicoding',
      body: 'Dicoding Indonesia'
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'user-123'
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockUserRepository = new UserRepository();

    /** mocking needed function */
    mockUserRepository.verifyUserId = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    /** creating use case instance  */
    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
      userRepository: mockUserRepository
    });

    // Action
    const addedThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: 'thread-123',
        title: useCasePayload.title,
        owner: 'user-123'
      })
    );

    expect(mockThreadRepository.addThread).toBeCalledWith(
      new AddThread({
        userId: 'user-123',
        title: useCasePayload.title,
        body: useCasePayload.body
      })
    );
  });
});
