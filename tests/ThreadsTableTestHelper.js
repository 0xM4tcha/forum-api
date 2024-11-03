/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async addUser({
    id = 'user-123',
    username = 'dicoding',
    password = 'secret',
    fullname = 'Dicoding Indonesia 2'
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
    date = '2021-08-08T07:59:16.198Z',
    userId = 'user_1234'
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5)',
      values: [id, title, body, date, userId]
    };

    await pool.query(query);
  },

  async findThreadsById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id]
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
    await pool.query('DELETE FROM users WHERE 1=1');
  }
};

module.exports = ThreadsTableTestHelper;
