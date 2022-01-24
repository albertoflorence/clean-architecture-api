import {
  DbAddAccount,
  Encrypter,
  AddAccountRepository,
  AccountModel,
  AddAccountModel
} from './protocols'

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

class EncrypterStub implements Encrypter {
  encrypt = async (string: string): Promise<string> =>
    await Promise.resolve('encrypted_valid_password')
}

class AddAccountRepositoryStub implements AddAccountRepository {
  add = async (account: AddAccountModel): Promise<AccountModel> => {
    return {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'encrypted_valid_password'
    }
  }
}

const makeSut = (): SutTypes => {
  const encrypterStub = new EncrypterStub()
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return { sut, encrypterStub, addAccountRepositoryStub }
}

describe('DB addAccount', () => {
  it('Should call Encrypt with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const account = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password'
    }
    await sut.add(account)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockImplementationOnce(async () => await Promise.reject(new Error()))
    const account = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password'
    }
    const accountAdd = sut.add(account)
    await expect(accountAdd).rejects.toThrowError(new Error())
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const encryptSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const account = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password'
    }
    await sut.add(account)
    expect(encryptSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'encrypted_valid_password'
    })
  })

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockImplementationOnce(async () => await Promise.reject(new Error()))
    const account = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password'
    }
    const accountAdd = sut.add(account)
    await expect(accountAdd).rejects.toThrowError(new Error())
  })

  it('Should return a account on success', async () => {
    const { sut } = makeSut()
    const account = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password'
    }
    const createdAccount = await sut.add(account)
    expect(createdAccount).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'encrypted_valid_password'
    })
  })
})
