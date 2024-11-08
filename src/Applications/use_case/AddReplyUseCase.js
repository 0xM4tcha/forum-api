const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({
    replyRepository,
    threadRepository,
    userRepository,
    commentRepository
  }) {
    this._replyRepository = replyRepository;
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { userId, threadId, commentId } = useCasePayload;

    await this._userRepository.verifyUserId(userId);
    await this._threadRepository.validateId(threadId);
    await this._commentRepository.validateId(commentId);

    const reply = new AddReply(useCasePayload);

    return this._replyRepository.addReply(reply);
  }
}

module.exports = AddReplyUseCase;
