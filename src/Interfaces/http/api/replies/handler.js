// const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    // this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { content } = request.payload;
    const { threadId, commentId } = request.params;
    const { id: userId } = request.auth.credentials;

    const addReplyUseCase = this._container.getInstance(
      AddReplyUseCase.name
    );
    
    const addedReply = await addReplyUseCase.execute({
      threadId,
      content,
      userId,
      commentId
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply
      }
    });
    response.code(201);
    return response;
  }

  // async deleteCommentHandler(request, h) {
  //   const { threadId, commentId } = request.params;
  //   const { id: userId } = request.auth.credentials;

  //   const deleteCommentUseCase = this._container.getInstance(
  //     DeleteCommentUseCase.name
  //   );

  //   await deleteCommentUseCase.execute({
  //     threadId,
  //     commentId,
  //     userId
  //   });

  //   const response = h.response({ status: 'success' });

  //   response.code(200);
  //   return response;
  // }
}

module.exports = RepliesHandler;
