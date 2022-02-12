import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers'
import { LogErrorRepositoryStub } from '@/tests/data/mocks'
import { LogControllerDecorator } from '@/main/decorators'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: ControllerStub
  logErrorRepositoryStub: LogErrorRepositoryStub
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    any_field: 'any_value',
    any_field2: 'any_value2'
  }
})

class ControllerStub implements Controller {
  result = ok(makeFakeRequest())
  httpRequest: any = null
  handler = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    this.httpRequest = httpRequest
    return this.result
  }
}

const makeSut = (): SutTypes => {
  const controllerStub = new ControllerStub()
  const logErrorRepositoryStub = new LogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return { sut, controllerStub, logErrorRepositoryStub }
}

describe('LogControllerDecorator', () => {
  it('Should call the controllers handler method', async () => {
    const { sut, controllerStub } = makeSut()
    await sut.handler(makeFakeRequest())
    expect(controllerStub.httpRequest).toEqual(makeFakeRequest())
  })

  it('Should return the httpResponse of the controller', async () => {
    const { sut, controllerStub } = makeSut()
    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(controllerStub.result)
  })

  it('Should call LogErrorRepository with correct error if the controller return a server error', async () => {
    const { sut, logErrorRepositoryStub, controllerStub } = makeSut()
    const error = new Error()
    error.stack = 'valid_stack_error'
    jest
      .spyOn(controllerStub, 'handler')
      .mockImplementationOnce(async () => serverError(error))

    await sut.handler(makeFakeRequest())
    expect(logErrorRepositoryStub.stack).toBe(error.stack)
  })
})
