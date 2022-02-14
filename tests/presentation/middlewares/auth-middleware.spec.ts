import { AccountModel } from '@/domain/models'
import { LoadAccountByToken } from '@/domain/usecases'
import { AuthMiddleware } from '@/presentation/middlewares'
import { AccessDeniedError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers'
import { HttpRequest } from '@/presentation/protocols'

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

class LoadAccountByTokenStub implements LoadAccountByToken {
  loadByToken = async (): LoadAccountByToken.Result => makeFakeAccount()
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
  password: 'hashed_password',
  role: 'any_role'
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
    const { sut, loadAccountByTokenStub } = makeSut('any_role')
    const spyLoadByToken = jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    await sut.handler(makeFakeRequest())
    expect(spyLoadByToken).toHaveBeenCalledWith('any_token')
  })

  it('Should return 403 if LoadAccountByToken returns null ', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest
      .spyOn(loadAccountByTokenStub, 'loadByToken')
      .mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should return 403 if LoadAccountByToken returns an unauthorized role', async () => {
    const { sut, loadAccountByTokenStub } = makeSut('admin')
    jest.spyOn(loadAccountByTokenStub, 'loadByToken')
    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('Should return 200 if LoadAccountByToken returns an authorized role', async () => {
    const { sut } = makeSut('any_role')
    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: makeFakeAccount().id }))
  })

  it('Should return 200 if LoadAccountByToken returns an admin account', async () => {
    const { sut, loadAccountByTokenStub } = makeSut('any_role')
    jest
      .spyOn(loadAccountByTokenStub, 'loadByToken')
      .mockReturnValueOnce(
        Promise.resolve({ ...makeFakeAccount(), role: 'admin' })
      )

    const httpResponse = await sut.handler(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: makeFakeAccount().id }))
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
