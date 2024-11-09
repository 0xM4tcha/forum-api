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

  describe('validateId function', () => {
    it('should error when replyId not valid', async () => {
      // Arrange
      await RepliesTableTestHelper.addUser({ username: 'developer' });
      await RepliesTableTestHelper.addThread({ title: 'title baru' });
      await RepliesTableTestHelper.addComment({ content: 'comment baru' });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const threadId = 'thread-123';
      const replyId = 'reply-123';

      const payloadAddReply = {
        id: 'reply-123',
        threadId,
        content: 'reply dicoding',
        date: '2021-08-08T07:59:16.198Z',
        userId: 'user-123'
      };

      const reply = await RepliesTableTestHelper.addReply(payloadAddReply);
      // Action & Assert
      if (reply?.rowCount) {
        expect(replyRepositoryPostgres.validateId(replyId)).rejects.toThrow(
          InvariantError
        );
      }
    });
  });

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
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
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
      const addedReply = await replyRepositoryPostgres.addReply(newReply);
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
      await RepliesTableTestHelper.addUser({ username: 'developer' });
      await RepliesTableTestHelper.addThread({ title: 'title baru' });
      await RepliesTableTestHelper.addComment({ content: 'comment baru' });
      await RepliesTableTestHelper.addReply({ content: 'reply baru' });

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
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
      expect(replies[0].is_delete).toStrictEqual(true);
      expect(deletedReply).toStrictEqual({ status: 'success' });
    });
  });

  describe('getRepliedComment function', () => {
    it('shoudl return getRepliedComment correclty', async () => {
      // Arrange
      const date = new Date();
      await RepliesTableTestHelper.addUser({ username: 'developer' });
      await RepliesTableTestHelper.addThread({ title: 'new title' });
      await RepliesTableTestHelper.addComment({ content: 'new comment' });
      await RepliesTableTestHelper.addReply({ date });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const replies =
        await replyRepositoryPostgres.getRepliedComment('comment-123');
      // Assert
      expect(replies[0]).toStrictEqual({
        reply_id: 'reply-123',
        comment_id: 'comment-123',
        reply_content: 'reply',
        reply_date: date,
        username: 'developer',
        reply_is_delete: false
      });
    });
  });
});
