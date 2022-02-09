import { AccountModel } from '../../domain/models/account'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden } from '../helpers'
import { HttpRequest } from '../protocols'
import { AuthMiddleware } from './auth-middleware'

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

class LoadAccountByTokenStub implements LoadAccountByToken {
  loadByToken = async (token: string): Promise<AccountModel | null> =>
    makeFakeAccount()
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = new LoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
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
    const { sut, loadAccountByTokenStub } = makeSut()
    const spyLoadByToken = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    await sut.handler(makeFakeRequest())
    expect(spyLoadByToken).toHaveBeenCalledWith('any_token')
  })
})
