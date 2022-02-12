import { DbAuthentication } from '@/data/usecases'
import {
  EncrypterStub,
  HashComparerStub,
  LoadAccountByEmailRepositoryStub,
  UpdateAccessTokenRepositoryStub
} from '@/tests/data/mocks'
import { mockAuthenticationParams, throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepositoryStub
  hashComparerStub: HashComparerStub
  encrypterStub: EncrypterStub
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepositoryStub
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

describe('Db Authentication', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    await sut.auth(mockAuthenticationParams())
    expect(loadAccountByEmailRepositoryStub.email).toBe(
      mockAuthenticationParams().email
    )
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    loadAccountByEmailRepositoryStub.result = null
    const accessToken = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBe(null)
  })

  it('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub, loadAccountByEmailRepositoryStub } =
      makeSut()
    await sut.auth(mockAuthenticationParams())
    expect(hashComparerStub.plaintext).toBe(mockAuthenticationParams().password)
    expect(hashComparerStub.digest).toBe(
      loadAccountByEmailRepositoryStub.result?.password
    )
  })

  it('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    hashComparerStub.isValid = false
    const accessToken = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBe(null)
  })

  it('Should call Encrypter with correct values', async () => {
    const { sut, encrypterStub, loadAccountByEmailRepositoryStub } = makeSut()
    await sut.auth(mockAuthenticationParams())
    expect(encrypterStub.plaintext).toBe(
      loadAccountByEmailRepositoryStub.result?.id
    )
  })

  it('Should return the token that Encrypter returns', async () => {
    const { sut, encrypterStub } = makeSut()
    const accessToken = await sut.auth(mockAuthenticationParams())
    expect(accessToken).toBe(encrypterStub.result)
  })

  it('Should call UpdateAccessTokenRepository with correct values', async () => {
    const {
      sut,
      updateAccessTokenRepositoryStub,
      loadAccountByEmailRepositoryStub,
      encrypterStub
    } = makeSut()
    await sut.auth(mockAuthenticationParams())
    expect(updateAccessTokenRepositoryStub.id).toBe(
      loadAccountByEmailRepositoryStub.result?.id
    )
    expect(updateAccessTokenRepositoryStub.token).toBe(encrypterStub.result)
  })
})
