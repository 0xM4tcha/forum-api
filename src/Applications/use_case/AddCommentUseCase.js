const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, userRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { userId, threadId } = useCasePayload;

    await this._userRepository.verifyUserId(userId);
    await this._threadRepository.validateId(threadId);

    const comment = new AddComment(useCasePayload);
    return this._commentRepository.addComment(comment);
  }
}

module.exports = AddCommentUseCase;
