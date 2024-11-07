class DeleteCommentUseCase {
  constructor({ commentRepository, userRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { userId, threadId } = useCasePayload;

    await this._userRepository.verifyUserId(userId);
    await this._threadRepository.validateId(threadId);
    await this._commentRepository.validateOwner(useCasePayload);

    await this._commentRepository.deleteComment(useCasePayload);

    return {
      status: 'success'
    };
  }
}

module.exports = DeleteCommentUseCase;
