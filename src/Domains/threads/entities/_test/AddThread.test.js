const AddThread = require('../AddThread');

describe('a AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      userId: 1,
      title: 123,
      body: true
    };
    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError(
      'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create AddThread object correctly', () => {
    // Arrange
    const payload = {
      userId: 'user-123',
      title: 'dicoding',
      body: 'Dicoding Indonesia'
    };
    // Action
    const { userId, title, body } = new AddThread(payload);
    // Assert
    expect(userId).toEqual(payload.userId);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
