const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('validateId function', () => {
    it('should error when commentId not valid', async () => {
      // Arrange
      await CommentsTableTestHelper.addUser({ username: 'dicoding' });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const threadId = 'thread-123';
      const commentId = 'comment-123';

      const payloadAddComment = {
        id: 'comment-123',
        threadId,
        content: 'comment dicoding',
        date: '2021-08-08T07:59:16.198Z',
        userId: 'user-123'
      };

      await CommentsTableTestHelper.addThread({ title: 'test' });

      const comment =
        await CommentsTableTestHelper.addComment(payloadAddComment);
      // Action & Assert
      if (comment?.rowCount) {
        expect(commentRepositoryPostgres.validateId(commentId)).rejects.toThrow(
          InvariantError
        );
      }
    });
  });

  describe('addComment function', () => {
    it('should persist addComment', async () => {
      // Arrange
      await CommentsTableTestHelper.addUser({ username: 'dicoding' });
      await CommentsTableTestHelper.addThread({ title: 'test' });

      const newComment = new AddComment({
        content: 'comment baru',
        userId: 'user-123',
        threadId: 'thread-123'
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addComment(newComment);
      // Assert
      const comments =
        await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addUser({ username: 'dicoding' });
      await CommentsTableTestHelper.addThread({ title: 'dicoding' });
      const newComment = new AddComment({
        content: 'comment dicoding',
        userId: 'user-123',
        threadId: 'thread-123'
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      // Action
      const addedComment =
        await commentRepositoryPostgres.addComment(newComment);
      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: 'comment dicoding',
          owner: 'user-123'
        })
      );
    });
  });
});
