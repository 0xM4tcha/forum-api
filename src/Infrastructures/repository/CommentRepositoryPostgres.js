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

  async validateOwner(payload) {
    const { commentId, userId } = payload;
    const query = {
      text: 'SELECT * FROM comments Where id = $1',
      values: [commentId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Comment Not Found');
    }

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
    const content = '**komentar telah dihapus**';
    const date = new Date().toISOString();

    const query = {
      text: `UPDATE comments
        SET content = $2, date = $3
        WHERE id = $1 AND owner = $4`,
      values: [commentId, content, date, userId]
    };

    await this._pool.query(query);

    return {
      status: 'success'
    };
  }
}

module.exports = CommentRepositoryPostgres;
