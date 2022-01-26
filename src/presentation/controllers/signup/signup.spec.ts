import { SignUpController } from './signup'
import {
  EmailValidator,
  InvalidParamError,
  MissingParamError,
  AddAccount,
  AddAccountModel,
  AccountModel,
  HttpRequest,
  ok,
  serverError,
  badRequest
} from './signup-protocols'

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
    async add(account: AddAccountModel): Promise<AccountModel> {
      return makeFakeAccount()
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

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'any_name',
  email: 'any_mail@mail.com',
  password: 'any_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_mail@mail.com',
    password: 'any_password',
    passwordConfirm: 'any_password'
  }
})

describe('SignUp Controller', () => {
  it('Should return http error 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return http error 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return http error 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirm: 'any_password'
      }
    }
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return http error 400 if no passwordConfirm is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'))
  })

  it('Should return http error 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirm: 'invalid_password'
      }
    }
    const httpResponse = await sut.handler(httpRequest)
    expect(httpResponse).toEqual(
      badRequest(new InvalidParamError('passwordConfirm'))
    )
  })

  it('Should return http error 400 if an invalidad email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Should call EmailValidator with correct email', async () => {
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
    await sut.handler(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should return http error 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(serverError())
  })

  it('Should call addAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addAccountSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handler(makeFakeRequest())
    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password'
    })
  })

  it('Should return http error 500 if addAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })
    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(serverError())
  })

  it('Should return http 200', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
})
