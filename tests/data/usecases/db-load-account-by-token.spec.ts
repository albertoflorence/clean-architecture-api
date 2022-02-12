import { DbLoadAccountByToken } from '@/data/usecases'
import {
  DecrypterStub,
  LoadAccountByTokenRepositoryStub
} from '@/tests/data/mocks'

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: DecrypterStub
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepositoryStub
}

const makeSut = (): SutTypes => {
  const decrypterStub = new DecrypterStub()

  const loadAccountByTokenRepositoryStub =
    new LoadAccountByTokenRepositoryStub()

  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub
  )
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

const token = 'any_token'

describe('Db LoadAccountByToken', () => {
  it('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    await sut.loadByToken(token)
    expect(decrypterStub.cipherText).toBe(token)
  })

  it('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    await sut.loadByToken(token)
    expect(loadAccountByTokenRepositoryStub.token).toBe(token)
  })

  it('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    decrypterStub.result = null
    const account = await sut.loadByToken(token)
    expect(account).toBe(null)
  })

  it('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(Promise.resolve(null))
    const account = await sut.loadByToken(token)
    expect(account).toBe(null)
  })
})
