import { SignUpController } from './signup'
import {
  EmailValidator,
  InvalidParamError,
  MissingParamError,
  AddAccount,
  AddAccountModel,
  AccountModel,
  ServerError
} from './signupProtocols'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      return {
        id: 'valid_id',
        ...account
      }
    }
  }
  return new AddAccountStub()
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidatorStub()
  const addAccountStub = makeAddAccountStub()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return { sut, emailValidatorStub, addAccountStub }
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

  it('Should return http error 400 if password confirmation fails', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'invalid_password'
      }
    }
    const httpResponse = sut.handler(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirm'))
  })

  it('Should return http error 400 if an invalidad email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
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
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handler(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call addAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const addAccountSpy = jest.spyOn(addAccountStub, 'add')

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    sut.handler(httpRequest)
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'invalid_email',
      password: 'any_password'
    })
  })

  it('Should return http error 500 if addAccount throws', () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = sut.handler(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  it('Should return http 200', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirm: 'valid_password'
      }
    }
    const httpResponse = sut.handler(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  })
})
