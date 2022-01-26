import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers'
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
    return {
      statusCode: 200,
      body: 'valid_body'
    }
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

describe('LogControllerDecorator', () => {
  it('Should call the controllers handler method', async () => {
    const { sut, controllerStub } = makeSut()
    const handlerSpy = jest.spyOn(controllerStub, 'handler')
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_mail@mail.com',
        password: 'valid_password',
        passwordConfirm: 'valid_password'
      }
    }
    await sut.handler(httpRequest)
    expect(handlerSpy).toHaveBeenLastCalledWith(httpRequest)
  })

  it('Should return the hpptResponse of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_mail@mail.com',
        password: 'valid_password',
        passwordConfirm: 'valid_password'
      }
    }
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse).toEqual({ statusCode: 200, body: 'valid_body' })
  })

  it('Should call LogErrorRepository with correct error if the controller return a server error', async () => {
    const { sut, logErrorRepositoryStub, controllerStub } = makeSut()
    const saveLogSpy = jest.spyOn(logErrorRepositoryStub, 'saveLog')
    const error = new Error()
    error.stack = 'valid_stack_error'
    jest
      .spyOn(controllerStub, 'handler')
      .mockImplementationOnce(async () => serverError(error))
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_mail@mail.com',
        password: 'valid_password',
        passwordConfirm: 'valid_password'
      }
    }
    await sut.handler(httpRequest)
    expect(saveLogSpy).toHaveBeenCalledWith('valid_stack_error')
  })
})
