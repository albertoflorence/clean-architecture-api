import { serverError, badRequest, redirect } from '@/presentation/helpers'
import { HttpRequest } from '@/presentation/protocols'
import { SignUpController } from '@/presentation/controllers'
import { AddAccountStub, ValidationAsyncStub } from '../mocks'
import { mockAddAccountParams, throwError } from '../../domain/mocks'

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccountStub
  validationStub: ValidationAsyncStub
}

const makeSut = (): SutTypes => {
  const addAccountStub = new AddAccountStub()
  const validationStub = new ValidationAsyncStub()
  const sut = new SignUpController(addAccountStub, validationStub)
  return { sut, addAccountStub, validationStub }
}

const mockRequest = (): HttpRequest => ({
  body: {
    ...mockAddAccountParams(),
    passwordConfirm: 'any_password'
  }
})

describe('SignUp Controller', () => {
  it('Should call addAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    await sut.handler(mockRequest())
    expect(addAccountStub.account).toEqual(mockAddAccountParams())
  })

  it('Should return http error 500 if addAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handler(mockRequest())
    expect(httpResponse).toEqual(serverError())
  })

  it('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    await sut.handler(mockRequest())
    expect(validationStub.input).toEqual(mockRequest().body)
  })

  it('Should return 400 if validation return an error', async () => {
    const { sut, validationStub } = makeSut()
    validationStub.result = new Error()
    const httpResponse = await sut.handler(mockRequest())
    expect(httpResponse).toEqual(badRequest(validationStub.result))
  })

  it('Should return 307 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handler(mockRequest())
    expect(httpResponse).toEqual(redirect('login', 307))
  })
})
