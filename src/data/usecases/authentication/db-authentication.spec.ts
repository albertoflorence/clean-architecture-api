import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AccountModel } from '../add-account/protocols'
import { DbAuthentication } from './db-authentication.ts'

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async load(email: string): Promise<AccountModel> {
    return await Promise.resolve(makeFakeAccount())
  }
}

class HashComparerStub implements HashComparer {
  compare = async (value: string, hash: string): Promise<boolean> => true
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
}
const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub =
    new LoadAccountByEmailRepositoryStub()
  const hashComparerStub = new HashComparerStub()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub: hashComparerStub
  }
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any@mail.com',
  name: 'any_name',
  password: 'hashed_password'
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
    const accessToken = await sut.auth(makeFakeCredentials())
    expect(accessToken).toBe(null)
  })

  it('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')

    await sut.auth(makeFakeCredentials())

    expect(compareSpy).toHaveBeenCalledWith(
      makeFakeCredentials().password,
      makeFakeAccount().password
    )
  })

  it('Should return null if HashComparer false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest
      .spyOn(hashComparerStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(false))

    const accessToken = await sut.auth(makeFakeCredentials())

    expect(accessToken).toBe(null)
  })
})
