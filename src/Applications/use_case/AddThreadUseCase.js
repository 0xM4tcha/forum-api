const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository, userRepository }) {
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async execute(useCasePayload) {
    const { userId } = useCasePayload;
    await this._userRepository.verifyUserId(userId);
    const addThread = new AddThread(useCasePayload);
    return this._threadRepository.addThread(addThread);
  }
}

module.exports = AddThreadUseCase;
