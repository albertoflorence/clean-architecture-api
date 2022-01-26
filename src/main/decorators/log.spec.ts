import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { ok, serverError } from '../../presentation/helpers'
import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

class ControllerStub implements Controller {
  handler = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    return ok(makeFakeRequest())
  }
}

class LogErrorRepositoryStub implements LogErrorRepository {
  saveLog = async (stack: string): Promise<void> => {}
}

const makeSut = (): SutTypes => {
  const controllerStub = new ControllerStub()
  const logErrorRepositoryStub = new LogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return { sut, controllerStub, logErrorRepositoryStub }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_mail@mail.com',
    password: 'any_password',
    passwordConfirm: 'any_password'
  }
})

describe('LogControllerDecorator', () => {
  it('Should call the controllers handler method', async () => {
    const { sut, controllerStub } = makeSut()
    const handlerSpy = jest.spyOn(controllerStub, 'handler')
    await sut.handler(makeFakeRequest())
    expect(handlerSpy).toHaveBeenLastCalledWith(makeFakeRequest())
  })

  it('Should return the hpptResponse of the controller', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeRequest()))
  })

  it('Should call LogErrorRepository with correct error if the controller return a server error', async () => {
    const { sut, logErrorRepositoryStub, controllerStub } = makeSut()
    const saveLogSpy = jest.spyOn(logErrorRepositoryStub, 'saveLog')
    const error = new Error()
    error.stack = 'valid_stack_error'
    jest
      .spyOn(controllerStub, 'handler')
      .mockImplementationOnce(async () => serverError(error))

    await sut.handler(makeFakeRequest())
    expect(saveLogSpy).toHaveBeenCalledWith('valid_stack_error')
  })
})
