const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('validateId function', () => {
    it('should error when threadId not valid', async () => {
      // Arrange
      await ThreadsTableTestHelper.addUser({ username: 'dicoding' });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const threadId = 'thread-123';
      const payloadAddThread = {
        id: 'thread-123',
        title: 'dicoding',
        body: 'dicoding indonesia',
        date: '2021-08-08T07:59:16.198Z',
        userId: 'user-123'
      };
      const result = await ThreadsTableTestHelper.addThread(payloadAddThread);
      // Action & Assert
      if (result?.rowCount) {
        expect(threadRepositoryPostgres.validateId(threadId)).rejects.toThrow(
          InvariantError
        );
      }
    });
  });

  describe('addThread function', () => {
    it('should persist addThread', async () => {
      // Arrange
      await ThreadsTableTestHelper.addUser({ username: 'dicoding' });
      const newThread = new AddThread({
        userId: 'user-123',
        title: 'dicoding',
        body: 'dicoding indonesia'
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(newThread);
      // Assert
      const threads =
        await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addUser({ username: 'dicoding' });
      const newThread = new AddThread({
        userId: 'user-123',
        title: 'dicoding',
        body: 'dicoding indonesia'
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);
      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'dicoding',
          owner: 'user-123'
        })
      );
    });
  });
});
