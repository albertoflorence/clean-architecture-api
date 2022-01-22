import { InvalidParamError, MissingParamError, ServerError } from '../errors'
import { SignUpController } from './signup'
import { EmailValidator } from '../protocols'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeEmailValidatorStub = (type?: string): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      if (type === 'error') {
        throw new Error()
      } else {
        return true
      }
    }
  }
  return new EmailValidatorStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('SignUp Controller', () => {
  it('Should return http error 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handler(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return http error 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handler(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return http error 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handler(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return http error 400 if no passwordConfirm is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.handler(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'))
  })

  it('Should return http error 400 if an invalidad email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handler(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    sut.handler(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should return http error 500 if EmailValidator throws', () => {
    const sut = new SignUpController(makeEmailValidatorStub('error'))

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handler(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
