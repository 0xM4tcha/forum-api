const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadByIdUseCase = require('../../../../Applications/use_case/GetThreadByIdUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { title, body } = request.payload;
    const { id: userId } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute({ title, body, userId });

    const response = h.response({
      status: 'success',
      data: {
        addedThread
      }
    });
    response.code(201);
    return response;
  }

  async getThreadByIdHandler(request, h) {
    const { threadId } = request.params;

    const getThreadByIdUseCase = this._container.getInstance(
      GetThreadByIdUseCase.name
    );

    const thread = await getThreadByIdUseCase.execute({ threadId });

    const response = h.response({
      status: 'success',
      data: {
        thread
      }
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
