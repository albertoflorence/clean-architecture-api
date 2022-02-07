import { SignUpController } from './signup-controller'
import {
  AddAccount,
  AddAccountModel,
  AccountModel,
  HttpRequest,
  redirect,
  serverError,
  badRequest,
  Validation
} from './signup-controller-protocols'

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return makeFakeAccount()
    }
  }
  return new AddAccountStub()
}

class ValidationStub implements Validation {
  validate = (input: any): Error | null => {
    return null
  }
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccountStub()
  const validationStub = new ValidationStub()
  const sut = new SignUpController(addAccountStub, validationStub)
  return { sut, addAccountStub, validationStub }
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

  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handler(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  it('Should return 400 if validation return an error', async () => {
    const { sut, validationStub } = makeSut()
    const error = new Error()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(error)
    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(error))
  })

  it('Should return 307 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(redirect('login', 307))
  })
})
