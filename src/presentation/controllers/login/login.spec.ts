import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers'
import { Validation } from '../../protocols/validation'
import { LoginController } from './login'

interface SutTypes {
  sut: LoginController
  validation: Validation
}

class ValidationStub implements Validation {
  validate = (input: any): false | Error => false
}

const makeSut = (): SutTypes => {
  const validation = new ValidationStub()
  const sut = new LoginController(validation)
  return { sut, validation }
}

describe('Login Controller', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut, validation } = makeSut()
    jest
      .spyOn(validation, 'validate')
      .mockImplementationOnce(() => new MissingParamError('email'))

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
      .mockImplementationOnce(() => new MissingParamError('password'))

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
      .mockImplementationOnce(() => new InvalidParamError('email'))

    const httpRequest = {
      body: {
        email: 'invalid_mail@mail.com',
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
})
