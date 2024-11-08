const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const DeleteReply = require('../../../Domains/replies/entities/DeleteReply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  // describe('validateId function', () => {
  //   it('should error when commentId not valid', async () => {
  //     // Arrange
  //     await RepliesTableTestHelper.addUser({ username: 'dicoding' });
  //     const fakeIdGenerator = () => '123';
  //     const replyRepositoryPostgres = new ReplyRepositoryPostgres(
  //       pool,
  //       fakeIdGenerator
  //     );

  //     const threadId = 'thread-123';
  //     const commentId = 'comment-123';

  //     const payloadAddComment = {
  //       id: 'comment-123',
  //       threadId,
  //       content: 'comment dicoding',
  //       date: '2021-08-08T07:59:16.198Z',
  //       userId: 'user-123'
  //     };

  //     await RepliesTableTestHelper.addThread({ title: 'test' });

  //     const comment =
  //       await RepliesTableTestHelper.addComment(payloadAddComment);
  //     // Action & Assert
  //     if (comment?.rowCount) {
  //       expect(replyRepositoryPostgres.validateId(commentId)).rejects.toThrow(
  //         InvariantError
  //       );
  //     }
  //   });
  // });

  describe('addReply function', () => {
    it('should persist addReply', async () => {
      // Arrange
      await RepliesTableTestHelper.addUser({ username: 'dicoding' });
      await RepliesTableTestHelper.addThread({ title: 'thread title' });
      await RepliesTableTestHelper.addComment({ comment: 'comment' });

      const newReply = new AddReply({
        threadId: 'thread-123',
        content: 'reply baru',
        userId: 'user-123',
        commentId: 'comment-123'
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await replyRepositoryPostgres.addReply(newReply);
      // Assert
      const replies =
        await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      await RepliesTableTestHelper.addUser({ username: 'dicoding' });
      await RepliesTableTestHelper.addThread({ title: 'dicoding' });
      await RepliesTableTestHelper.addComment({ content: 'comment' });

      const newReply = new AddReply({
        threadId: 'thread-123',
        content: 'reply dicoding',
        userId: 'user-123',
        commentId: 'comment-123'
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      // Action
      const addedReply =
        await replyRepositoryPostgres.addReply(newReply);
      // Assert
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: 'reply-123',
          content: 'reply dicoding',
          owner: 'user-123'
        })
      );
    });
  });

  describe('deleteReply function', () => {
    it('should persist deleteReply', async () => {
      // Arrange
      await RepliesTableTestHelper.addUser({ username: 'dicoding' });
      await RepliesTableTestHelper.addThread({ title: 'dicoding' });
      await RepliesTableTestHelper.addComment({ content: 'comment' });
      await RepliesTableTestHelper.addReply({ content: 'reply' });

      const deleteReply = new DeleteReply({
        commentId: 'comment-123',
        userId: 'user-123',
        threadId: 'thread-123',
        replyId: 'reply-123'
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const deletedReply =
        await replyRepositoryPostgres.deleteReply(deleteReply);
      // Assert
      expect(deletedReply).toStrictEqual({ status: 'success' });
    });
  });
});
