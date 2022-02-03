import {
  Authentication,
  badRequest,
  serverError,
  unauthorized,
  HttpRequest,
  Validation,
  LoginController,
  ok
} from './login-protocols'

interface SutTypes {
  sut: LoginController
  validationStub: Validation
  authenticationStub: Authentication
}

class ValidationStub implements Validation {
  validate = (input: any): Error | null => null
}

class AuthenticationStub implements Authentication {
  auth = async (email: string, password: string): Promise<string | null> =>
    await Promise.resolve('any_token')
}

const makeSut = (): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationStub = new AuthenticationStub()
  const sut = new LoginController(validationStub, authenticationStub)
  return { sut, validationStub, authenticationStub }
}

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'invalid_mail@mail.com',
    password: 'valid_password'
  }
})

describe('Login Controller', () => {
  it('Should call validate with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handler(makeFakeHttpRequest())

    expect(validateSpy).toHaveBeenLastCalledWith(makeFakeHttpRequest().body)
  })

  it('Should return 500 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
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

  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(Promise.reject(new Error()))

    const httpResponse = await sut.handler(makeFakeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 400 if Validation return a error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handler(makeFakeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  it('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handler(makeFakeHttpRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })
})
