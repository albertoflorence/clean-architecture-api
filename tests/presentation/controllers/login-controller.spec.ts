import {
  serverError,
  unauthorized,
  badRequest,
  ok
} from '@/presentation/helpers'
import { HttpRequest } from '@/presentation/protocols'
import { LoginController } from '@/presentation/controllers'
import { AuthenticationStub, ValidationStub } from '@/tests/presentation/mocks'
import { mockAuthenticationParams, throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: LoginController
  validationStub: ValidationStub
  authenticationStub: AuthenticationStub
}

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationStub = new AuthenticationStub()
  const sut = new LoginController(validationStub, authenticationStub)
  return { sut, validationStub, authenticationStub }
}

const mockRequest = (): HttpRequest => ({
  body: mockAuthenticationParams()
})

describe('Login Controller', () => {
  it('Should call validate with correct values', async () => {
    const { sut, validationStub } = makeSut()
    await sut.handler(mockRequest())
    expect(validationStub.input).toEqual(mockRequest().body)
  })

  it('Should return 500 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(throwError)
    const httpResponse = await sut.handler(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    authenticationStub.result = null
    const httpResponse = await sut.handler(mockRequest())
    expect(httpResponse).toEqual(unauthorized())
  })

  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handler(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 400 if Validation return a error', async () => {
    const { sut, validationStub } = makeSut()
    validationStub.result = new Error()
    const httpResponse = await sut.handler(mockRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  it('Should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    const httpResponse = await sut.handler(mockRequest())
    expect(httpResponse).toEqual(ok({ accessToken: authenticationStub.result }))
  })
})
