import {
  LoadAccountByEmailRepository,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository
} from '@/data/protocols'
import { DbAuthentication } from '@/data/usecases'
import { AccountModel } from '@/domain/models'
import { AuthenticationModel } from '@/domain/usecases'

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
  async loadByEmail(email: string): Promise<AccountModel> {
    return await Promise.resolve(makeFakeAccount())
  }
}

class HashComparerStub implements HashComparer {
  compare = async (value: string, hash: string): Promise<boolean> => true
}

class EncrypterStub implements Encrypter {
  encrypt = async (): Promise<string> => makeToken()
}

class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
  updateAccessToken = async (id: string, token: string): Promise<void> => {}
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub =
    new LoadAccountByEmailRepositoryStub()
  const hashComparerStub = new HashComparerStub()
  const encrypterStub = new EncrypterStub()
  const updateAccessTokenRepositoryStub = new UpdateAccessTokenRepositoryStub()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub: hashComparerStub,
    encrypterStub,
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
    const loadByEmailSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail'
    )

    await sut.auth(makeFakeCredentials())

    expect(loadByEmailSpy).toHaveBeenCalledWith(makeFakeCredentials().email)
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.auth(makeFakeCredentials())

    await expect(promise).rejects.toThrow()
  })

  it('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
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

  it('Should call Encrypter with correct values', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.auth(makeFakeCredentials())

    expect(encrypterSpy).toHaveBeenCalledWith(makeFakeAccount().id)
  })

  it('Should return the token that Encrypter returns', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeCredentials())
    expect(accessToken).toBe(makeToken())
  })

  it('Should call Encrypter with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      'updateAccessToken'
    )

    await sut.auth(makeFakeCredentials())

    expect(updateSpy).toHaveBeenCalledWith(makeFakeAccount().id, makeToken())
  })
})
