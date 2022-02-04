import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/cryptography/hash-comparer'
import { TokenGenerator } from '../../protocols/cryptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'
import { AccountModel } from '../add-account/protocols'
import { DbAuthentication } from './db-authentication'

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async load(email: string): Promise<AccountModel> {
    return await Promise.resolve(makeFakeAccount())
  }
}

class HashComparerStub implements HashComparer {
  compare = async (value: string, hash: string): Promise<boolean> => true
}

class TokenGeneratorStub implements TokenGenerator {
  generate = async (): Promise<string> => makeToken()
}

class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
  update = async (id: string, token: string): Promise<void> => {}
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub =
    new LoadAccountByEmailRepositoryStub()
  const hashComparerStub = new HashComparerStub()
  const tokenGeneratorStub = new TokenGeneratorStub()
  const updateAccessTokenRepositoryStub = new UpdateAccessTokenRepositoryStub()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub: hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
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

const makeToken = (): string => 'any_token'

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

  it('Should call TokenGenerator with correct values', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')

    await sut.auth(makeFakeCredentials())

    expect(generateSpy).toHaveBeenCalledWith(makeFakeAccount().id)
  })

  it('Should return the token that TokenGenerator returns', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeCredentials())
    expect(accessToken).toBe(makeToken())
  })

  it('Should call TokenGenerator with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')

    await sut.auth(makeFakeCredentials())

    expect(updateSpy).toHaveBeenCalledWith(makeFakeAccount().id, makeToken())
  })
})
