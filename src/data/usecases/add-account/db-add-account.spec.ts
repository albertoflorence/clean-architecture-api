import {
  DbAddAccount,
  Hasher,
  AddAccountRepository,
  AddAccountModel
} from './protocols'

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

class HasherStub implements Hasher {
  hash = async (string: string): Promise<string> => 'hashed_valid_password'
}

class AddAccountRepositoryStub implements AddAccountRepository {
  add = async (account: AddAccountModel): Promise<boolean> => true
}

const makeFakeAddAccount = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid@mail.com',
  password: 'valid_password'
})

const makeSut = (): SutTypes => {
  const hasherStub = new HasherStub()
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)
  return { sut, hasherStub, addAccountRepositoryStub }
}

describe('DB addAccount', () => {
  it('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeFakeAddAccount())
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest
      .spyOn(hasherStub, 'hash')
      .mockImplementationOnce(async () => await Promise.reject(new Error()))
    const account = sut.add(makeFakeAddAccount())
    await expect(account).rejects.toThrowError(new Error())
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const hashSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeFakeAddAccount())
    expect(hashSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'hashed_valid_password'
    })
  })

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockImplementationOnce(async () => await Promise.reject(new Error()))
    const account = sut.add(makeFakeAddAccount())
    await expect(account).rejects.toThrowError(new Error())
  })

  it('Should return true on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAddAccount())
    expect(account).toEqual(true)
  })
})
