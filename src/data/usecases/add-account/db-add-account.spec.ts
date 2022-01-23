import { DbAddAccount } from './db-add-account'
import { Encrypter } from '../../protocols/encrypter'
import { AddAccountRepository } from './protocols'
import { AccountModel } from '../../../domain/models/account'
import { AddAccountModel } from '../../../domain/usecases/add-account'

interface SutTypes {
  stu: DbAddAccount
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
  const stu = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
  return { stu, encrypterStub, addAccountRepositoryStub }
}

describe('DB addAccount', () => {
  it('Should call Encrypt with correct password', async () => {
    const { stu, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const account = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password'
    }
    await stu.add(account)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Should throw if Encrypter throws', async () => {
    const { stu, encrypterStub } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockImplementationOnce(async () => await Promise.reject(new Error()))
    const account = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password'
    }
    const accountAdd = stu.add(account)
    await expect(accountAdd).rejects.toThrowError(new Error())
  })

  it('Should call AddAccountRepository with correct values', async () => {
    const { stu, addAccountRepositoryStub } = makeSut()
    const encryptSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const account = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password'
    }
    await stu.add(account)
    expect(encryptSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password'
    })
  })
})
