const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async validateId(replyId) {
    const query = {
      text: 'SELECT * FROM replies Where id = $1',
      values: [replyId]
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Reply Not Found');
    }
  }

  async validateOwner(payload) {
    const { replyId, userId } = payload;

    const query = {
      text: 'SELECT * FROM replies Where id = $1',
      values: [replyId]
    };

    const result = await this._pool.query(query);

    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('AuthorizationError');
    }
  }

  async addReply(newReply) {
    const { commentId, content, userId } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, commentId, content, date, userId]
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReply(payload) {
    const { replyId, userId } = payload;
    // const content = '**balasan telah dihapus**';
    const date = new Date().toISOString();

    const query = {
      text: `UPDATE replies
        SET is_delete = true, date = $2
        WHERE id = $1 AND owner = $3`,
      values: [replyId, date, userId]
    };

    await this._pool.query(query);

    return {
      status: 'success'
    };
  }
}

module.exports = ReplyRepositoryPostgres;
