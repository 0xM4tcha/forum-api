const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async validateId(threadId) {
    const query = {
      text: 'SELECT * FROM threads Where id = $1',
      values: [threadId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('threadId tidak valid');
    }
  }

  async addThread(newThread) {
    const { title, body, userId } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, userId]
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadById(threadId) {
    try {
      const query = {
        text: `SELECT 
              t.id AS id,
              t.title AS title,
              t.body AS body,
              t.date AS date,
              u.username,
              c.id AS comment_id,
              c.date AS comment_date,
              c.content AS comment_content,
              us.username AS comment_username
            FROM 
                threads t
            JOIN 
                comments c ON t.id = c.thread_id
            JOIN
                users u ON t.owner = u.id
            JOIN
                users us ON c.owner = us.id
            WHERE 
              t.id = $1`,
        values: [threadId]
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError('Thread tidak ditemukan');
      }

      const comments = result.rows.sort((a, b) => new Date(a.comment_date) - new Date(b.comment_date))

      return {
        id: result.rows[0].id,
        title: result.rows[0].title,
        body: result.rows[0].body,
        date: result.rows[0].date,
        username: result.rows[0].username,
        comments: comments.map((row) => ({
          id: row.comment_id,
          username: row.comment_username,
          date: row.comment_date,
          content: row.comment_content,
        })),
      };

    } catch (error) {
      console.log('error', error);
    }
  }
}

module.exports = ThreadRepositoryPostgres;
