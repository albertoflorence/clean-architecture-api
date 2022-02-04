import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AccountModel } from '../add-account/protocols'
import { DbAuthentication } from './db-authentication.ts'

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async load(email: string): Promise<AccountModel> {
    return await Promise.resolve(makeFakeAccount())
  }
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}
const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub =
    new LoadAccountByEmailRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
  return { sut, loadAccountByEmailRepositoryStub }
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any@mail.com',
  name: 'any_name',
  password: 'any_password'
})

const makeFakeCredentials = (): AuthenticationModel => ({
  email: 'any@mail.com',
  password: 'any_password'
})

describe('Db Authentication', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

    await sut.auth(makeFakeCredentials())

    expect(loadSpy).toHaveBeenCalledWith(makeFakeCredentials().email)
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.auth(makeFakeCredentials())

    await expect(promise).rejects.toThrow()
  })

  it('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(Promise.resolve(null))
    const accessToken = await sut.auth(makeFakeAccount())
    expect(accessToken).toBe(null)
  })
})
