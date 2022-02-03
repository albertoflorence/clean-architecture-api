import { Authentication } from '../../../domain/usecases/authentication'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, unauthorized } from '../../helpers'
import { HttpRequest } from '../../protocols'
import { Validation } from '../../protocols/validation'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
  validation: Validation
  authenticationStub: Authentication
}

class ValidationStub implements Validation {
  validate = (input: any): false | Error => false
}

class AuthenticationStub implements Authentication {
  auth = async (email: string, password: string): Promise<string> =>
    await Promise.resolve('any_token')
}

const makeSut = (): SutTypes => {
  const validation = new ValidationStub()
  const authenticationStub = new AuthenticationStub()
  const sut = new LoginController(validation, authenticationStub)
  return { sut, validation, authenticationStub }
}

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'invalid_mail@mail.com',
    password: 'valid_password'
  }
})

describe('Login Controller', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut, validation } = makeSut()
    jest
      .spyOn(validation, 'validate')
      .mockReturnValueOnce(new MissingParamError('email'))

    const httpRequest = {
      body: {
        password: 'valid_password'
      }
    }

    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Should return 400 if no password is provided', async () => {
    const { sut, validation } = makeSut()
    jest
      .spyOn(validation, 'validate')
      .mockReturnValueOnce(new MissingParamError('password'))

    const httpRequest = {
      body: {
        email: 'valid_mail@mail.com'
      }
    }
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Should return 400 if a invalid email is provided', async () => {
    const { sut, validation } = makeSut()
    jest
      .spyOn(validation, 'validate')
      .mockReturnValueOnce(new InvalidParamError('email'))

    const httpResponse = await sut.handler(makeFakeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should return 500 if Validation throws', async () => {
    const { sut, validation } = makeSut()
    jest.spyOn(validation, 'validate').mockImplementation(() => {
      throw new Error()
    })
    const httpResponse = await sut.handler(makeFakeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handler(makeFakeHttpRequest())
    expect(httpResponse).toEqual(unauthorized())
  })
})
