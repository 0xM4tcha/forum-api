/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addUser({
    id = 'user-123',
    username = 'dicoding',
    password = 'secret',
    fullname = 'Dicoding Indonesia'
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4)',
      values: [id, username, password, fullname]
    };

    await pool.query(query);
  },

  async addThread({
    id = 'thread-123',
    title = 'dicoding',
    body = 'dicoding indonesia',
    date = '2024-08-08T07:59:16.198Z',
    userId = 'user-123'
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, date, userId]
    };

    await pool.query(query);
  },

  async addComment({
    id = 'comment-123',
    threadId = 'thread-123',
    content = 'comment',
    date = '2024-10-08T07:59:16.198Z',
    userId = 'user-123'
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5)',
      values: [id, threadId, content, date, userId]
    };
    await pool.query(query);
  },

  async addReply({
    id = 'reply-123',
    commentId = 'comment-123',
    content = 'reply',
    date = '2024-10-08T07:59:16.198Z',
    userId = 'user-123'
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5)',
      values: [id, commentId, content, date, userId]
    };
    await pool.query(query);
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id]
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
    await pool.query('DELETE FROM users WHERE 1=1');
    await pool.query('DELETE FROM comments WHERE 1=1');
    await pool.query('DELETE FROM replies WHERE 1=1');
  }
};

module.exports = RepliesTableTestHelper;
