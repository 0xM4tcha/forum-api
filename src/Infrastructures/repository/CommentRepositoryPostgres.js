const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async validateId(commentId) {
    const query = {
      text: 'SELECT * FROM comments Where id = $1',
      values: [commentId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Comment Not Found');
    }
  }

  async validateOwner(payload) {
    const { commentId, userId } = payload;
    const query = {
      text: 'SELECT * FROM comments Where id = $1',
      values: [commentId]
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('AuthorizationError');
    }
  }

  async addComment(newComment) {
    const { threadId, content, userId } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, threadId, content, date, userId]
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(payload) {
    const { commentId, userId } = payload;
    const date = new Date().toISOString();

    const query = {
      text: `UPDATE comments
        SET is_delete = true, date = $2
        WHERE id = $1 AND owner = $3`,
      values: [commentId, date, userId]
    };

    await this._pool.query(query);

    return {
      status: 'success'
    };
  }

  async getCommentedThread(threadId) {
    const query = {
      text: `SELECT
        c.id AS comment_id,
        c.date AS comment_date,
        c.content AS comment_content,
        c.is_delete AS comment_is_delete,
        c.thread_id AS thread_id,
        u.username AS username
      From
        comments c
      JOIN
        users u ON c.owner = u.id
      WHERE
        c.thread_id = $1`,
      values: [threadId]
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Comment tidak ditemukan');
    }

    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
