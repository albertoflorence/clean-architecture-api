import { AccountModel } from '../../domain/models/account'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden, ok, serverError } from '../helpers'
import { HttpRequest } from '../protocols'
import { AuthMiddleware } from './auth-middleware'

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

class LoadAccountByTokenStub implements LoadAccountByToken {
  loadByToken = async (
    token: string,
    role?: string
  ): Promise<AccountModel | null> => makeFakeAccount()
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = new LoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return { sut, loadAccountByTokenStub }
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeFakeRequest = (): HttpRequest => ({
  headers: { 'x-access-token': 'any_token' }
})

describe('Auth Middleware', () => {
  it('Should return 403 if no x-access-token exist in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handler({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should call LoadAccountByToken with correct accessToken ', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const spyLoadByToken = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    await sut.handler(makeFakeRequest())
    expect(spyLoadByToken).toHaveBeenCalledWith('any_token', role)
  })

  it('Should return 403 if LoadAccountByToken returns null ', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest
      .spyOn(loadAccountByTokenStub, 'loadByToken')
      .mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handler(makeFakeRequest())
    const accountId = makeFakeAccount().id
    expect(httpResponse).toEqual(ok({ accountId }))
  })

  it('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest
      .spyOn(loadAccountByTokenStub, 'loadByToken')
      .mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handler(makeFakeRequest())

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})