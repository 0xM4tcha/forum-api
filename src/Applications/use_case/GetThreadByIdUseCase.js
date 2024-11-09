class GetThreadByIdUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId } = useCasePayload;

    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentedThread(threadId);
    const replies = await this._replyRepository.getRepliedComment(commentId);

    return {
      id: thread.thread_id,
      title: thread.thread_title,
      body: thread.thread_body,
      date: thread.thread_date,
      username: thread.username,
      comments:
        comments.length > 0 &&
        Object.values(
          comments.reduce((acc, row) => {
            if (!acc[row.comment_id]) {
              acc[row.comment_id] = {
                id: row.comment_id,
                username: row.username,
                date: row.comment_date,
                content: row.comment_is_delete
                  ? '**komentar telah dihapus**'
                  : row.comment_content,
                replies: []
              };
            }

            acc[row.comment_id].replies = replies
              .filter((reply) => reply.comment_id === row.comment_id)
              .map((reply) => ({
                id: reply.reply_id,
                username: reply.username,
                date: reply.username,
                content: reply.reply_is_delete
                  ? '**balasan telah dihapus**'
                  : reply.reply_content
              }));

            return acc;
          }, {})
        )
    };
  }
}

module.exports = GetThreadByIdUseCase;
