const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
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

  // async deleteComment(payload) {
  //   const { commentId, userId } = payload;
  //   const content = '**komentar telah dihapus**';
  //   const date = new Date().toISOString();

  //   const query = {
  //     text: `UPDATE comments
  //       SET content = $2, date = $3
  //       WHERE id = $1 AND owner = $4`,
  //     values: [commentId, content, date, userId]
  //   };

  //   await this._pool.query(query);

  //   return {
  //     status: 'success'
  //   };
  // }
}

module.exports = ReplyRepositoryPostgres;
