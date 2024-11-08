class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, userRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { userId, threadId, commentId, replyId } = useCasePayload;

    await this._userRepository.verifyUserId(userId);
    await this._threadRepository.validateId(threadId);
    await this._commentRepository.validateId(commentId);
    await this._replyRepository.validateId(replyId);
    await this._replyRepository.validateOwner(useCasePayload);

    await this._replyRepository.deleteReply(useCasePayload);

    return {
      status: 'success'
    };
  }

}

module.exports = DeleteReplyUseCase;
