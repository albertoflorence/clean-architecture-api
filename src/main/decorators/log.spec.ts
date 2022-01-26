import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
}

class ControllerStub implements Controller {
  handler = async (httpRequest: HttpRequest): Promise<HttpResponse> => {
    return {
      statusCode: 200,
      body: 'valid_body'
    }
  }
}

const makeSut = (): SutTypes => {
  const controllerStub = new ControllerStub()
  const sut = new LogControllerDecorator(controllerStub)
  return { sut, controllerStub }
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

  it('Should return the hpptResponse', async () => {
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
})
